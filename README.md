# QuantEngine

A modular quantitative research, backtesting, and machine learning platform built in modern C++.

## Overview

QuantEngine is a personal quantitative finance research platform designed to explore:

* Trend-following strategies
* Mean-reversion strategies
* Market regime detection
* Risk management
* Portfolio analytics
* Machine learning-driven trading systems

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

Statistical mean-reversion strategy based on deviations from rolling mean.

---

## Analytics & Backtesting

### Performance Metrics

Implemented:

* Total PnL
* Win Rate
* Average Trade PnL
* Sharpe Ratio
* Profit Factor
* Maximum Drawdown

### Trade Tracking

* Trade entry events
* Trade exit events
* Position tracking
* Strategy-level PnL accounting

---

## Market Structure Layer

### Candle Aggregation

Transforms raw market ticks into candle history.

Supports:

* Open
* High
* Low
* Close

The candle infrastructure serves as the foundation for future volatility models, regime detection, and statistical arbitrage research.

---

## Machine Learning & Quantitative Research

### Feature Engineering

Implemented:

* Momentum
* Rolling Volatility

Planned:

* EMA Spread
* Volume-Based Features
* Return-Based Features
* Trend Strength Indicators

These features form the foundation of future machine learning and regime classification models.

### Regime Detection

Current market states:

* TRENDING
* MEAN_REVERTING
* VOLATILE

Current pipeline:

Market Data
→ Feature Extraction
→ Regime Classification
→ Strategy Selection

### Research Notebooks

#### regime_detection_research.ipynb

Research notebook for:

* Volatility Analysis
* Momentum Analysis
* Feature Engineering
* Decision Tree Classification
* Feature Importance Analysis

#### strategy_benchmarking.ipynb

Research notebook for:

* SMA vs EMA vs Z-Score
* Equity Curve Analysis
* Sharpe Ratio Comparison
* Drawdown Analysis
* Profit Factor Analysis

### Future ML Roadmap

* Decision Trees
* Random Forests
* XGBoost
* Hidden Markov Models
* Kalman Filters
* Neural Volatility Forecasting

---

## Performance & Engineering

QuantEngine is designed as a modular, event-driven research platform.

Current design principles:

* Event-driven architecture
* Modular strategy interfaces
* Strategy-independent analytics layer
* Decoupled market data and execution components

Upcoming optimizations:

* Memory pool allocation
* Cache-friendly data structures
* Lock-free queues
* Latency benchmarking
* Multi-threaded backtesting

---

## Frontend

React-based dashboard for:

* Strategy visualization
* Trade analysis
* Performance inspection
* Market state visualization

Planned:

* Equity curve visualization
* Drawdown charts
* Regime visualization
* Multi-strategy comparison dashboard

---

## Research Results

### 5-Year AAPL Backtest

#### EMA Strategy

* Total Trades: 80
* Win Rate: 40.0%
* Total PnL: +50.4
* Profit Factor: 1.29
* Maximum Drawdown: 46.14

#### SMA Strategy

* Total Trades: 133
* Win Rate: 36.8%
* Total PnL: -10.74
* Profit Factor: 0.96
* Maximum Drawdown: 52.24

### Observation

EMA outperformed SMA on real AAPL historical data while producing lower drawdown and a higher profit factor.

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

### Phase 1 — Core Engine

* [x] SMA Strategy
* [x] EMA Strategy
* [x] Z-Score Strategy
* [x] Performance Metrics
* [x] Candle Infrastructure
* [x] Analytics Layer

### Phase 2 — Adaptive Trading

* [ ] Regime-Aware Strategy Routing
* [ ] Equity Curve Visualization
* [ ] Multi-Asset Backtesting
* [ ] Strategy Benchmarking Dashboard

### Phase 3 — Quantitative Research

* [ ] Cointegration Detection
* [ ] Pairs Trading
* [ ] Ornstein-Uhlenbeck Models
* [ ] Kalman Filters
* [ ] Kelly Position Sizing

### Phase 4 — Machine Learning

* [ ] Decision Trees
* [ ] Random Forests
* [ ] XGBoost
* [ ] Hidden Markov Models
* [ ] Volatility Forecasting Models

### Phase 5 — Portfolio & Risk

* [ ] Portfolio Risk Dashboard
* [ ] Monte Carlo Simulations
* [ ] Risk Factor Decomposition
* [ ] Portfolio Optimization

### Phase 6 — Advanced Research

* [ ] Crypto Arbitrage Scanner
* [ ] Alternative Data Alpha Pipeline
* [ ] Reinforcement Learning Market Making
* [ ] Volatility Surface Modeling

---

## Tech Stack

### Backend

* C++17
* CMake

### Frontend

* React
* TypeScript

### Research

* Statistical Learning
* Quantitative Finance
* Machine Learning

---

## Long-Term Vision

QuantEngine aims to become a full quantitative research platform combining:

* Statistical Arbitrage
* Market Regime Detection
* Machine Learning
* Portfolio Optimization
* Risk Analytics
* Low-Latency Systems Engineering

The goal is not only to backtest strategies but to build an end-to-end environment for researching, evaluating, and deploying systematic trading ideas.
