import type { CSSProperties } from "react";
import type { SweepRow } from "../types";

export default function SweepHeatmap({ rows }: { rows: SweepRow[] }) {
  const batches = [...new Set(rows.map((r) => r.batch_size))].sort((a, b) => a - b);
  const epochs = [...new Set(rows.map((r) => r.epochs))].sort((a, b) => a - b);
  const vals = rows.map((r) => r.val_RMSE);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const best = rows.find((r) => r.val_RMSE === min);

  const cell = (b: number, e: number) => rows.find((r) => r.batch_size === b && r.epochs === e);
  // 0 = best (low RMSE) .. 1 = worst
  const shade = (v: number) => (max === min ? 0 : (v - min) / (max - min));

  return (
    <div className="heat-wrap">
      <table className="heat">
        <caption className="sr-only">Validation and test RMSE by batch size and epochs</caption>
        <thead>
          <tr>
            <th scope="col">Batch ↓ / Epochs →</th>
            {epochs.map((e) => <th key={e} scope="col">{e}</th>)}
          </tr>
        </thead>
        <tbody>
          {batches.map((b) => (
            <tr key={b}>
              <th scope="row">{b}</th>
              {epochs.map((e) => {
                const c = cell(b, e);
                if (!c) return <td key={e}>–</td>;
                const isBest = c === best;
                const style = { "--shade": shade(c.val_RMSE).toFixed(3) } as CSSProperties;
                return (
                  <td key={e} className={isBest ? "best" : undefined} style={style}>
                    <strong>${c.val_RMSE.toFixed(1)}</strong>
                    <span>test ${c.test_RMSE.toFixed(1)}</span>
                    {isBest && <em>best</em>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
