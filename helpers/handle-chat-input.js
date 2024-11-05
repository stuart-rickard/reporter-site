async function handleChatInput() {
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

    input.value = ""; // Clear input field - TODO: restore previous message on error or busy

    try {
      var actionPostData = {
        gameID: gameID,
        requestType: "respond to action",
        message: message,
      };
      var actionPostResponse = await fetch(urlPrefix + "/reporter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(actionPostData),
      });

      var actionPostResult = await actionPostResponse.json();
      var actionMessage = actionPostResult.message;
      console.log(actionMessage);
      // Update response message with API data
      newResponse.textContent = actionMessage;
    } catch (error) {
      newResponse.textContent = "Error: " + error.message;
    }
  }
}
