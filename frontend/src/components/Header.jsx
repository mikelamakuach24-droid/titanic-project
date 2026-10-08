export default function Header({ data = {} } = {}) {
  return (
    <header className="header">
      <div className="page-width header-content">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 19V5M4 19h16M8 14l4-5 4 3 4-7" />
            </svg>
          </span>
          <div>
            <h1>Titanic Analysis by Micheal Makuach Aguto</h1>
            <p>
              Exploring survival factors, correlations, and key insights in the
              Kaggle Titanic dataset.
            </p>
          </div>
        </div>
        <div className="badges">
          <span className="badge">Kaggle Dataset</span>
          <span className="badge">
            {data.total == null
              ? "Passenger sample"
              : `${data.total.toLocaleString()} Records`}
          </span>
          <span className="badge">EDA Report</span>
        </div>
      </div>
    </header>
  );
}
