export async function fetchDashboard(signal) {
  const response = await fetch('/api/dashboard', { signal });
  if (!response.ok) {
    throw new Error(`Unable to load analysis (HTTP ${response.status}). Check that the backend is running.`);
  }
  return response.json();
}
