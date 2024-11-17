const photoButton = document.getElementById("take-photo-button");

function togglePhotoButton() {
  if (readyToTakePhoto) {
    photoButton.classList.replace("ready", "not-ready");
    photoButton.disabled = true;
    readyToTakePhoto = false;
  } else {
    photoButton.classList.replace("not-ready", "ready");
    photoButton.disabled = false;
    readyToTakePhoto = true;
  }
}
