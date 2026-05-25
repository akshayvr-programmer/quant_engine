//
// Created by axoss-scott on 5/25/26.
//
#include <iostream>
#include "MovingAverageStrategy.h"

MovingAverageStrategy::MovingAverageStrategy(size_t windowSize) : windowSize(windowSize) {



}

void MovingAverageStrategy::onTick(const Tick &tick) {
    prices.push_back(tick.price);

    if (prices.size() > windowSize) {
        prices.pop_front();
    }

    double average = calculateAverage();

    Signal signal = generateSignal(tick.price, average);


    std::cout
    << "Price: " << tick.price
    << " | MA: " << average
    << " | Signal: " ;

    switch (signal) {
        case Signal::BUY:
            std::cout << "BUY";
            break;
        case Signal::SELL:
            std::cout<<"SELL";
            break;
        case Signal::HOLD:
            std::cout << "HOLD" ;
            break;


    }

    std::cout << std::endl;



}

double MovingAverageStrategy::calculateAverage() const {

    if (prices.empty()) {
        return 0.0;
    }

    double sum = 0.0;

    for (const auto& price : prices) {
        sum += price;
    }
    return sum/prices.size();

}

Signal MovingAverageStrategy::generateSignal(double price, double average) const {
    if (price > average) {
        return Signal::BUY;
    }
    if (price < average) {
        return Signal::SELL;
    }

    return Signal::HOLD;

}
