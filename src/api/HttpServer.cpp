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

        std::string body =
            router.route(
                HttpMethod::GET,
                std::string(request.target())
            );

        http::response<http::string_body> response{
            http::status::ok,
            request.version()
        };

        response.set(
            http::field::content_type,
            "application/json"
        );

        response.body() = body;

        response.prepare_payload();

        http::write(socket, response);
    }
}