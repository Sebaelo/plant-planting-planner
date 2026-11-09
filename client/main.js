const plantForm = document.getElementById("plant-form");
const tableBody = document.getElementById("table-body");
const displayMessages = document.getElementById("display-messages");
const searchInput = document.getElementById("search-plants");
const modal = document.querySelector("dialog");

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

function displayMonth(monthNumber) {
  return months[monthNumber - 1];
}

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
    deletePlant(plant.id);
  });

  const delPlant = document.createElement("td");
  delPlant.appendChild(deleteBtn);

  row.addEventListener("click", () => {
    plantDetailsModal(plant);
  });

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
  tableBody.replaceChildren();
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

async function searchPlants(query) {
  try {
    const response = await fetch(`/api/plants/search?q=${query}`);

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

searchInput.addEventListener("input", (event) => {
  searchPlants(event.target.value);
});

function createDetailRow(label, value) {
  const detailsRow = document.createElement("div");
  detailsRow.classList.add("plant-details-row");

  const detailsLabel = document.createElement("dt");
  detailsLabel.textContent = label;

  const detailsValue = document.createElement("dd");
  detailsValue.textContent = value;

  detailsRow.append(detailsLabel, detailsValue);

  return detailsRow;
}

function plantDetailsModal(plant) {
  modal.replaceChildren();

  modal.showModal();

  const modalTitle = document.createElement("h2");
  modalTitle.textContent = `${plant.plant_name}`;

  const modalDetails = document.createElement("dl");
  modalDetails.classList.add("plant-details");

  const amountDetails = createDetailRow("Mängd", `${plant.amount_to_plant} st`);

  const monthDetails = createDetailRow(
    "Månad",
    displayMonth(plant.month_to_plant),
  );

  const categoryDetails = createDetailRow("Kategori", plant.category);

  modalDetails.append(amountDetails, monthDetails, categoryDetails);

  // TODO: Create <section>, <h3> and <p>

  // TODO: Append <h3> and <p> to <section>

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.textContent = "Stäng";
  closeBtn.classList.add("close-btn");

  closeBtn.addEventListener("click", () => modal.close());

  // TODO: Append section between modalDetails and closeBtn
  modal.append(modalTitle, modalDetails, closeBtn);
}

categoryDropdown();
fetchPlants();
