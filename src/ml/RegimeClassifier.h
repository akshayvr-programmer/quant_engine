#pragma once

#include "Regime.h"


class RegimeClassifier {

public:
    static Regime Classify(double volatility, double momentum);
};
