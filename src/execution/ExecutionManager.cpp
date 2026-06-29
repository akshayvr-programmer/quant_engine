#include "ExecutionManager.h"
#include "Order.h"
#include <chrono>

using namespace std::chrono;


ExecutionManager::ExecutionManager()
{

}


const std::vector<ExecutionTrade>&
ExecutionManager::
getTrades() const
{
    return executedTrades;
}


const std::vector<OrderEvent>&
ExecutionManager::
getEvents() const
{
    return executionEvents;
}


MatchingResult
ExecutionManager::
submitRequest(
        const ExecutionRequest& request
)
{

    MatchingResult result;
    RiskResult riskResult = risk.validateRequest(request, portfolio);
        if(

    riskResult.decision

    !=

    RiskDecision::

    APPROVED

    )

        {




                result.events.push_back(

                {

                0,


                OrderEventType::

                REJECTED,


                0,


                0


                }

                );




                return result;


        }


    OrderIdGenerator generator;


    OrderId id =
            generator.nextId();



    Timestamp ts =

            duration_cast<nanoseconds>(

                    steady_clock::
                    now()
                    .time_since_epoch()

            ).count();



    Price price =

            request.limitPrice
            .value_or(0);



    Order order {

            id,
            request.symbol,
            request.side,
            request.orderType,
            price,
            request.quantity,
            request.quantity,
            ts


    };



    OrderBook& book =

            books[
                    request.symbol
            ];



    result =

            book.submitOrder(
                    order
            );



    for (
            const auto& trade :
            result.trades
    )
    {

        bool isBuy = request.side==Side::BUY;
        portfolio.updateFromTrade(trade, request.symbol, isBuy);
        executedTrades.push_back(
                trade
        );
    }



    for (
            const auto& event :
            result.events
    )
    {
        executionEvents.push_back(
                event
        );
    }



    return result;

}


PortfolioManager &ExecutionManager::getPortfolio() {
        return portfolio;
}
