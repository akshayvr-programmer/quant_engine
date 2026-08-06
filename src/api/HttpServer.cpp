#include "HttpServer.h"
#include <iostream>

#include <boost/asio.hpp>
#include <boost/beast.hpp>

using tcp = boost::asio::ip::tcp;
namespace http = boost::beast::http;

HttpServer::HttpServer(
    PaperBroker& broker,
    MarketDataFeed& feed,
    StrategyRuntime& strategyRuntime
)
    : broker(broker),
      feed(feed),
      router(broker, feed, strategyRuntime)

{
}

void HttpServer::start()
{
    boost::asio::io_context io;

    tcp::acceptor acceptor(
        io,
        tcp::endpoint(tcp::v4(), 8080)
    );

    std::cout << "HTTP Server listening on port 8080...\n";

    while (true)
    {
        try
        {
            tcp::socket socket(io);

            acceptor.accept(socket);

            boost::beast::flat_buffer buffer;
            http::request<http::string_body> request;

            boost::system::error_code ec;

            http::read(socket, buffer, request, ec);

            if (ec == http::error::end_of_stream)
            {
                socket.shutdown(tcp::socket::shutdown_send, ec);
                continue;
            }

            if (ec)
            {
                std::cerr << "Read Error: "
                          << ec.message()
                          << std::endl;
                continue;
            }

            // Handle CORS preflight
            if (request.method() == http::verb::options)
            {
                http::response<http::string_body> response(
                    http::status::no_content,
                    request.version()
                );

                response.set(http::field::access_control_allow_origin, "*");
                response.set(http::field::access_control_allow_methods, "GET, POST, DELETE, OPTIONS");
                response.set(http::field::access_control_allow_headers, "Content-Type");

                response.prepare_payload();

                http::write(socket, response);

                socket.shutdown(tcp::socket::shutdown_send, ec);

                continue;
            }

            HttpMethod method;

            switch (request.method())
            {
                case http::verb::get:
                    method = HttpMethod::GET;
                    break;

                case http::verb::post:
                    method = HttpMethod::POST;
                    break;

                case http::verb::delete_:
                    method = HttpMethod::DELETE_;
                    break;

                default:
                    method = HttpMethod::GET;
                    break;
            }

            std::string responseBody =
                router.route(
                    method,
                    std::string(request.target()),
                    request.body()
                );

            http::response<http::string_body> response(
                http::status::ok,
                request.version()
            );

            response.set(
                http::field::content_type,
                "application/json"
            );

            response.set(
                http::field::access_control_allow_origin,
                "*"
            );

            response.set(
                http::field::access_control_allow_methods,
                "GET, POST, DELETE, OPTIONS"
            );

            response.set(
                http::field::access_control_allow_headers,
                "Content-Type"
            );

            response.body() = responseBody;

            response.prepare_payload();

            http::write(socket, response);

            socket.shutdown(tcp::socket::shutdown_send, ec);
        }
        catch (const std::exception& e)
        {
            std::cerr
                << "HTTP Server Error: "
                << e.what()
                << std::endl;
        }
    }
}
