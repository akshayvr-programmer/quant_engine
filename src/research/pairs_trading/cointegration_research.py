"""
Cointegration Pairs-Trading Research Module
===========================================

Research half of the pairs-trading pipeline for quant_engine.

This script answers ONE question: does a tradeable "leash" exist between two
stocks? i.e. is the spread between them mean-reverting (stationary)?

It does NOT execute trades. It produces the parameters (beta, spread mean/std)
that the C++ execution engine consumes to run the strategy live.

    Research (this file, Python)  ->  beta, mean, std, verdict
    Execution (C++ engine)        ->  live z-score, enter/exit, P&L

Pair under test: KO (Coca-Cola) vs PEP (PepsiCo)
Rationale: same business, same input costs, same consumer base -> there SHOULD
be an economic leash. We test whether the data agrees.

Requires: pip install yfinance statsmodels matplotlib pandas numpy
"""

import numpy as np
import pandas as pd
import yfinance as yf
import statsmodels.api as sm
from statsmodels.tsa.stattools import adfuller
import matplotlib.pyplot as plt


# ----------------------------------------------------------------------
# Config
# ----------------------------------------------------------------------
TICKER_A = "KO"      # the stock we regress (dependent variable, y)
TICKER_B = "PEP"     # the stock we regress against (independent variable, x)
START = "2015-01-01"
END = "2023-01-01"
ENTRY_Z = 2.0        # enter a position when |z| crosses this
EXIT_Z = 0.0         # exit (flatten) when z returns to the mean


def load_prices(ticker_a, ticker_b, start, end):
    """Pull daily closes for both tickers, aligned on common dates."""
    data = yf.download([ticker_a, ticker_b], start=start, end=end)["Close"]
    # dropna enforces that every timestamp has BOTH prices -- without this the
    # two series fall out of alignment and every subtraction below is garbage.
    data = data.dropna()
    return data


def estimate_beta_and_spread(data, ticker_a, ticker_b):
    """
    Regress A on B. The slope is beta (the hedge ratio / conversion factor):
    how many units of B move to match one unit of A. The regression residual
    -- what's left of A after removing beta*B -- IS the spread.
    """
    X = sm.add_constant(data[ticker_b])   # B plus an intercept column
    y = data[ticker_a]
    model = sm.OLS(y, X).fit()
    beta = model.params[ticker_b]
    spread = y - model.predict(X)         # residual = synthetic mean-reverting series
    return beta, spread


def test_stationarity(spread):
    """
    Augmented Dickey-Fuller test.

    Null hypothesis = "unit root" = non-stationary = no leash. The test makes
    the data prove otherwise. INVERTED LOGIC people get backwards:
        p < 0.05  -> reject unit root -> STATIONARY -> leash -> tradeable
        p >= 0.05 -> cannot reject    -> non-stationary -> no reliable leash
    The ADF statistic is negative; more negative = stronger pull toward home.
    """
    result = adfuller(spread)
    adf_stat = result[0]
    p_value = result[1]
    crit = result[4]
    return adf_stat, p_value, crit


def zscore_series(spread):
    """Convert spread to z-score: how many std devs from its mean."""
    return (spread - spread.mean()) / spread.std()


def main():
    # --- 1. Load -------------------------------------------------------
    data = load_prices(TICKER_A, TICKER_B, START, END)
    print(f"Loaded {len(data)} aligned daily closes for {TICKER_A}/{TICKER_B}\n")

    # --- 2. Beta + spread ---------------------------------------------
    beta, spread = estimate_beta_and_spread(data, TICKER_A, TICKER_B)
    print(f"Beta (hedge ratio): {beta:.4f}")
    print(f"Spread mean: {spread.mean():.4f}   std: {spread.std():.4f}\n")

    # --- 3. Stationarity verdict --------------------------------------
    adf_stat, p_value, crit = test_stationarity(spread)
    print(f"ADF Statistic: {adf_stat:.4f}")
    print(f"p-value:       {p_value:.4f}")
    print("Critical Values:")
    for level, value in crit.items():
        print(f"   {level}: {value:.4f}")
    if p_value < 0.05:
        print("\n--> STATIONARY. Leash exists -> tradeable pair.\n")
    else:
        print("\n--> NON-stationary. No reliable leash.\n")

    # --- 4. Parameters handed to the C++ engine -----------------------
    print("Parameters for execution engine:")
    print(f"   beta        = {beta:.6f}")
    print(f"   spread_mean = {spread.mean():.6f}")
    print(f"   spread_std  = {spread.std():.6f}")
    print(f"   entry_z     = {ENTRY_Z}")
    print(f"   exit_z      = {EXIT_Z}\n")

    # --- 5. Charts -----------------------------------------------------
    # Chart 1: the two raw prices wandering (non-stationary -- no flat home)
    plt.figure(figsize=(12, 6))
    plt.plot(data.index, data[TICKER_A], label=TICKER_A)
    plt.plot(data.index, data[TICKER_B], label=TICKER_B)
    plt.title(f"{TICKER_A} vs {TICKER_B} -- Daily Close")
    plt.xlabel("Date"); plt.ylabel("Price ($)"); plt.legend()
    plt.tight_layout()
    plt.savefig("chart1_prices.png", dpi=150)

    # Chart 2: the spread reverting to its mean (the leash, made visible)
    plt.figure(figsize=(12, 6))
    plt.plot(spread.index, spread, label="Spread (A - beta*B)")
    plt.axhline(spread.mean(), color="red", linestyle="--", label="Mean")
    plt.title(f"{TICKER_A}/{TICKER_B} Spread")
    plt.xlabel("Date"); plt.ylabel("Spread"); plt.legend()
    plt.tight_layout()
    plt.savefig("chart2_spread.png", dpi=150)

    # Chart 3: z-score with trading bands (the strategy)
    z = zscore_series(spread)
    plt.figure(figsize=(12, 6))
    plt.plot(z.index, z, label="Spread z-score")
    plt.axhline(EXIT_Z, color="black", linewidth=0.8, label="Mean (exit)")
    plt.axhline(ENTRY_Z, color="red", linestyle="--", label="+2 (short spread)")
    plt.axhline(-ENTRY_Z, color="green", linestyle="--", label="-2 (long spread)")
    plt.title(f"{TICKER_A}/{TICKER_B} z-score with Trading Bands")
    plt.xlabel("Date"); plt.ylabel("z-score"); plt.legend()
    plt.tight_layout()
    plt.savefig("chart3_zscore.png", dpi=150)

    print("Saved chart1_prices.png, chart2_spread.png, chart3_zscore.png")


if __name__ == "__main__":
    main()
