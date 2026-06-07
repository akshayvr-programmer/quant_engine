//
// Created by axoss-scott on 5/26/26.
//

#include "HistoricalDataPlayer.h"

#include <fstream>
#include <iostream>
#include <sstream>

HistoricalDataPlayer::HistoricalDataPlayer(
    const std::string& filename
)
    : filename(filename)
{
}

void HistoricalDataPlayer::replay(
    MarketDataFeed& feed
)
{
    std::cout
        << "Opening file: "
        << filename
        << std::endl;

    std::ifstream file(filename);

    if (!file.is_open())
    {
        std::cout
            << "Failed to Open File"
            << std::endl;

        return;
    }

    // Skip CSV header:
    // symbol,price,volume,timestamp
    std::string header;
    std::getline(file, header);

    std::string line;

    while (std::getline(file, line))
    {
        if (line.empty())
        {
            continue;
        }

        std::stringstream ss(line);

        std::string symbol;
        std::string token;

        double price;
        double volume;
        long long timestamp;

        std::getline(
            ss,
            symbol,
            ','
        );

        std::getline(
            ss,
            token,
            ','
        );

        price =
            std::stod(token);

        std::getline(
            ss,
            token,
            ','
        );

        volume =
            std::stod(token);

        std::getline(
            ss,
            token,
            ','
        );

        timestamp =
            std::stoll(token);

        Tick tick(
            symbol,
            price,
            volume,
            timestamp
        );

        feed.addTick(tick);
    }

    file.close();
}