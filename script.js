const urlPrefix = "http://localhost:3000"; // for local testing
// const urlPrefix = "https://q72.site/api"; // for remote testing

let gameID = null;
let readyToTakePhoto = false;

initializeAssistants(); // also sets gameID

document
  .getElementById("send-button")
  .addEventListener("click", handleChatInput);

// Allow sending message with Enter key
document
  .getElementById("chat-input")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      document.getElementById("send-button").click();
    }
  });

document
  .getElementById("take-photo-button")
  .addEventListener("click", handleTakePhoto);
