async function initializeAssistants() {
  try {
    var grantIdPostData = {
      requestType: "grant gameID",
    };
    var grantIdPostResponse = await fetch(urlPrefix + "/reporter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(grantIdPostData),
    });

    var grantIdPostResult = await grantIdPostResponse.json();
    var grantIdMessage = grantIdPostResult.message;
    console.log(grantIdMessage);
    gameID = grantIdPostResult.gameID || null;

    if (gameID) {
      var initPostData = {
        gameID: gameID,
        requestType: "initialize",
      };
      var initPostResponse = await fetch(urlPrefix + "/reporter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(initPostData),
      });

      var initPostResult = await initPostResponse.json();
      togglePhotoButton();
      var initMessage = initPostResult.message;
      console.log(initMessage);
    } else {
      console.log("Error: gameID not granted"); // TODO: notify user
    }
  } catch (error) {
    console.log("Error: " + error.message);
  }
}
