async function handleTakePhoto() {
  var chatBox = document.getElementById("chat-box");

  var newImage = document.createElement("img");
  newImage.classList.add("bw-photo");
  newImage.classList.add("reduced-size");
  newImage.src = "images/developing.png";
  chatBox.appendChild(newImage);

  try {
    var photoPostData = {
      gameID: gameID,
      requestType: "provide image",
    };
    var photoPostResponse = await fetch(urlPrefix + "/reporter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(photoPostData),
    });

    var photoPostResult = await photoPostResponse.json();
    var photoMessage = photoPostResult.message;
    console.log(photoMessage);
    if (photoMessage.includes("http")) {
      newImage.src = "";
      //   newImage.classList.remove("reduced-size");
      newImage.src = photoMessage;
    } else {
      newImage.src = "images/try-again.webp";
      setTimeout(function () {
        chatBox.removeChild(newImage);
      }, 5000);
    }
  } catch (error) {
    console.log("Error: " + error.message);
  }
}
