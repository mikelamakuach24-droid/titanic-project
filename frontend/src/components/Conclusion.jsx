export default function Conclusion({
  correlation = [],
  gender = {},
  pclass = {},
  fare = {},
  age = {},
  missing = [],
} = {}) {
  const features = Array.isArray(correlation) ? correlation : [];
  const cabin = (Array.isArray(missing) ? missing : []).find(
    (row) => row.column === "Cabin",
  );
  const ageCorrelation =
    features.find((row) => row.feature === "Age")?.value ?? 0;
  const factors = [
    {
      title: "Gender",
      feature: "Gender (female=1)",
      detail: `Female ${(gender.survival_rate?.[0] ?? 0).toFixed(2)}% · Male ${(gender.survival_rate?.[1] ?? 0).toFixed(2)}%`,
      body: "The strongest association in this sample. Female passengers had a substantially higher survival rate than male passengers.",
    },
    {
      title: "Passenger Class",
      feature: "Passenger class",
      detail: `1st ${(pclass.survival_rate?.[0] ?? 0).toFixed(2)}% · 3rd ${(pclass.survival_rate?.[2] ?? 0).toFixed(2)}%`,
      body: "Survival rates fell with travel class. First-class passengers were more likely to survive than third-class passengers.",
    },
    {
      title: "Ticket Fare",
      feature: "Fare",
      detail: `Survived $${(fare.avg_survivor ?? 0).toFixed(2)} · Did not $${(fare.avg_non_survivor ?? 0).toFixed(2)}`,
      body: "Survivors paid higher fares on average. Fare overlaps with class, so the two associations should not be treated as independent effects.",
    },
  ]
    .map((factor) => ({
      ...factor,
      value: features.find((row) => row.feature === factor.feature)?.value ?? 0,
    }))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  return (
    <section aria-labelledby="conclusion-title">
      <div className="section-heading">
        <div>
          <div className="eyebrow">05 / The takeaway</div>
          <h2 id="conclusion-title">Top 3 Factors Associated with Survival</h2>
          <p>
            Ranked by absolute correlation, rather than by a trained prediction
            model.
          </p>
        </div>
      </div>
      <div className="rank-grid">
        {factors.map((factor, index) => (
          <article className="card rank-card" key={factor.title}>
            <div className="rank-top">
              <span className="rank-number">{index + 1}</span>
              <span
                className={`badge ${factor.value >= 0 ? "success-bg" : "danger-bg"}`}
              >
                r = {factor.value > 0 ? "+" : ""}
                {factor.value.toFixed(4)}
              </span>
            </div>
            <h3>{factor.title}</h3>
            <div className="rank-detail">{factor.detail}</div>
            <p>{factor.body}</p>
          </article>
        ))}
      </div>
      <div className="callout-grid">
        <article className="card callout">
          <span className="callout-icon" aria-hidden="true">
            ↗
          </span>
          <div>
            <span className="badge">Surprising Finding</span>
            <h3>Age has a weak linear association</h3>
            <p>
              r = {ageCorrelation.toFixed(4)}, with a{" "}
              {(age.difference ?? 0).toFixed(2)}-year average gap after median
              imputation. Averages can hide patterns among children and adults.
            </p>
          </div>
        </article>
        <article className="card callout">
          <span className="callout-icon" aria-hidden="true">
            !
          </span>
          <div>
            <span className="badge danger-bg">Limitation</span>
            <h3>Cabin location remains unexplored</h3>
            <p>
              Cabin was dropped because {(cabin?.pct ?? 0).toFixed(2)}% was
              missing. This simple analysis cannot assess the relationship
              between cabin location and survival.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
