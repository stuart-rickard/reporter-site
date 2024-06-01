const urlPrefix = "http://localhost:3000"; // for local testing
// const urlPrefix = "https://q72.site/api"; // for remote testing

let gameID = null;

// Initialize the assistants
(async function () {
  try {
    var postGrantData = {
      requestType: "grant gameID",
    };
    var postGrantResponse = await fetch(urlPrefix + "/reporter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postGrantData),
    });

    var postGrantResult = await postGrantResponse.json();
    var postGrantMessage = postGrantResult.message;
    console.log(postGrantMessage);
    gameID = postGrantResult.gameID || null;

    if (gameID) {
      var postInitData = {
        gameID: gameID,
        requestType: "initialize",
      };
      var postInitResponse = await fetch(urlPrefix + "/reporter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postInitData),
      });

      var postInitResult = await postInitResponse.json();
      var postInitMessage = postInitResult.message;
      console.log(postInitMessage);
    } else {
      console.log("Error: gameID not granted"); // TODO: notify user
    }
  } catch (error) {
    console.log("Error: " + error.message);
  }
})();

document
  .getElementById("send-button")
  .addEventListener("click", async function () {
    var input = document.getElementById("chat-input");
    var message = input.value.trim();

    if (message) {
      var chatBox = document.getElementById("chat-box");
      var newMessage = document.createElement("div");
      newMessage.textContent = message;
      newMessage.classList.add("message");

      chatBox.appendChild(newMessage);

      var newResponse = document.createElement("div");
      newResponse.classList.add("response");
      newResponse.textContent = "awaiting response..."; // Show "awaiting response..." while waiting for API response

      chatBox.appendChild(newResponse);

      // Scroll to the bottom
      chatBox.scrollTop = chatBox.scrollHeight;

      input.value = ""; // Clear input field

      try {
        var postData = {
          gameID: gameID,
          requestType: "respond to action",
          message: message,
        };
        var postResponse = await fetch(urlPrefix + "/reporter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });

        var postResult = await postResponse.json();
        var postMessage = postResult.message;
        console.log(postMessage);
        // Update response message with API data
        newResponse.textContent = postMessage;
      } catch (error) {
        newResponse.textContent = "Error: " + error.message;
      }
    }
  });

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
  .addEventListener("click", async function () {
    var chatBox = document.getElementById("chat-box");

    var newImage = document.createElement("img");
    newImage.classList.add("bw-photo");
    newImage.classList.add("half-size");
    newImage.src = "images/developing.webp";
    chatBox.appendChild(newImage);

    try {
      var postData = {
        gameID: gameID,
        requestType: "provide image",
      };
      var postResponse = await fetch(urlPrefix + "/reporter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      var postResult = await postResponse.json();
      var postMessage = postResult.message;
      console.log(postMessage);
      if (postMessage.includes("http")) {
        newImage.src = "";
        newImage.classList.remove("half-size");
        newImage.src = postMessage;
      } else {
        newImage.src = "images/try-again.webp";
        setTimeout(function () {
          chatBox.removeChild(newImage);
        }, 5000);
      }
    } catch (error) {
      console.log("Error: " + error.message);
    }
  });
