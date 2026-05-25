# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build

```bash
cmake -S . -B cmake-build-debug
cmake --build cmake-build-debug
./cmake-build-debug/engine
```

New source files must be added to the `add_executable` list in `CMakeLists.txt`. Note: the `src/market data/` directory name contains a space — quote paths accordingly in CMakeLists.

## Architecture

This is an event-driven C++ algorithmic trading engine. The core data flow is:

**Tick → MarketDataFeed → IStrategy::onTick → Signal**

### Market Data Layer (`src/market data/`)
- `Tick` — raw price/volume/timestamp for a symbol, the primitive unit of market data
- `MarketDataFeed` — pub/sub hub: holds a list of `IStrategy*` subscribers; `addTick()` stores the tick and fans it out to all subscribers
- `Candle` — OHLC bar with start/end timestamps
- `CandleAggregator` — aggregates incoming `Tick`s into `Candle`s (in progress, not yet wired to the feed)

### Strategy Layer (`src/strategy/`)
- `IStrategy` — interface with a single `onTick(const Tick&)` pure virtual. All strategies implement this.
- `Signal` — enum (`BUY`, `SELL`, `HOLD`) that strategies emit after processing a tick
- `MovingAverageStrategy` — reference implementation: maintains a rolling window of prices via `std::deque`, computes the mean, and generates a signal by comparing current price to the moving average
- `PrintStrategy` — debug strategy that prints tick data

### Stubbed Layers (not yet implemented)
- `src/execution/` — order placement and management
- `src/risk/` — position sizing, exposure limits
- `src/backtest/` — historical data replay
- `frontend/` — visualization

### Adding a New Strategy
1. Create `src/strategy/MyStrategy.h` and `.cpp`
2. Inherit from `IStrategy`, implement `onTick(const Tick&)`
3. Add both files to `add_executable` in `CMakeLists.txt`
4. Instantiate and `feed.subscribe(&myStrategy)` in `main.cpp`
