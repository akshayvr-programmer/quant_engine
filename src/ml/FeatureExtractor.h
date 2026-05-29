#pragma once

#include <vector>


class FeatureExtractor {
public:
    static double calculateMomentum(const std::vector<double>& prices);

    static double calculateVolatility(const std::vector<double>& prices);
};