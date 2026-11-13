const plantForm = document.getElementById("plant-form");
const tableBody = document.getElementById("table-body");
const displayMessages = document.getElementById("display-messages");
const searchInput = document.getElementById("search-plants");
const modal = document.querySelector("dialog");

let plants = [];
let categories = [];

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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    categories = data;

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
    deletePlant(plant.id);
  });

  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.title = `Redigera ${plant.plant_name.toLowerCase()}`;
  editBtn.classList.add("btn-edit");

  const editIcon = document.createElement("img");
  editIcon.src = "/assets/icons/edit.svg";

  editBtn.appendChild(editIcon);

  editBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    plantEditModal(plant);
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

async function postForm(e) {
  e.preventDefault();

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

  const modalTitle = document.createElement("h2");
  modalTitle.textContent = plant.plant_name;

  const modalDetails = document.createElement("dl");
  modalDetails.classList.add("plant-details");

  const amountDetails = createDetailRow("Mängd", `${plant.amount_to_plant} st`);

  const monthDetails = createDetailRow(
    "Månad",
    displayMonth(plant.month_to_plant),
  );

  const categoryDetails = createDetailRow("Kategori", plant.category);

  modalDetails.append(amountDetails, monthDetails, categoryDetails);

  const adviceSection = document.createElement("section");
  adviceSection.classList.add("advice-section");

  const adviceLabel = document.createElement("h3");
  adviceLabel.textContent = "Skötselråd";

  const adviceContent = document.createElement("p");
  adviceContent.textContent = plant.planting_advice;

  adviceSection.append(adviceLabel, adviceContent);

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.textContent = "Stäng";
  closeBtn.classList.add("btn-close");

  closeBtn.addEventListener("click", () => modal.close());

  modal.append(modalTitle, modalDetails, adviceSection, closeBtn);
  modal.showModal();
}

function createEditRow(labelText, field, id) {
  const row = document.createElement("div");
  row.classList.add("plant-details-row");

  const label = document.createElement("label");
  label.textContent = labelText;
  label.htmlFor = id;

  field.id = id;

  row.append(label, field);
  return row;
}

function plantEditModal(plant) {
  modal.replaceChildren();

  const modalTitle = document.createElement("h2");
  modalTitle.textContent = plant.plant_name;

  const form = document.createElement("form");
  form.classList.add("plant-details");

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.name = "plantName";
  nameInput.required = true;
  nameInput.value = plant.plant_name;

  const nameRow = createEditRow("Växtnamn", nameInput, "edit-name");

  const amountInput = document.createElement("input");
  amountInput.type = "number";
  amountInput.name = "amountToPlant";
  amountInput.required = true;
  amountInput.value = plant.amount_to_plant;
  amountInput.classList.add("no-arrows");

  const amountRow = createEditRow("Mängd", amountInput, "edit-amount");

  const monthDropdown = document.createElement("select");

  months.forEach((month, index) => {
    const monthOption = document.createElement("option");
    monthOption.value = index + 1;
    monthOption.textContent = month[0].toUpperCase() + month.slice(1);
    monthDropdown.append(monthOption);
  });

  monthDropdown.name = "monthToPlant";
  monthDropdown.value = plant.month_to_plant;

  const monthRow = createEditRow("Månad", monthDropdown, "edit-month");

  const categorySelect = document.createElement("select");

  categories.forEach((category) => {
    const categoryOption = document.createElement("option");
    categoryOption.value = category.id;
    categoryOption.textContent = category.category;
    categorySelect.append(categoryOption);
  });

  categorySelect.name = "plantCategory";
  categorySelect.value = plant.category_id;

  const categoryRow = createEditRow(
    "Kategori",
    categorySelect,
    "edit-category",
  );

  const adviceTextarea = document.createElement("textarea");
  adviceTextarea.name = "plantingAdvice";
  adviceTextarea.rows = 5;
  adviceTextarea.value = plant.planting_advice;

  const adviceRow = createEditRow("Skötselråd", adviceTextarea, "edit-advice");

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.textContent = "Stäng";
  closeBtn.classList.add("btn-close");

  closeBtn.addEventListener("click", () => modal.close());

  const saveBtn = document.createElement("button");
  saveBtn.type = "submit";
  saveBtn.textContent = "Spara";
  saveBtn.classList.add("btn-save");

  const modalButtons = document.createElement("div");
  modalButtons.classList.add("modal-buttons");
  modalButtons.append(saveBtn, closeBtn);

  form.addEventListener("submit", (e) => editPlant(e, plant.id));

  form.append(
    nameRow,
    amountRow,
    monthRow,
    categoryRow,
    adviceRow,
    modalButtons,
  );
  modal.append(modalTitle, form);
  modal.showModal();
}

async function editPlant(e, plantId) {
  e.preventDefault();
  console.log("plantId: ", plantId);

  const formData = new FormData(event.target);
  const plantData = Object.fromEntries(formData);

  try {
    const response = await fetch(`/api/plants/${plantId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(plantData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }

    plants = plants.map((plant) =>
      plant.id === plantId ? data.editedPlant : plant,
    );

    renderTable();

    displayMessages.textContent = data.message;
    setTimeout(() => {
      displayMessages.textContent = "";
      modal.close();
    }, 2000);
  } catch (err) {
    console.error(err);
    displayMessages.textContent = err.message;
  }
}

categoryDropdown();
fetchPlants();
