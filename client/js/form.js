import { getCategories, addPlant } from "./api.js";
import { searchInput, renderPlants } from "./plants.js";
import { displayMessage } from "./utils.js";

const plantForm = document.getElementById("plant-form");

export async function categoryDropdown() {
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
    displayMessage(
      "Kunde inte hämta kategorierna, vänligen försök igen...",
      "error",
    );
  }
}

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
    displayMessage(
      "Kunde inte lägga till växten, vänligen försök igen...",
      "error",
    );
  }
}

plantForm.addEventListener("submit", (e) => {
  e.preventDefault();
  postForm();
});
