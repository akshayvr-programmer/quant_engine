# QuantEngine

A modular quantitative research and backtesting platform built in modern C++.

## Overview

QuantEngine is a personal quantitative finance research platform designed to explore:

* Trend-following strategies
* Mean-reversion strategies
* Market regime detection
* Risk management
* Portfolio analytics
* Machine learning driven trading systems

The long-term vision is to evolve QuantEngine into a complete research environment capable of testing systematic trading ideas on real market data.

---

## Current Features

### Data Pipeline

* Historical CSV market data ingestion
* Tick replay engine
* Event-driven architecture
* Market data feed abstraction

### Trading Strategies

#### Simple Moving Average (SMA)

Traditional moving average crossover strategy.

#### Exponential Moving Average (EMA)

Adaptive moving average crossover strategy with stronger emphasis on recent market information.

#### Z-Score Mean Reversion

Statistical arbitrage inspired strategy based on deviations from rolling mean.

---

## Analytics & Backtesting

### Performance Metrics

* Total PnL
* Win Rate
* Average Trade PnL
* Sharpe Ratio
* Profit Factor
* Maximum Drawdown

### Trade Tracking

* Trade entry/exit events
* Position tracking
* Strategy level PnL accounting

---

## Market Structure Layer

### Candle Aggregation

Transforms raw market ticks into candle history.

Supports:

* Open
* High
* Low
* Close

The candle infrastructure serves as the foundation for future volatility and regime models.

---

## Machine Learning Layer (In Progress)

### Feature Extraction

Current features:

* Momentum
* Volatility

### Regime Detection

Current market states:

* TRENDING
* MEAN_REVERTING
* VOLATILE

This layer will later evolve into:

* Decision Trees
* Random Forests
* XGBoost Models
* Hidden Markov Models

---

## Frontend

React-based dashboard for:

* Strategy visualization
* Trade analysis
* Performance inspection
* Market state visualization

---

## Research Results

### 5-Year AAPL Backtest

EMA Strategy:

* Total Trades: 80
* Win Rate: 40.0%
* Total PnL: +50.4
* Profit Factor: 1.29
* Max Drawdown: 46.14

SMA Strategy:

* Total Trades: 133
* Win Rate: 36.8%
* Total PnL: -10.74
* Profit Factor: 0.96
* Max Drawdown: 52.24

Observation:

EMA outperformed SMA on real AAPL historical data while producing lower drawdown and higher profit factor.

---

## Architecture

Market Data
→ Feed
→ Strategy Layer
→ Analytics Layer
→ JSON Export
→ Frontend Dashboard

---

## Roadmap

### Phase 1 — Complete Core Engine

* [x] SMA Strategy
* [x] EMA Strategy
* [x] Z-Score Strategy
* [x] Backtesting Metrics
* [x] Candle Infrastructure

### Phase 2 — Adaptive Trading

* [ ] Regime-Aware Strategy Routing
* [ ] Equity Curve Visualization
* [ ] Multi-Asset Backtesting

### Phase 3 — Quantitative Research

* [ ] Cointegration Detection
* [ ] Pairs Trading
* [ ] Kalman Filters
* [ ] Hidden Markov Models
* [ ] Kelly Position Sizing

### Phase 4 — Machine Learning

* [ ] Decision Trees
* [ ] Random Forests
* [ ] XGBoost
* [ ] Volatility Forecasting Models

### Phase 5 — Portfolio & Risk

* [ ] Portfolio Risk Dashboard
* [ ] Monte Carlo Simulations
* [ ] Risk Factor Decomposition

---

## Tech Stack

Backend:

* C++17
* CMake

Frontend:

* React
* TypeScript

Research:

* Statistical Learning
* Quantitative Finance
* Machine Learning

---

Built as a long-term quantitative research platform and learning project.
