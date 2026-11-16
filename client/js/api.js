async function apiRequest(url, options) {
  const response = await fetch(url, options);
  const data = response.status === 204 ? null : await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Kunde inte nå servern, vänligen försök igen...",
    );
  }
  return data;
}

export async function getPlants() {
  return apiRequest("/api/plants");
}

export async function getCategories() {
  return apiRequest("/api/categories");
}

export async function addPlant(plant) {
  return apiRequest("/api/plants", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(plant),
  });
}

export async function updatePlant(id, plant) {
  return apiRequest(`/api/plants/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(plant),
  });
}

export async function deletePlant(id) {
  return apiRequest(`/api/plants/${id}`, { method: "DELETE" });
}

export async function searchPlants(query) {
  return apiRequest(`/api/plants/search?q=${query}`);
}
