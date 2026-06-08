#pragma once

#include "Order.h"

enum class OrderEventType {
    ACCEPTED,
    REJECTED,
    PARTIALLY_FILLED,
    FILLED,
    CANCELLED

};

struct OrderEvent {

    OrderId orderId;
    OrderEventType type;
    Quantity filledQuantity;


};