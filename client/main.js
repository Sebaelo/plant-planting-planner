const plantForm = document.getElementById("plant-form");
const displayMessages = document.getElementById("display-messages");

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

async function deletePlant(id, row) {
  try {
    const response = await fetch(`/api/plants/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const delError = await response.json();
      throw new Error(delError.error);
    }

    row.remove();
  } catch (err) {
    console.error(err);
    displayMessages.textContent = err.message;
  }
}

function createPlantRow(plant) {
  const tableBody = document.getElementById("table-body");

  const row = document.createElement("tr");

  const plantName = document.createElement("td");
  plantName.textContent = plant.plant_name;

  const amountToPlant = document.createElement("td");
  amountToPlant.textContent = `${plant.amount_to_plant} st`;

  const monthToPlant = document.createElement("td");
  monthToPlant.textContent = months[plant.month_to_plant - 1];

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.classList.add("btn-delete");

  const deleteIcon = document.createElement("img");
  deleteIcon.src = "./assets/icons/delete.svg";
  deleteIcon.alt = `Ta bort ${plant.plant_name}`;

  deleteBtn.appendChild(deleteIcon);

  deleteBtn.addEventListener("click", () => deletePlant(plant.id, row));

  const delPlant = document.createElement("td");
  delPlant.appendChild(deleteBtn);

  row.append(plantName, amountToPlant, monthToPlant, delPlant);

  tableBody.appendChild(row);
}

async function renderPlants() {
  try {
    const response = await fetch("/api/plants");

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const plants = await response.json();

    plants.forEach((plant) => {
      createPlantRow(plant);
    });
  } catch (err) {
    console.error(err);
  }
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

    displayMessages.textContent = data.message;
    setTimeout(() => {
      displayMessages.textContent = "";
    }, 2000);

    createPlantRow(data.addedPlant);
    plantForm.reset();
  } catch (err) {
    console.error(err);
    displayMessages.textContent = err.message;
  }
}

plantForm.addEventListener("submit", postForm);

renderPlants();
