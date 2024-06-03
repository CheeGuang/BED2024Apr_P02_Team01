document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const hostRoomURL = urlParams.get("hostRoomURL");
  if (hostRoomURL) {
    document.querySelector("iframe").src = hostRoomURL;
  }
});
