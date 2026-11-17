import { searchPlants, getPlants, deletePlant, updatePlant } from "./api.js";
import { modal } from "./modals.js";
import { renderTable } from "./table.js";
import { displayMessage } from "./utils.js";

export const searchInput = document.getElementById("search-plants");

export async function renderPlants() {
  try {
    const query = searchInput.value;

    const plants = query ? await searchPlants(query) : await getPlants();

    renderTable(plants);
  } catch (err) {
    console.error(err);
    displayMessage(
      "Kunde inte hämta växterna, vänligen försök igen...",
      "error",
    );
  }
}
searchInput.addEventListener("input", renderPlants);

export async function handleDeletePlant(id) {
  try {
    await deletePlant(id);

    renderPlants();
  } catch (err) {
    console.error(err);
    displayMessage(
      "Kunde inte ta bort växten, vänligen försök igen...",
      "error",
    );
  }
}

export async function editPlant(e, plantId) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const plantData = Object.fromEntries(formData);

  try {
    const data = await updatePlant(plantId, plantData);

    renderPlants();

    displayMessage(data.message);
    setTimeout(() => {
      displayMessage("");
      modal.close();
    }, 2000);
  } catch (err) {
    console.error(err);
    displayMessage(
      "Kunde inte spara redigeringen, vänligen försök igen...",
      "error",
    );
  }
}
