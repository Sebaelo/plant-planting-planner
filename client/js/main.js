import {
  getPlants,
  getCategories,
  addPlant,
  updatePlant,
  deletePlant,
  searchPlants,
} from "./api.js";

import { displayMessage } from "./utils.js";
import { renderTable } from "./table.js";

const plantForm = document.getElementById("plant-form");
const searchInput = document.getElementById("search-plants");
const modal = document.querySelector("dialog");

async function categoryDropdown() {
  const categorySelect = document.getElementById("category");

  try {
    const categories = await getCategories();

    categories.forEach((category) => {
      const categoryOptions = document.createElement("option");
      categoryOptions.value = category.id;
      categoryOptions.textContent = category.category;
      categorySelect.append(categoryOptions);
    });
  } catch (err) {
    console.error(err);
    displayMessage(err.message, "error");
  }
}

async function renderPlants() {
  try {
    const query = searchInput.value;

    const plants = query ? await searchPlants(query) : await getPlants();

    renderTable(plants, handleDeletePlant, editPlant);
  } catch (err) {
    console.error(err);
    displayMessage(err.message, "error");
  }
}

searchInput.addEventListener("input", renderPlants);

async function postForm() {
  const formData = new FormData(plantForm);
  const plant = Object.fromEntries(formData);

  const amount = Number(plant.amountToPlant);

  if (!Number.isInteger(amount) || amount <= 0) {
    displayMessage("Mängd måste vara ett positivt heltal.", "error");
    return;
  }

  try {
    const data = await addPlant(plant);

    searchInput.value = "";
    plantForm.reset();
    renderPlants();

    displayMessage(data.message);
    setTimeout(() => {
      displayMessage("");
    }, 2000);
  } catch (err) {
    console.error(err);
    displayMessage(err.message, "error");
  }
}

plantForm.addEventListener("submit", (e) => {
  e.preventDefault();
  postForm();
});

async function handleDeletePlant(id) {
  try {
    await deletePlant(id);

    renderPlants();
  } catch (err) {
    console.error(err);
    displayMessage(err.message, "error");
  }
}

async function editPlant(e, plantId) {
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
    displayMessage(err.message, "error");
  }
}

categoryDropdown();
renderPlants();
