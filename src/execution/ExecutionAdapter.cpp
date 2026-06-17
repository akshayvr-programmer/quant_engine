#include "ExecutionAdapter.h"



std::optional<ExecutionRequest>

ExecutionAdapter::

signalToRequest(

        Signal signal,

        const std::string&
        symbol,

        Quantity quantity

)
{


    switch(signal)
    {


        case Signal::BUY:


            return ExecutionRequest{


                symbol,

                Side::BUY,

                quantity,

                OrderType::MARKET,

                std::nullopt


        };




        case Signal::SELL:



            return ExecutionRequest{


                symbol,

                Side::SELL,

                quantity,

                OrderType::MARKET,

                std::nullopt

        };



        case Signal::HOLD:


            return std::nullopt;

    }



    return std::nullopt;


}