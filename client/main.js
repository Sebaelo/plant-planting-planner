const plantForm = document.getElementById("plant-form");

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

function addPlantToTable(plant) {
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

  const deletePlant = document.createElement("td");
  deletePlant.appendChild(deleteBtn);

  row.append(plantName, amountToPlant, monthToPlant, deletePlant);

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
      addPlantToTable(plant);
    });
  } catch (err) {
    console.error(err);
  }
}

async function postForm(event) {
  event.preventDefault();
  const submitMessage = document.getElementById("submit-message");

  const formData = new FormData(plantForm);

  const plant = Object.fromEntries(formData);

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

    submitMessage.textContent = data.message;
    setTimeout(() => {
      submitMessage.textContent = "";
    }, 2000);

    addPlantToTable(data.addedPlant);
    plantForm.reset();
  } catch (err) {
    console.error(err);
    submitMessage.textContent = err.message;
  }
}

plantForm.addEventListener("submit", postForm);

renderPlants();
