const video = document.getElementById("videoInput");
const registerButton = document.getElementById("registerUser");
const signInButton = document.getElementById("sign-in");

Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri("../facialRecognitionModels"),
  faceapi.nets.faceLandmark68Net.loadFromUri("../facialRecognitionModels"),
  faceapi.nets.ssdMobilenetv1.loadFromUri("../facialRecognitionModels"), // Heavier/accurate version of tiny face detector
  faceapi.nets.tinyFaceDetector.loadFromUri("../facialRecognitionModels"), // Load TinyFaceDetector model
]).then(start);

function start() {
  document.body.append("Models Loaded");

  navigator.getUserMedia(
    {
      video: {},
    },
    (stream) => {
      video.srcObject = stream;
    },
    (err) => console.log(err)
  );

  recognizeFaces();
}

async function recognizeFaces() {
  try {
    const labeledDescriptors = await fetch("api/facialRecognition/descriptors")
      .then((response) => response.json())
      .then((data) => {
        return data
          .filter((d) => d.PatientID !== null) // Filter out entries with PatientID null
          .map((d) => {
            const descriptors = new Float32Array(Object.values(d.descriptor));
            return {
              labeledFaceDescriptors: new faceapi.LabeledFaceDescriptors(
                d.name,
                [descriptors]
              ),
              patientID: d.PatientID, // Assume that your data contains PatientID
            };
          });
      });

    console.log(labeledDescriptors);
    const faceMatcher = new faceapi.FaceMatcher(
      labeledDescriptors.map((ld) => ld.labeledFaceDescriptors),
      0.4
    );

    video.addEventListener("play", async () => {
      console.log("Playing");
      const canvas = faceapi.createCanvasFromMedia(video);
      document.getElementById("face-container").append(canvas);

      const displaySize = { width: video.width, height: video.height };
      faceapi.matchDimensions(canvas, displaySize);

      setInterval(async () => {
        try {
          const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();
          const resizedDetections = faceapi.resizeResults(
            detections,
            displaySize
          );

          canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

          const results = resizedDetections.map((d) =>
            faceMatcher.findBestMatch(d.descriptor)
          );

          let isUnknown = false;
          let matchedPatientID = null;

          results.forEach((result, i) => {
            console.log(`${result.toString()}`);

            const box = resizedDetections[i].detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, {
              label: result.toString(),
            });
            drawBox.draw(canvas);

            if (result.label === "unknown") {
              isUnknown = true;
              console.log(isUnknown);
            } else {
              const matchedDescriptor = labeledDescriptors.find(
                (ld) => ld.labeledFaceDescriptors.label === result.label
              );
              if (matchedDescriptor) {
                matchedPatientID = matchedDescriptor.patientID;
              }
            }
          });

          // Disable or enable the sign-in button based on face recognition result
          try {
            signInButton.disabled = isUnknown;
            signInButton.dataset.patientId = matchedPatientID; // Store the patient ID in a data attribute
          } catch {
            console.log("No Sign-In Button");
          }
        } catch (error) {
          console.error("Error during face detection:", error);
        }
      }, 100);
    });
  } catch (error) {
    console.error("Error during face recognition initialization:", error);
  }
}

try {
  registerButton.addEventListener("click", async () => {
    try {
      const detections = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();
      if (detections) {
        const descriptor = detections.descriptor;
        const name = prompt("Enter your name");
        const patientDetails = JSON.parse(
          localStorage.getItem("patientDetails")
        );
        const PatientID = patientDetails ? patientDetails.PatientID : null;
        const DoctorID = null; // Set DoctorID to null for patients

        if (name && PatientID) {
          // Fetch existing descriptors to check if PatientID exists
          const labeledDescriptors = await fetch(
            "api/facialRecognition/descriptors"
          ).then((response) => response.json());

          const existingDescriptor = labeledDescriptors.find(
            (d) => d.PatientID === PatientID
          );

          if (existingDescriptor) {
            // Update existing descriptor
            const response = await fetch("api/facialRecognition/update", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ name, descriptor, PatientID, DoctorID }),
            });

            if (response.ok) {
              alert("User updated successfully!");
              location.reload(); // Reload the page to fetch the updated descriptors
            } else {
              alert("Failed to update user.");
            }
          } else {
            // Register new descriptor
            const response = await fetch("api/facialRecognition/register", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ name, descriptor, PatientID, DoctorID }),
            });

            if (response.ok) {
              alert("User registered successfully!");
              location.reload(); // Reload the page to fetch the updated descriptors
            } else {
              alert("Failed to register user.");
            }
          }
        } else {
          alert("Patient ID not found or name not provided.");
        }
      } else {
        alert("No face detected. Please try again.");
      }
    } catch (error) {
      console.error("Error during user registration:", error);
    }
  });
} catch {
  console.log("Not at Register FaceAuth");
}
async function signIn() {
  const PatientID = signInButton.dataset.patientId;
  if (PatientID) {
    fetch(`/api/patient/faceAuth/${PatientID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Error updating patient", data.error);
        } else {
          console.log(data);

          localStorage.setItem("patientDetails", JSON.stringify(data.user));

          localStorage.setItem("PatientJWTAuthToken", data.token);

          localStorage.setItem("PatientID", data.user.PatientID);
          window.location.href = "../patientHomePage.html"; // Redirect to home page or another page after sign-in
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    alert("No patient ID found. Please try again.");
  }
}
const deleteDescriptor = async () => {
  try {
    const patientDetails = JSON.parse(localStorage.getItem("patientDetails"));
    const PatientID = patientDetails ? patientDetails.PatientID : null;
    const DoctorID = null;

    if (PatientID) {
      const response = await fetch("/api/facialRecognition/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ PatientID, DoctorID }),
      });

      if (response.ok) {
        alert("Descriptor deleted successfully!");
        location.reload(); // Reload the page to fetch the updated descriptors
      } else {
        alert("Failed to delete descriptor.");
      }
    } else {
      alert("Patient ID not found.");
    }
  } catch (error) {
    console.error("Error during descriptor deletion:", error);
  }
};
