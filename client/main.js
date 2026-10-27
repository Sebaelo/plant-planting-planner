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

async function createTable() {
  const tableBody = document.getElementById("table-body");

  try {
    const response = await fetch("/api/plants");

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const plants = await response.json();

    plants.forEach((plant) => {
      const row = document.createElement("tr");

      const plantName = document.createElement("td");
      plantName.textContent = plant.plant_name;

      const amountToPlant = document.createElement("td");
      amountToPlant.textContent = `${plant.amount_to_plant} st`;

      const monthToPlant = document.createElement("td");
      monthToPlant.textContent = months[plant.month_to_plant - 1];

      row.append(plantName, amountToPlant, monthToPlant);

      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error(err);
  }
}

createTable();
