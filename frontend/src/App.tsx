import { useEffect, useState } from "react";
import type { ResultsData } from "./types";
import ForecastChart from "./components/ForecastChart";
import SweepHeatmap from "./components/SweepHeatmap";

export default function App() {
  const [data, setData] = useState<ResultsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<ResultsData>;
      })
      .then(setData)
      .catch((e: Error) =>
        setError(`Could not load data.json (${e.message}). Run the notebook's export cell first.`),
      );
  }, []);

  return (
    <main>
      <header>
        <h1>Stock Price Prediction</h1>
        <p className="sub">
          A stacked-LSTM model trained on {data?.ticker ?? "…"} closing prices. Charts show model output exported from
          the notebook.
        </p>
      </header>

      {error && <p role="alert" className="error">{error}</p>}
      {!data && !error && <p className="muted">Loading…</p>}

      {data && (
        <>
          <section>
            <h2>Actual vs predicted close, with 30-day forecast</h2>
            <ForecastChart data={data} />
            <p className="note">
              The forecast is recursive (each prediction feeds the next), so errors compound. It is an illustration,
              not a trading signal.
            </p>
          </section>

          <section>
            <h2>Hyper-parameter sweep</h2>
            <p className="muted">Batch size × epochs. Colour shows validation RMSE (lower is better).</p>
            <SweepHeatmap rows={data.sweep} />
          </section>
        </>
      )}
    </main>
  );
}
