#pragma once

#include "Order.h"

struct ExecutionTrade {
    OrderId agressorOrderId;
    OrderId restingOrderId;
    Price price;
    Quantity quantity;

};