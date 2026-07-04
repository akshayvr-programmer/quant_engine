# QuantEngine

An event-driven quantitative trading platform built in modern C++ — backtesting engine, matching-engine order book, paper broker with a REST API, and a React dashboard on top.

The design separates **research** (Python — statistical validation, parameter estimation) from **execution** (C++ — tick replay, signal generation, order matching, portfolio accounting), the way production quant systems do.

```
                    ┌─────────────  RESEARCH (Python)  ─────────────┐
                    │  Cointegration testing → beta, spread μ/σ     │
                    │  Regime & strategy benchmarking notebooks     │
                    └───────────────────┬───────────────────────────┘
                                        │  JSON parameters
                                        ▼
CSV ticks → HistoricalDataPlayer → MarketDataFeed ─┬─→ SMA / EMA / Z-Score / Pairs strategies
                                                   ├─→ CandleAggregator (OHLC)
                                                   └─→ AnalyticsManager → PerformanceMetrics
                                        │
                             Signal → ExecutionAdapter → RiskManager
                                        │
                          ExecutionManager → OrderBook (price-time matching)
                                        │
                         PortfolioManager (cash, holdings, realized PnL)
                                        │
              PaperBroker → HTTP REST API (Boost.Beast) → React dashboard
