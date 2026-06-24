#include "DashboardExporter.h"
#include <nlohmann/json.hpp>
#include <fstream>
#include <iostream>
#include <ctime>

using json = nlohmann::json;

namespace {
    // <-- SET: Holding stores prices as int64. 1.0 = already dollars
    // (your exec demo uses 100 = $100); 100.0 = stored in cents.
    constexpr double PRICE_SCALE = 1.0;
    double px(Price p) { return static_cast<double>(p) / PRICE_SCALE; }

    // <-- SET: assumes snapshot.timestamp is epoch SECONDS.
    // If it's milliseconds, use (ts / 1000). If it's a bar index, the
    // axis labels read 1970 but the curve SHAPE is still correct.
    std::tm gmt(long long ts) {
        std::time_t s = static_cast<std::time_t>(ts);
        std::tm t{};
#if defined(_WIN32)
        gmtime_s(&t, &s);
#else
        gmtime_r(&s, &t);
#endif
        return t;
    }
    std::string isoDate(long long ts)  { std::tm t = gmt(ts); char b[11];  std::strftime(b,sizeof b,"%Y-%m-%d",&t);          return b; }
    std::string isoStamp(long long ts) { std::tm t = gmt(ts); char b[25];  std::strftime(b,sizeof b,"%Y-%m-%dT%H:%M:%S",&t); return b; }
}

void DashboardExporter::write(
    const std::string& path,
    const PortfolioManager& pf,
    const std::vector<Holding>& holdings,
    const std::vector<EngineSnapshot>& snapshots,
    double startingCash)
{
    try {
        const double cash     = pf.getCash();
        const double exposure = pf.getExposure();
        const double nlv      = pf.getNetLiquidationValue();
        const double todayPnl = nlv - startingCash;

        json j;
        j["account"] = {
            {"cash", cash},
            {"todayPnl", todayPnl},
            {"exposure", exposure},
            {"todayPnlPct", startingCash != 0 ? todayPnl / startingCash * 100.0 : 0.0},
            {"exposurePct", nlv != 0 ? exposure / nlv * 100.0 : 0.0}
        };

        j["equityCurve"] = json::array();
        for (const auto& s : snapshots)
            j["equityCurve"].push_back({
                {"date", isoDate(s.timestamp)},
                {"nav",  startingCash + s.pnl}   // assumes pnl is cumulative
            });

        j["positions"] = json::array();
        for (const auto& h : holdings)
            j["positions"].push_back({
                {"symbol", h.symbol},
                {"quantity", h.quantity},
                {"avgCost", px(h.averageCost)},
                {"marketPrice", px(h.lastPrice)},
                {"unrealizedPnl", h.unrealizedPnL},
                {"realizedPnl", h.realizedPnL}
            });

        // Blotter derived from strategy signals already in the snapshot stream.
        // Match whatever strings your strategies write into snapshot.action.
        j["trades"] = json::array();
        int id = 0;
        for (const auto& s : snapshots)
            if (s.action == "BUY" || s.action == "SELL")
                j["trades"].push_back({
                    {"id", std::to_string(id++)},
                    {"time", isoStamp(s.timestamp)},
                    {"symbol", "-"},          // snapshots don't carry a symbol yet
                    {"side", s.action},
                    {"quantity", 0},          // nor a size yet
                    {"price", s.price}
                });

        // Exposure is real; status/limit are placeholders until RiskManager
        // is wired into the run loop.
        j["risk"] = {
            {"status", "APPROVED"},
            {"exposure", exposure},
            {"dailyLoss", todayPnl < 0 ? todayPnl : 0.0},
            {"positionLimit", 1000}
        };

        std::ofstream f(path);
        if (!f.is_open()) { std::cerr << "[dashboard] cannot open " << path << "\n"; return; }
        f << j.dump(2);
        std::cout << "[dashboard] wrote " << path << "\n";
    } catch (const std::exception& e) {
        std::cerr << "[dashboard] export skipped: " << e.what() << "\n";  // never throws into the engine
    }
}