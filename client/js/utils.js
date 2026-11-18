export const months = [
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

export function displayMonth(monthNumber) {
  return months[monthNumber - 1];
}

export function displayMessage(messageToDisplay, type = "info") {
  let message = document.getElementById("display-messages");

  const modal = document.querySelector("dialog");

  if (modal.open) {
    message = modal.querySelector(".modal-message") ?? message;
  }

  message.textContent = messageToDisplay;
  message.classList.toggle("error-message", type === "error");
}

export function validatePlant(plant) {
  const amount = Number(plant.amountToPlant);

  if (!plant.plantName.trim()) {
    return "Växtnamn måste vara ifyllt.";
  }
  if (!Number.isInteger(amount) || amount <= 0) {
    return "Mängd måste vara ett positivt heltal.";
  }
  if (!plant.monthToPlant) {
    return "Vänligen välj en månad.";
  }
  if (!plant.plantCategory) {
    return "Vänligen välj en kategori.";
  }
  if (!plant.plantingAdvice.trim()) {
    return "Skötselråd måste vara ifyllt.";
  }
  return null;
}

export function displayWhenToPlant(plantMonth) {
  const currentMonth = new Date().getMonth() + 1;
  const monthsLeft = (plantMonth - currentMonth + 12) % 12; // Clock arithmetic

  if (monthsLeft === 0) {
    return "plantera denna månaden";
  }
  if (monthsLeft === 1) {
    return "plantera nästa månad";
  }
  return `plantera om ${monthsLeft} månader`;
}
