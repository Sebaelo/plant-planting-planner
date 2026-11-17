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

export function displayMessage(message, type = "info") {
  const displayMessages = document.getElementById("display-messages");

  displayMessages.textContent = message;
  displayMessages.classList.toggle("error-message", type === "error");
}
