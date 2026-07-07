#pragma once

#include <string>
#include "Models/Account.h"
#include "Models/SubmitOrderRequest.h"
#include "Models/Position.h"
#include <vector>
#include "Models/Order.h"
#include "Models/Quote.h"
#include "Models/OpenOrder.h"

class AlpacaClient
{
public:

    AlpacaClient(
        const std::string& apiKey,
        const std::string& secretKey
    );
    std::vector<AlpacaPosition> getPositions();
    std::vector<AlpacaOrder> getFilledOrders();
    AlpacaQuote getLatestQuote(
    const std::string& symbol);

    std::vector<AlpacaOpenOrder> getOpenOrders();

    bool cancelOrder(
        const std::string& orderId
    );

    

    AlpacaAccount getAccountInfo();
    std::string submitOrder(
    const SubmitOrderRequest& request);

    std::string getAccount();

    std::string getBars(
        const std::string& symbol
    );

private:

    std::string apiKey;
    std::string secretKey;

    std::string performRequest(
    const std::string& url,
    const std::string& method = "GET",
    const std::string& body = "");

};