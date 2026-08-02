#include "AlpacaMarketDataStream.h"
#include <thread>
#include <utility>
#include "../market data/MarketDataFeed.h"
#include <boost/asio.hpp>
#include <boost/beast/core.hpp>
#include <boost/beast/websocket.hpp>
#include <boost/beast/ssl.hpp>
#include <openssl/ssl.h>
#include <nlohmann/json.hpp>
#include <iostream>
#include "../market data/Tick.h"
using tcp = boost::asio::ip::tcp;
namespace ssl = boost::asio::ssl;
namespace websocket = boost::beast::websocket;

AlpacaMarketDataStream::AlpacaMarketDataStream(
    std::string apiKey,
    std::string secretKey,
    MarketDataFeed& feed
)
    : apiKey(std::move(apiKey)),
      secretKey(std::move(secretKey)),
      feed(feed)
{
}

AlpacaMarketDataStream::~AlpacaMarketDataStream()
{
    stop();
}

void AlpacaMarketDataStream::start(
    const std::vector<std::string>& symbols
)
{
    if (running.exchange(true))
    {
        return;
    }

    worker = std::thread(
        &AlpacaMarketDataStream::run,
        this,
        symbols
    );
}

void AlpacaMarketDataStream::stop()
{
    if (!running.exchange(false))
    {
        return;
    }

    if (worker.joinable())
    {
        worker.join();
    }
}

bool AlpacaMarketDataStream::isRunning() const
{
    return running.load();
}


void AlpacaMarketDataStream::run(
    std::vector<std::string> symbols
)
{
    try
    {
        std::cout << "Inside stream thread\n";

        boost::asio::io_context io;

        ssl::context ctx(
            ssl::context::tls_client
        );

        ctx.set_default_verify_paths();

        tcp::resolver resolver(io);

        websocket::stream<
            boost::beast::ssl_stream<
                tcp::socket
            >
        > ws(io, ctx);

        auto endpoints =
            resolver.resolve(
                "stream.data.alpaca.markets",
                "443"
            );

        boost::asio::connect(
            ws.next_layer().next_layer(),
            endpoints
        );

        SSL_set_tlsext_host_name(
            ws.next_layer().native_handle(),
            "stream.data.alpaca.markets"
        );

        ws.next_layer().handshake(
            ssl::stream_base::client
        );

        ws.handshake(
            "stream.data.alpaca.markets",
            "/v2/iex"
        );

        boost::beast::flat_buffer buffer;

        // Connected
        ws.read(buffer);

        std::cout
            << boost::beast::buffers_to_string(
                buffer.data()
            )
            << std::endl;

        buffer.consume(buffer.size());

        // Authenticate
        nlohmann::json auth = {
            {"action", "auth"},
            {"key", apiKey},
            {"secret", secretKey}
        };

        ws.write(
            boost::asio::buffer(
                auth.dump()
            )
        );

        ws.read(buffer);

        std::cout
            << boost::beast::buffers_to_string(
                buffer.data()
            )
            << std::endl;

        buffer.consume(buffer.size());

        // Subscribe
        nlohmann::json subscribe = {
            {"action", "subscribe"},
            {"trades", symbols}
        };

        ws.write(
            boost::asio::buffer(
                subscribe.dump()
            )
        );

        ws.read(buffer);

        std::cout
            << boost::beast::buffers_to_string(
                buffer.data()
            )
            << std::endl;

        buffer.consume(buffer.size());

        // Live stream
        while (running.load())
        {
            ws.read(buffer);

            std::string message =
                boost::beast::buffers_to_string(
                    buffer.data()
                );

            buffer.consume(buffer.size());

            auto json =
                nlohmann::json::parse(message);

            if (!json.is_array())
            {
                continue;
            }

            for (const auto& event : json)
            {
                if (!event.contains("T"))
                {
                    continue;
                }

                if (event["T"] != "t")
                {
                    continue;
                }

                Tick tick(
                    event["S"].get<std::string>(),
                    event["p"].get<double>(),
                    event["s"].get<double>(),
                    0
                );

                feed.addTick(tick);

                std::cout
                    << tick.symbol
                    << " "
                    << tick.price
                    << " "
                    << tick.volume
                    << '\n';
            }
        }

        boost::system::error_code ec;

        ws.close(
            websocket::close_code::normal,
            ec
        );
    }
    catch (const std::exception& e)
    {
        std::cerr
            << "Alpaca Stream Error: "
            << e.what()
            << std::endl;
    }
}