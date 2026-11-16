import {
  getPlants,
  getCategories,
  addPlant,
  updatePlant,
  deletePlant,
  searchPlants,
} from "./api.js";

import { displayMonth, displayMessage } from "./utils.js";
import { plantDetailsModal, plantEditModal } from "./modals.js";

const plantForm = document.getElementById("plant-form");
const tableBody = document.getElementById("table-body");
const searchInput = document.getElementById("search-plants");
const modal = document.querySelector("dialog");

let plants = [];

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

function createPlantRow(plant) {
  const row = document.createElement("tr");
  row.tabIndex = 0;

  const plantName = document.createElement("td");
  plantName.textContent = plant.plant_name;

  const amountToPlant = document.createElement("td");
  amountToPlant.textContent = `${plant.amount_to_plant} st`;

  const plantCategory = document.createElement("td");
  plantCategory.textContent = plant.category;

  const monthToPlant = document.createElement("td");
  monthToPlant.textContent = displayMonth(plant.month_to_plant);

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.title = `Ta bort ${plant.plant_name.toLowerCase()}`;
  deleteBtn.classList.add("btn-delete");

  const deleteIcon = document.createElement("img");
  deleteIcon.src = "/assets/icons/delete.svg";
  deleteIcon.alt = `Ta bort ${plant.plant_name}`;

  deleteBtn.appendChild(deleteIcon);

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    handleDeletePlant(plant.id);
  });

  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.title = `Redigera ${plant.plant_name.toLowerCase()}`;
  editBtn.classList.add("btn-edit");

  const editIcon = document.createElement("img");
  editIcon.src = "/assets/icons/edit.svg";
  editIcon.alt = `Redigera ${plant.plant_name}`;

  editBtn.appendChild(editIcon);

  editBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    plantEditModal(plant, editPlant);
  });

  const buttonWrapper = document.createElement("div");
  buttonWrapper.classList.add("table-buttons");
  buttonWrapper.append(editBtn, deleteBtn);

  const tableButtons = document.createElement("td");
  tableButtons.append(buttonWrapper);

  row.addEventListener("click", () => {
    plantDetailsModal(plant);
  });

  row.addEventListener("keydown", (e) => {
    if (e.target !== row) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      plantDetailsModal(plant);
    }
  });

  row.append(
    plantName,
    amountToPlant,
    plantCategory,
    monthToPlant,
    tableButtons,
  );

  tableBody.appendChild(row);
}

async function fetchPlants() {
  try {
    plants = await getPlants();
    renderTable();
  } catch (err) {
    console.error(err);
    displayMessage(err.message, "error");
  }
}

function renderTable() {
  tableBody.replaceChildren();
  plants.forEach((plant) => {
    createPlantRow(plant);
  });
}

async function postForm(e) {
  e.preventDefault();

  const formData = new FormData(plantForm);
  const plant = Object.fromEntries(formData);

  const amount = Number(plant.amountToPlant);

  if (!Number.isInteger(amount) || amount <= 0) {
    displayMessage("Mängd måste vara ett positivt heltal.", "error");
    return;
  }

  try {
    const data = await addPlant(plant);

    plants.push(data.addedPlant);
    renderTable();

    plantForm.reset();

    displayMessage(data.message);
    setTimeout(() => {
      displayMessage("");
    }, 2000);
  } catch (err) {
    console.error(err);
    displayMessage(err.message, "error");
  }
}

plantForm.addEventListener("submit", postForm);

async function handleDeletePlant(id) {
  try {
    await deletePlant(id);

    plants = plants.filter((plant) => plant.id !== id);
    renderTable();
  } catch (err) {
    console.error(err);
    displayMessage(err.message, "error");
  }
}

async function queryPlants(query) {
  try {
    plants = await searchPlants(query);
    renderTable();
  } catch (err) {
    console.error(err);
    displayMessage(err.message, "error");
  }
}

searchInput.addEventListener("input", (event) => {
  queryPlants(event.target.value);
});

async function editPlant(e, plantId) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const plantData = Object.fromEntries(formData);

  try {
    const data = await updatePlant(plantId, plantData);

    plants = plants.map((plant) =>
      plant.id === plantId ? data.editedPlant : plant,
    );

    renderTable();

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
fetchPlants();
