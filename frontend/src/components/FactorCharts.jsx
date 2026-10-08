import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function FactorCharts({
  gender = {},
  pclass = {},
  age = {},
  fare = {},
} = {}) {
  const factors = [
    {
      title: "Gender vs Survival",
      subtitle: "Passenger counts by recorded sex",
      data: gender,
      insight: (gender.labels ?? [])
        .map(
          (label, i) =>
            `${label} ${(gender.survival_rate?.[i] ?? 0).toFixed(2)}%`,
        )
        .join(" vs "),
    },
    {
      title: "Passenger Class vs Survival",
      subtitle: "Counts across first, second, and third class",
      data: pclass,
      insight: (pclass.labels ?? [])
        .map(
          (label, i) =>
            `${label} ${(pclass.survival_rate?.[i] ?? 0).toFixed(2)}%`,
        )
        .join(" / "),
    },
    {
      title: "Age Distribution by Survival",
      subtitle: "Decade bins · includes median-filled ages",
      data: age,
      insight: `Avg ${(age.avg_survivor ?? 0).toFixed(1)} vs ${(age.avg_non_survivor ?? 0).toFixed(1)} yrs (diff ${(age.difference ?? 0).toFixed(1)})`,
    },
    {
      title: "Fare Distribution by Survival",
      subtitle: "Passenger counts grouped into fare bands",
      data: fare,
      insight: `Avg $${(fare.avg_survivor ?? 0).toFixed(2)} vs $${(fare.avg_non_survivor ?? 0).toFixed(2)}`,
    },
  ];
  return (
    <section aria-labelledby="factors-title">
      <div className="section-heading">
        <div>
          <div className="eyebrow">03 / Factor analysis</div>
          <h2 id="factors-title">What Shaped Survival?</h2>
          <p>
            Compare group counts, then use the rates and averages for context.
          </p>
        </div>
        <span className="badge">Four factors · one outcome</span>
      </div>
      <div className="factor-grid">
        {factors.map((factor) => {
          const rows = (factor.data.labels ?? factor.data.bins ?? []).map(
            (label, i) => ({
              label,
              survived: factor.data.survived?.[i] ?? 0,
              not_survived: factor.data.not_survived?.[i] ?? 0,
            }),
          );
          return (
            <article className="card" key={factor.title}>
              <div className="card-heading">
                <h3>{factor.title}</h3>
                <p>{factor.subtitle}</p>
              </div>
              <div className="chart-wrap" aria-label={factor.title}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={rows}
                    accessibilityLayer
                    barGap={3}
                    margin={{ top: 8, right: 4, left: -20, bottom: 2 }}
                  >
                    <CartesianGrid stroke="#edf0f6" vertical={false} />
                    <XAxis
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 10 }}
                      interval={0}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                      tick={{ fill: "#64748b" }}
                    />
                    <Tooltip cursor={{ fill: "#f7f8fb" }} />
                    <Legend iconType="circle" iconSize={8} />
                    <Bar
                      dataKey="not_survived"
                      name="Did Not Survive"
                      fill="#e74c3c"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={44}
                      isAnimationActive={false}
                    />
                    <Bar
                      dataKey="survived"
                      name="Survived"
                      fill="#2ecc71"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={44}
                      isAnimationActive={false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="chart-insight">
                <strong>Key insight:</strong>{" "}
                {factor.insight || "No data available."}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
