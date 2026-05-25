#pragma once


#include "Istrategy.h"

class PrintStrategy : public IStrategy {
public:
    void onTick(const Tick& tick) override;
};

