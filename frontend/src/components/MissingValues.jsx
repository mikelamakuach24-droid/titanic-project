export default function MissingValues({ data = [] } = {}) {
  const rows = Array.isArray(data) ? data : [];
  const cabin = rows.find((row) => row.column === "Cabin");
  return (
    <section className="card" aria-labelledby="missing-title">
      <div className="card-heading">
        <div className="eyebrow">01 / Data preparation</div>
        <h2 id="missing-title">Data Quality & Missing Values</h2>
        <p>Three simple decisions before exploring survival patterns.</p>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Column</th>
              <th scope="col">Missing Count</th>
              <th scope="col">Missing %</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.column}>
                <td>{row.column}</td>
                <td>{row.count ?? 0}</td>
                <td>
                  <span
                    className={`badge ${row.column === "Cabin" ? "danger-bg" : ""}`}
                  >
                    {(row.pct ?? 0).toFixed(2)}%
                  </span>
                </td>
                <td className="treatment">{row.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="note">
        <strong>Why drop Cabin?</strong>{" "}
        {cabin
          ? `${cabin.pct.toFixed(2)}% of cabin values were missing.`
          : "Most cabin values were missing."}{" "}
        Filling them would require strong assumptions. Cabin location is
        therefore outside this analysis.
      </p>
    </section>
  );
}
