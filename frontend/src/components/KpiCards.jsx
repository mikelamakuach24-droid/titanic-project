export default function KpiCards({ summary = {}, correlation = [] } = {}) {
  const features = Array.isArray(correlation) ? correlation : [];
  const strongest = features.reduce(
    (best, item) =>
      Math.abs(item.value ?? 0) > Math.abs(best.value ?? 0) ? item : best,
    {},
  );
  const name = strongest.feature?.startsWith("Gender")
    ? "Gender"
    : (strongest.feature ?? "—");
  const cards = [
    {
      label: "Total Passengers",
      value: summary.total ?? 0,
      badge: "100%",
      note: "Passenger sample",
      icon: "◎",
    },
    {
      label: "Survived",
      value: summary.survived ?? 0,
      badge: `${(summary.survival_rate ?? 0).toFixed(2)}%`,
      note: "Overall rate",
      icon: "✓",
      tone: "success",
    },
    {
      label: "Did Not Survive",
      value: summary.not_survived ?? 0,
      badge: `${(summary.not_survival_rate ?? 0).toFixed(2)}%`,
      note: "Overall rate",
      icon: "×",
      tone: "danger",
    },
    {
      label: "Strongest Predictor",
      value: name,
      badge: `r = ${(strongest.value ?? 0).toFixed(4)}`,
      note: "Largest |r|",
      icon: "↗",
    },
  ];
  return (
    <section className="kpi-grid" aria-label="Key statistics">
      {cards.map((card) => (
        <article className="card kpi" key={card.label}>
          <div className="kpi-top">
            <span className="kpi-label">{card.label}</span>
            <span
              className={`kpi-icon ${card.tone ? `${card.tone}-bg` : ""}`}
              aria-hidden="true"
            >
              {card.icon}
            </span>
          </div>
          <div className={`kpi-value ${card.tone ? `${card.tone}-text` : ""}`}>
            {card.value.toLocaleString()}
          </div>
          <div className="kpi-note">
            <span className={`badge ${card.tone ? `${card.tone}-bg` : ""}`}>
              {card.badge}
            </span>
            <span>{card.note}</span>
          </div>
        </article>
      ))}
    </section>
  );
}
