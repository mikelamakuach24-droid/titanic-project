import { useEffect, useState } from "react";
import { fetchDashboard } from "./api.js";
import Header from "./components/Header.jsx";
import KpiCards from "./components/KpiCards.jsx";
import MissingValues from "./components/MissingValues.jsx";
import SurvivalPie from "./components/SurvivalPie.jsx";
import FactorCharts from "./components/FactorCharts.jsx";
import CorrelationChart from "./components/CorrelationChart.jsx";
import Conclusion from "./components/Conclusion.jsx";

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetchDashboard(controller.signal)
      .then(setData)
      .catch((problem) => {
        if (problem.name !== "AbortError") setError(problem.message);
      });
    return () => controller.abort();
  }, []);
  return (
    <>
      <Header data={data?.summary ?? {}} />
      {error ? (
        <main className="status-message" role="alert">
          <h2>Could not load the analysis</h2>
          <p>{error}</p>
          <p>Check the backend connection, then refresh this page.</p>
        </main>
      ) : !data ? (
        <main className="status-message" role="status">
          <h2>Loading passenger data…</h2>
          <p>Preparing the survival analysis.</p>
        </main>
      ) : (
        <main className="page-width dashboard">
          <KpiCards summary={data.summary} correlation={data.correlation} />
          <div className="overview-grid">
            <MissingValues data={data.missing_values} />
            <SurvivalPie data={data.overall_survival} summary={data.summary} />
          </div>
          <FactorCharts
            gender={data.gender}
            pclass={data.pclass}
            age={data.age}
            fare={data.fare}
          />
          <CorrelationChart data={data.correlation} />
          <Conclusion
            correlation={data.correlation}
            gender={data.gender}
            pclass={data.pclass}
            fare={data.fare}
            age={data.age}
            missing={data.missing_values}
          />
        </main>
      )}
      <footer className="footer">
        <div className="page-width footer-content">
          <strong>Titanic Analysis by Micheal Makuach Aguto</strong>
          <span>Data: Kaggle Titanic · A student data analysis portfolio</span>
        </div>
      </footer>
    </>
  );
}
