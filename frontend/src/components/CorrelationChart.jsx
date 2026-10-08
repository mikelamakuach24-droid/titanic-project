import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function CorrelationChart({ data = [] } = {}) {
  const rows = Array.isArray(data)
    ? [...data].sort((a, b) => a.value - b.value)
    : [];
  return (
    <section className="card" aria-labelledby="correlation-title">
      <div className="section-heading">
        <div>
          <div className="eyebrow">04 / Statistical perspective</div>
          <h2 id="correlation-title">Correlation with Survival</h2>
          <p>
            Pearson r · sorted ascending · gender encoded as female = 1, male =
            0
          </p>
        </div>
        <div className="legend">
          <span className="legend-item">
            <i className="dot success" />
            Positive
          </span>
          <span className="legend-item">
            <i className="dot" />
            Negative
          </span>
        </div>
      </div>
      <div
        className="correlation-wrap"
        aria-label="Feature correlations with survival"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={rows}
            layout="vertical"
            accessibilityLayer
            margin={{ top: 5, right: 15, left: 0, bottom: 5 }}
          >
            <CartesianGrid stroke="#edf0f6" horizontal={false} />
            <XAxis
              type="number"
              domain={[-0.6, 0.6]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b" }}
            />
            <YAxis
              type="category"
              dataKey="feature"
              width={128}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 11 }}
            />
            <Tooltip
              formatter={(value) => [
                Number(value).toFixed(4),
                "Correlation (r)",
              ]}
              cursor={{ fill: "#f7f8fb" }}
            />
            <ReferenceLine x={0} stroke="#000000" />
            <Bar
              dataKey="value"
              name="Correlation"
              barSize={18}
              radius={3}
              isAnimationActive={false}
            >
              {rows.map((row) => (
                <Cell
                  key={row.feature}
                  fill={row.value >= 0 ? "#2ecc71" : "#e74c3c"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="note">
        <strong>How to read this:</strong> longer bars show stronger linear
        associations. Class 3 means a lower passenger class, so its negative
        correlation matches lower survival. Correlation does not establish
        causation; Passenger ID is shown only for completeness.
      </p>
    </section>
  );
}
