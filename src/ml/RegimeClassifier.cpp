//
// Created by axoss-scott on 5/29/26.
//

#include "RegimeClassifier.h"
#include <cmath>
Regime RegimeClassifier::Classify(double volatility, double momentum) {

    if (volatility > 0.03) {
        return Regime::VOLATILE;
    }

    if (std::abs(momentum) > 0.5) {
        return Regime::TRENDING;
    }

    return Regime::MEAN_REVERTING;

}
