const plantForm = document.getElementById("plant-form");
const tableBody = document.getElementById("table-body");
const displayMessages = document.getElementById("display-messages");

let plants = [];

const months = [
  "januari",
  "februari",
  "mars",
  "april",
  "maj",
  "juni",
  "juli",
  "augusti",
  "september",
  "oktober",
  "november",
  "december",
];

async function categoryDropdown() {
  const categorySelect = document.getElementById("category");

  try {
    const response = await fetch("/api/categories");

    const categories = await response.json();

    if (!response.ok) {
      throw new Error(categories.error);
    }

    categories.forEach((category) => {
      const categoryOptions = document.createElement("option");
      categoryOptions.value = category.id;
      categoryOptions.textContent = category.category;
      categorySelect.append(categoryOptions);
    });
  } catch (err) {
    console.error(err);
    displayMessages.textContent = err.message;
  }
}

function createPlantRow(plant) {
  const row = document.createElement("tr");

  const plantName = document.createElement("td");
  plantName.textContent = plant.plant_name;

  const amountToPlant = document.createElement("td");
  amountToPlant.textContent = `${plant.amount_to_plant} st`;

  const plantCategory = document.createElement("td");
  plantCategory.textContent = plant.category;

  const monthToPlant = document.createElement("td");
  monthToPlant.textContent = months[plant.month_to_plant - 1];

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.title = `Ta bort ${plant.plant_name.toLowerCase()}`;
  deleteBtn.classList.add("btn-delete");

  const deleteIcon = document.createElement("img");
  deleteIcon.src = "/assets/icons/delete.svg";
  deleteIcon.alt = `Ta bort ${plant.plant_name}`;

  deleteBtn.appendChild(deleteIcon);

  deleteBtn.addEventListener("click", () => deletePlant(plant.id));

  const delPlant = document.createElement("td");
  delPlant.appendChild(deleteBtn);

  row.append(plantName, amountToPlant, plantCategory, monthToPlant, delPlant);

  tableBody.appendChild(row);
}

async function fetchPlants() {
  try {
    const response = await fetch("/api/plants");

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    plants = data;
    renderTable();
  } catch (err) {
    console.error(err);
    displayMessages.textContent = err.message;
  }
}

function renderTable() {
  tableBody.textContent = "";
  plants.forEach((plant) => {
    createPlantRow(plant);
  });
}

async function postForm(event) {
  event.preventDefault();

  const formData = new FormData(plantForm);
  const plant = Object.fromEntries(formData);

  const amount = Number(plant.amountToPlant);

  if (!Number.isInteger(amount) || amount <= 0) {
    displayMessages.textContent = "Mängd måste vara ett positivt heltal.";
    return;
  }

  try {
    const response = await fetch("/api/plants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(plant),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    plants.push(data.addedPlant);
    renderTable();

    plantForm.reset();

    displayMessages.textContent = data.message;
    setTimeout(() => {
      displayMessages.textContent = "";
    }, 2000);
  } catch (err) {
    console.error(err);
    displayMessages.textContent = err.message;
  }
}

plantForm.addEventListener("submit", postForm);

async function deletePlant(id) {
  try {
    const response = await fetch(`/api/plants/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const delError = await response.json();
      throw new Error(delError.error);
    }

    plants = plants.filter((plant) => plant.id !== id);
    renderTable();
  } catch (err) {
    console.error(err);
    displayMessages.textContent = err.message;
  }
}

categoryDropdown();
fetchPlants();
