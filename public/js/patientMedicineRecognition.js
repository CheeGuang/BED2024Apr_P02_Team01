document.getElementById("uploadButton").addEventListener("click", function () {
  document.getElementById("imageUpload").click();
});

document.getElementById("imageUpload").addEventListener("change", function () {
  if (this.files && this.files[0]) {
    document.getElementById("sendButton").style.display = "block";
    previewImage(this.files[0]);
  }
});

document.getElementById("cameraButton").addEventListener("click", function () {
  const cameraContainer = document.getElementById("camera-container");
  const video = document.getElementById("camera-stream");
  const constraints = {
    video: {
      facingMode: "environment", // Use back camera
    },
  };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      video.srcObject = stream;
      video.play();
      cameraContainer.classList.remove("d-none");
    })
    .catch((error) => {
      console.error("Error accessing the camera:", error);
    });
});

document
  .getElementById("takePhotoButton")
  .addEventListener("click", function () {
    const video = document.getElementById("camera-stream");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    video.pause();
    video.srcObject.getTracks().forEach((track) => track.stop());
    document.getElementById("camera-container").classList.add("d-none");

    canvas.toBlob((blob) => {
      const fileInput = new File([blob], "camera_image.jpg", {
        type: "image/jpeg",
      });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(fileInput);
      document.getElementById("imageUpload").files = dataTransfer.files;

      document.getElementById("sendButton").style.display = "block";
      previewImage(fileInput);
    }, "image/jpeg");
  });

document.getElementById("sendButton").addEventListener("click", function () {
  const fileInput = document.getElementById("imageUpload");
  const patientDetails = JSON.parse(localStorage.getItem("patientDetails"));
  const patientID = patientDetails.PatientID;

  if (!patientID) {
    displayErrorMessage("Patient ID not found");
    return;
  }

  if (fileInput.files && fileInput.files[0]) {
    const formData = new FormData();
    formData.append("image", fileInput.files[0]);
    formData.append("patientDetails", JSON.stringify(patientDetails));

    document.getElementById("loading").style.display = "block";
    document.getElementById("sendButton").disabled = true;

    fetch("/api/chatbot/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "Success") {
          // Store the analysis result in localStorage
          localStorage.setItem("analysisResult", data.response);

          // Redirect to the results page
          window.location.href("patientMedRecognitionResults.html");
        } else {
          displayErrorMessage("Failed to analyze the image.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        displayErrorMessage("An error occurred while analyzing the image.");
      });
  }
});

function previewImage(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById("image-preview").style.display = "block";
    document.getElementById("preview-img").src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function displayErrorMessage(message) {
  document.getElementById("error-message").textContent = message;
  document.getElementById("error-message").style.display = "block";
  document.getElementById("loading").style.display = "none";
  document.getElementById("sendButton").disabled = false;
}
