import { displayMonth } from "./utils.js";
import { plantDetailsModal, plantEditModal } from "./modals.js";

const tableBody = document.getElementById("table-body");

function createPlantRow(plant, onDelete, onSave) {
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
    onDelete(plant.id);
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
    plantEditModal(plant, onSave);
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

export function renderTable(plants, onDelete, onSave) {
  tableBody.replaceChildren();
  plants.forEach((plant) => {
    createPlantRow(plant, onDelete, onSave);
  });
}
