async function initMap() {
  try {
    const response = await fetch(
      `${window.location.origin}/api/chasClinicRoutes`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "PatientJWTAuthToken"
          )}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    const apiKey = data.apiKey;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=loadMap`;
    script.async = true;
    document.head.appendChild(script);
  } catch (error) {
    console.error("Error fetching the map API key:", error);
  }
}

function loadMap() {
  const singapore = { lat: 1.3521, lng: 103.8198 }; // Singapore coordinates
  const map = new google.maps.Map(document.getElementById("map"), {
    center: singapore,
    zoom: 12, // Adjust zoom level as needed
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        map.setCenter(pos);

        new google.maps.Marker({
          position: pos,
          map: map,
          title: "You are here",
        });
      },
      () => {
        handleLocationError(true, map.getCenter());
      }
    );
  } else {
    handleLocationError(false, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, pos) {
  const infoWindow = new google.maps.InfoWindow();
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

document.addEventListener("DOMContentLoaded", initMap);
