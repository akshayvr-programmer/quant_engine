//
// Created by axoss-scott on 5/29/26.
//

#include "FeatureExtractor.h"


#include "FeatureExtractor.h"
#include <cmath>

double FeatureExtractor::calculateVolatility(
    const std::vector<double>& prices
)
{
    if (prices.size() < 2) {
        return 0.0;
    }

    std::vector<double> returns;

    for (size_t i = 1; i < prices.size(); i++)
    {
        double r =
            (prices[i] - prices[i - 1])
            / prices[i - 1];

        returns.push_back(r);
    }

    double mean = 0.0;

    for (double r : returns)
    {
        mean += r;
    }

    mean /= returns.size();

    double variance = 0.0;

    for (double r : returns)
    {
        variance +=
            (r - mean)
            * (r - mean);
    }

    variance /= returns.size();

    return std::sqrt(variance);
}

double FeatureExtractor::calculateMomentum(const std::vector<double> &prices) {

    if (prices.size() < 2) {
        return 0.0;
    }




    double firstPrice = prices[0];
    double lastPrice = prices[prices.size()-1];

    double momentum = (lastPrice-firstPrice)/(firstPrice);

    return momentum;


}
