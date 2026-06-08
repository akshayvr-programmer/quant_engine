#pragma once

#include "Order.h"

struct Trade {
    OrderId agressorOrderId;
    OrderId restingOrderId;
    Price price;
    Quantity quantity;

};