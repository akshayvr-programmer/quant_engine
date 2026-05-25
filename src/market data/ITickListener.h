//
// Created by axoss-scott on 5/25/26.
//


#pragma once

#include "Tick.h"

class ITickListener {

public:

    virtual void onTick(const Tick& tick) = 0;

    virtual ~ITickListener() = default;
};