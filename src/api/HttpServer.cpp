#include "HttpServer.h"

#include <boost/asio.hpp>
#include <boost/beast.hpp>

using tcp = boost::asio::ip::tcp;
namespace http = boost::beast::http;

HttpServer::HttpServer(PaperBroker& broker)
    : broker(broker),
      router(broker)
{
}

void HttpServer::start()
{
    boost::asio::io_context io;

    tcp::acceptor acceptor(
        io,
        tcp::endpoint(tcp::v4(), 8080)
    );

    while (true)
    {
        tcp::socket socket(io);

        acceptor.accept(socket);

        boost::beast::flat_buffer buffer;

        http::request<http::string_body> request;

        http::read(socket, buffer, request);

        if (request.method() == http::verb::options)
        {
            http::response<http::string_body> response(
                http::status::no_content,
                request.version()
            );

            response.set(http::field::access_control_allow_origin, "*");
            response.set(http::field::access_control_allow_methods, "GET, POST, OPTIONS");
            response.set(http::field::access_control_allow_headers, "Content-Type");

            response.prepare_payload();

            http::write(socket, response);

            continue;
        }
        

        // Convert Beast method -> our enum
        HttpMethod method;

        switch (request.method())
        {
            case http::verb::get:
                method = HttpMethod::GET;
                break;

            case http::verb::post:
                method = HttpMethod::POST;
                break;

            default:
                method = HttpMethod::GET;
                break;
        }

        // Router returns JSON as a string
        std::string responseBody =
            router.route(
                method,
                std::string(request.target()),
                request.body()
            );

        // Build HTTP response
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
    "*");

        response.set(
            http::field::access_control_allow_methods,
            "GET, POST, OPTIONS");

        response.set(
            http::field::access_control_allow_headers,
            "Content-Type");

        response.body() = responseBody;

        response.prepare_payload();

        http::write(socket, response);
    }
}