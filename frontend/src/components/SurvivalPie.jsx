import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export default function SurvivalPie({ data = {}, summary = {} } = {}) {
  const colors = ["#2ecc71", "#e74c3c"];
  const rows = (data.labels ?? []).map((name, index) => ({
    name,
    value: data.values?.[index] ?? 0,
  }));
  const rates = [summary.survival_rate ?? 0, summary.not_survival_rate ?? 0];
  return (
    <section className="card" aria-labelledby="survival-title">
      <div className="card-heading">
        <div className="eyebrow">02 / The baseline</div>
        <h2 id="survival-title">Overall Survival Rate</h2>
        <p>The starting point for every comparison.</p>
      </div>
      <div
        className="donut-wrap"
        role="img"
        aria-label={`Survived ${rates[0]}%, did not survive ${rates[1]}%`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={rows}
              dataKey="value"
              nameKey="name"
              innerRadius={76}
              outerRadius={100}
              paddingAngle={2}
              stroke="none"
              isAnimationActive={false}
            >
              {rows.map((row, index) => (
                <Cell key={row.name} fill={colors[index]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [
                Number(value).toLocaleString(),
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="donut-center">
          <strong>{(summary.total ?? 0).toLocaleString()}</strong>
          <span>Passengers</span>
        </div>
      </div>
      <div className="survival-breakdown">
        {rows.map((row, index) => (
          <div
            key={row.name}
            className={`survival-stat ${index === 0 ? "success-bg" : "danger-bg"}`}
          >
            <span>{row.name}</span>
            <strong>{rates[index].toFixed(2)}%</strong>
            <span>{row.value} passengers</span>
          </div>
        ))}
      </div>
    </section>
  );
}
