document.addEventListener("DOMContentLoaded", () => {
  let map;
  let markers = [];
  let currentInfoWindow = null;

  async function fetchMapApiKey() {
    try {
      const response = await fetch(
        `${window.location.origin}/api/chasClinic/key`,
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
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initializeMap`;
      script.async = true;
      document.head.appendChild(script);
    } catch (error) {
      console.error("Error fetching the map API key:", error);
    }
  }

  window.initializeMap = async function () {
    const singapore = { lat: 1.3521, lng: 103.8198 };
    map = new google.maps.Map(document.getElementById("map"), {
      center: singapore,
      zoom: 12,
    });

    google.maps.event.addListener(map, "idle", () => {
      const bounds = map.getBounds();
      const center = map.getCenter();
      fetchClinicsInBounds(bounds, center);
    });

    await downloadChasClinicData();
    await fetchRandomClinics();
    handleGeolocation();

    // Close the current info window when clicking on the map
    map.addListener("click", () => {
      if (currentInfoWindow) {
        currentInfoWindow.close();
        currentInfoWindow = null;
      }
    });
  };

  async function downloadChasClinicData() {
    try {
      const response = await fetch(
        `${window.location.origin}/api/chasClinic/download`,
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

      if (response.ok) {
        console.log("Clinic data downloaded successfully");
      } else {
        console.error("Error downloading clinic data");
      }
    } catch (error) {
      console.error("Error downloading clinic data:", error);
    }
  }

  async function fetchRandomClinics() {
    try {
      const response = await fetch(
        `${window.location.origin}/api/chasClinic/random`,
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

      const clinics = await response.json();
      displayClinics(clinics);
    } catch (error) {
      console.error("Error fetching random clinics:", error);
    }
  }

  async function fetchNearestClinics(lat, lng) {
    try {
      const response = await fetch(
        `${window.location.origin}/api/chasClinic/nearest?lat=${lat}&lng=${lng}`,
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

      const clinics = await response.json();
      clearMarkers();
      displayClinics(clinics);
      map.setCenter({ lat, lng });
      map.setZoom(15);
    } catch (error) {
      console.error("Error fetching nearest clinics:", error);
    }
  }

  async function fetchClinicsInBounds(bounds, center) {
    try {
      const north = bounds.getNorthEast().lat();
      const south = bounds.getSouthWest().lat();
      const east = bounds.getNorthEast().lng();
      const west = bounds.getSouthWest().lng();
      const centerLat = center.lat();
      const centerLng = center.lng();

      const response = await fetch(
        `${window.location.origin}/api/chasClinic/bounds?north=${north}&south=${south}&east=${east}&west=${west}&centerLat=${centerLat}&centerLng=${centerLng}`,
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

      const clinics = await response.json();
      console.log(clinics);
      clearMarkers();
      displayClinics(clinics);
    } catch (error) {
      console.error("Error fetching clinics in bounds:", error);
    }
  }

  function displayClinics(clinics) {
    clinics.forEach((clinic) => {
      const marker = new google.maps.Marker({
        position: { lat: clinic.latitude, lng: clinic.longitude },
        map,
        title: clinic.HCI_NAME,
      });

      const clinicName = encodeURIComponent(clinic.HCI_NAME);
      const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${clinicName}`;

      const infowindowContent = `
        <div class="infowindow-content">
          <h3 class="infowindow-title">${clinic.HCI_NAME}</h3>
          <p>Address: ${clinic.BLK_HSE_NO} ${clinic.STREET_NAME}, ${clinic.POSTAL_CD}</p>
          <p>Tel: ${clinic.HCI_TEL}</p>
          <a href="${googleMapsLink}" target="_blank" style="display: block; margin-top: 10px; color: blue;">View on Google Maps</a>
        </div>`;

      const infowindow = new google.maps.InfoWindow({
        content: infowindowContent,
      });

      marker.addListener("click", () => {
        if (currentInfoWindow) {
          currentInfoWindow.close();
        }
        infowindow.open(map, marker);
        currentInfoWindow = infowindow;
      });

      markers.push(marker);
    });
  }

  function clearMarkers() {
    markers.forEach((marker) => marker.setMap(null));
    markers = [];
  }

  function handleGeolocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          console.log(pos);
          map.setCenter(pos);

          new google.maps.Marker({
            position: pos,
            map: map,
            title: "You are here",
            icon: {
              url: "../images/LiveLocation.png", // Replace with the actual URL of your uploaded image
              scaledSize: new google.maps.Size(30, 30), // Adjust the size as needed
            },
          });

          fetchNearestClinics(pos.lat, pos.lng);
        },
        (error) => {
          console.error("Error fetching location: ", error);
          handleLocationError(true, map.getCenter());
        }
      );
    } else {
      handleLocationError(false, map.getCenter());
    }
  }

  function handleLocationError(browserHasGeolocation, pos) {
    const infoWindow = new google.maps.InfoWindow({
      position: pos,
      content: browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation.",
    });
    infoWindow.open(map);
  }

  fetchMapApiKey();
});
