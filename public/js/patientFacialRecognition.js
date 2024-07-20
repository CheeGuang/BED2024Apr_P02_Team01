const video = document.getElementById("videoInput");
const registerButton = document.getElementById("registerUser");

Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri("../facialRecognitionModels"),
  faceapi.nets.faceLandmark68Net.loadFromUri("../facialRecognitionModels"),
  faceapi.nets.ssdMobilenetv1.loadFromUri("../facialRecognitionModels"), // Heavier/accurate version of tiny face detector
  faceapi.nets.tinyFaceDetector.loadFromUri("../facialRecognitionModels"), // Load TinyFaceDetector model
]).then(start);

function start() {
  document.body.append("Models Loaded");

  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  );

  recognizeFaces();
}

async function recognizeFaces() {
  const labeledDescriptors = await fetch("api/facialRecognition/descriptors")
    .then((response) => response.json())
    .then((data) => {
      return data.map((d) => {
        const descriptors = new Float32Array(Object.values(d.descriptor));
        return new faceapi.LabeledFaceDescriptors(d.name, [descriptors]);
      });
    });

  console.log(labeledDescriptors);
  const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.4);

  video.addEventListener("play", async () => {
    console.log("Playing");
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);

    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

      const results = resizedDetections.map((d) =>
        faceMatcher.findBestMatch(d.descriptor)
      );
      results.forEach((result, i) => {
        const box = resizedDetections[i].detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, {
          label: result.toString(),
        });
        drawBox.draw(canvas);
      });
    }, 100);
  });
}

function loadLabeledImages() {
  const labels = ["Prashant Kumar"]; // for WebCam
  return Promise.all(
    labels.map(async (label) => {
      const descriptions = [];
      for (let i = 1; i <= 2; i++) {
        const img = await faceapi.fetchImage(
          `../labeled_images/${label}/${i}.jpg`
        );
        const detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        console.log(label + i + JSON.stringify(detections));
        descriptions.push(detections.descriptor);
      }
      document.body.append(label + " Faces Loaded | ");
      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    })
  );
}

registerButton.addEventListener("click", async () => {
  const detections = await faceapi
    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();
  if (detections) {
    const descriptor = detections.descriptor;
    const name = prompt("Enter your name");
    if (name) {
      fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, descriptor }),
      }).then((response) => {
        if (response.ok) {
          alert("User registered successfully!");
          location.reload(); // Reload the page to fetch the updated descriptors
        } else {
          alert("Failed to register user.");
        }
      });
    }
  } else {
    alert("No face detected. Please try again.");
  }
});
