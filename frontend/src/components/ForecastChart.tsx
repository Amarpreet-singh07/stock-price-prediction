import { useMemo, useState } from "react";
import {
  CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import type { ResultsData } from "../types";

interface Row {
  date: string;
  close?: number | null;
  train_pred?: number | null;
  test_pred?: number | null;
  forecast?: number | null;
}

type Range = "all" | "recent";

export default function ForecastChart({ data }: { data: ResultsData }) {
  const [range, setRange] = useState<Range>("all");

  const rows = useMemo(() => {
    const lastIdx = data.series.length - 1;
    const hist: Row[] = data.series.map((p, i) => ({
      date: p.date,
      close: p.close,
      train_pred: p.train_pred,
      test_pred: p.test_pred,
      // anchor the forecast line to the last actual point so the two connect
      forecast: i === lastIdx ? p.close : null,
    }));
    const fc: Row[] = data.forecast.map((f) => ({ date: f.date, forecast: f.close }));
    const all = [...hist, ...fc];
    return range === "all" ? all : all.slice(-(data.time_step + data.forecast.length));
  }, [data, range]);

  const splitDate = data.series[data.split_index]?.date;

  return (
    <div>
      <div className="toggle" role="group" aria-label="Date range">
        {(["all", "recent"] as const).map((r) => (
          <button key={r} aria-pressed={range === r} onClick={() => setRange(r)}>
            {r === "all" ? "Full history" : "Last 100 days + forecast"}
          </button>
        ))}
      </div>
      <div className="chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="var(--grid)" strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fill: "var(--muted)", fontSize: 12 }} minTickGap={48} />
            <YAxis
              tick={{ fill: "var(--muted)", fontSize: 12 }}
              domain={["auto", "auto"]}
              tickFormatter={(v: number) => `$${v}`}
              width={56}
            />
            <Tooltip
              contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }}
              formatter={(v: number) => `$${v.toFixed(2)}`}
            />
            <Legend />
            {range === "all" && splitDate && (
              <ReferenceLine
                x={splitDate}
                stroke="var(--muted)"
                strokeDasharray="4 4"
                label={{ value: "train | test", fill: "var(--muted)", fontSize: 12 }}
              />
            )}
            <Line name="Actual close" dataKey="close" stroke="var(--c-actual)" dot={false} strokeWidth={2} isAnimationActive={false} />
            <Line name="Train prediction" dataKey="train_pred" stroke="var(--c-train)" dot={false} strokeWidth={1.5} isAnimationActive={false} />
            <Line name="Test prediction" dataKey="test_pred" stroke="var(--c-test)" dot={false} strokeWidth={1.5} isAnimationActive={false} />
            <Line name="30-day forecast" dataKey="forecast" stroke="var(--c-forecast)" dot={false} strokeWidth={2} strokeDasharray="6 3" isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
