async function handleChatInput() {
  var input = document.getElementById("chat-input");
  var chatInput = input.value.trim();

  if (chatInput) {
    var chatBox = document.getElementById("chat-box");
    var newMessage = document.createElement("div");
    newMessage.textContent = chatInput;
    newMessage.classList.add("message");

    chatBox.appendChild(newMessage);

    var newResponse = document.createElement("div");
    newResponse.classList.add("response");
    newResponse.textContent = "awaiting response..."; // Placeholder text
    chatBox.appendChild(newResponse);

    // Scroll to the bottom
    chatBox.scrollTop = chatBox.scrollHeight;

    input.value = ""; // Clear input field - TODO: restore previous chatInput on error or busy

    const response = await fetch(urlPrefix + "/reporter/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatInput }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let done = false;

    let accumulatedText = "";
    let buffer = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;

      if (value) {
        buffer += decoder.decode(value, { stream: true });

        // Split the buffer by double newline to detect paragraph breaks
        const lines = buffer.split("\n\n");
        buffer = lines.pop(); // Keep the last incomplete line in the buffer

        for (const line of lines) {
          // Remove 'data: ' prefix if present
          const cleanedLine = line.startsWith("data: ") ? line.slice(6) : line;
          if (cleanedLine.trim() === "[DONE]") {
            // Stream is finished
            console.log("Stream is finished");
            reader.cancel();
            return;
          }
          if (cleanedLine === "") {
            // If line is empty, add a paragraph break
            accumulatedText += "\n\n";
          } else {
            // Otherwise, add the cleaned line as it is
            accumulatedText += cleanedLine;
          }
          newResponse.textContent = accumulatedText;
          newResponse.scrollTop = newResponse.scrollHeight;
        }
      }
    }
  }
}
