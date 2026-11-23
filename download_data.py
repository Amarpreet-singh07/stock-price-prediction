"""Download daily OHLCV data from Yahoo Finance and save it as a CSV.

Usage:
    python download_data.py                         # TSLA, last 4 years -> tsla.csv
    python download_data.py --ticker AAPL --years 6 # -> aapl.csv
"""
import argparse

import yfinance as yf


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--ticker", default="TSLA")
    p.add_argument("--years", type=int, default=4, help="how many years of history to fetch")
    p.add_argument("--out", help="output CSV path (default: <ticker>.csv in lower case)")
    args = p.parse_args()

    out = args.out or f"{args.ticker.lower()}.csv"
    df = yf.Ticker(args.ticker).history(period=f"{args.years}y", interval="1d", auto_adjust=False)
    if df.empty:
        raise SystemExit(f"No data returned for {args.ticker!r}")
    df = df[["Open", "High", "Low", "Close", "Volume", "Dividends", "Stock Splits"]]
    df.index.name = "Date"
    df.to_csv(out)
    print(f"Saved {len(df)} rows ({df.index.min().date()} -> {df.index.max().date()}) to {out}")


if __name__ == "__main__":
    main()
