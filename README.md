# Vertex

A modern quantitative trading terminal built with **C++**, **Boost.Beast**, **React**, **TypeScript**, and **Alpaca Paper Trading**.

![Dashboard](docs/dashboard.png)

---

# Features

- Live Alpaca Account
- Market Orders
- Limit Orders
- Cancel Orders
- Open Positions
- Trade Tape
- Interactive Trading Terminal
- Event Driven C++ Backend
- REST API
- React Trading Dashboard

---

# Architecture

```
React + TypeScript

↓

REST API

↓

Boost.Beast

↓

Trading Engine

↓

Alpaca Paper API
```

---

# Tech Stack

Backend

- C++20
- Boost.Beast
- libcurl
- nlohmann/json

Frontend

- React
- TypeScript
- TailwindCSS
- React Query
- Lightweight Charts

Broker

- Alpaca Paper Trading

---

# Screenshots

## Dashboard

![Dashboard](docs/dashboard.png)

## Orders

![Orders](docs/orders.png)

## Terminal

![Terminal](docs/terminal.png)

---

# Roadmap

### v0.1

- Trading Terminal
- Dashboard
- Order Execution
- Alpaca Integration

### v0.2

- Strategy Runtime
- AI Terminal
- Backtesting
- Portfolio Analytics

### v0.3

- Market Replay
- Risk Engine
- Strategy Optimizer

---

# Installation

```bash
git clone <repo>

cd Vertex
```

Backend

```bash
mkdir build

cmake ..

make
```

Frontend

```bash
npm install

npm run dev
```

---

# License

MIT
