//
// Created by aksha on 24-06-2026.
//

#include "PaperBroker.h"


PaperBroker::PaperBroker() {

}

MatchingResult PaperBroker::placeOrder(const ExecutionRequest &request) {
    return engine.submitRequest(request);

}

double PaperBroker::getCash()  {

    return engine.getPortfolio().getCash();

}

std::vector<ExecutionTrade> PaperBroker::getTrades() {
    return engine.getTrades();
}

double PaperBroker::getExposure() {
    return engine.getPortfolio().getExposure();

}
double PaperBroker::getPnL() {
    return engine.getPortfolio().getRealizedPnL();
}