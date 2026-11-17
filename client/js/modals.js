import { months, displayMonth, displayMessage } from "./utils.js";
import { getCategories } from "./api.js";

export const modal = document.querySelector("dialog");

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

export function plantDetailsModal(plant) {
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

export async function plantEditModal(plant, onSave) {
  let categories;

  try {
    categories = await getCategories();
  } catch (err) {
    console.error(err);
    displayMessage(err.message, "error");
    return;
  }

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

  form.addEventListener("submit", (e) => onSave(e, plant.id));

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
