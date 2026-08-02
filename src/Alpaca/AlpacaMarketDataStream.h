#pragma once

#include <atomic>
#include <string>
#include <thread>
#include <vector>

class MarketDataFeed;

class AlpacaMarketDataStream
{
public:

    AlpacaMarketDataStream(
        std::string apiKey,
        std::string secretKey,
        MarketDataFeed& feed
    );

    ~AlpacaMarketDataStream();

    void start(
        const std::vector<std::string>& symbols
    );

    void stop();

    bool isRunning() const;

private:

    void run(
        std::vector<std::string> symbols
    );

    std::string apiKey;

    std::string secretKey;

    MarketDataFeed& feed;

    std::atomic<bool> running{false};

    std::thread worker;
};