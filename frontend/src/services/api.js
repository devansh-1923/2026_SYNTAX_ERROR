const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function request(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export async function getPlanets() {
  return request("/api/planets");
}

export async function getStatistics() {
  return request("/api/statistics");
}

export async function searchPlanets(query) {
  return request(
    `/api/planets/search?q=${encodeURIComponent(query)}`
  );
}

export async function getPlanet(name) {
  return request(
    `/api/planets/${encodeURIComponent(name)}`
  );
}

export async function getPlanetAnalysis(name) {
  return request(
    `/api/planets/${encodeURIComponent(name)}/analysis`
  );
}
/**
 * Backend may return a raw array, or an object wrapping the array
 * (e.g. { planets: [...] } or { results: [...] } or { data: [...] }).
 * This does NOT fabricate anything — it only unwraps whichever real
 * array the backend actually sent. Returns [] only if no array is found.
 */
export function extractPlanetList(payload) {
  if (Array.isArray(payload)) return payload
  if (payload && typeof payload === 'object') {
    for (const key of ['planets', 'results', 'data', 'items']) {
      if (Array.isArray(payload[key])) return payload[key]
    }
    const firstArray = Object.values(payload).find((v) => Array.isArray(v))
    if (firstArray) return firstArray
  }
  return []
}
