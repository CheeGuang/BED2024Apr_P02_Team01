const APIKEY = process.env.googleAPIKey;
let previousPath;
window.handleCredentialResponse = (response) => {
  // Lottie animation
  let animatedOverlay = document.getElementById("lottieAnimationAppearance");
  animatedOverlay.style.display = "block";

  // decodeJwtResponse() is a custom function to decode the encrypted response
  const responsePayload = decodeJwtResponse(response.credential);

  // Storing New Google Account Information
  let customerId = responsePayload.sub;
  let customerEmail = responsePayload.email;
  let customerFirstName = responsePayload.given_name;
  let customerLastName = responsePayload.family_name;
  let customerImageURL = responsePayload.picture;

  //prettier-ignore
  let customerJSON = {
    "customerId": customerId,
    "email": customerEmail,
    "firstName": customerFirstName,
    "lastName": customerLastName,
    "imageUrl": customerImageURL,
  };

  let customerJSONString = JSON.stringify(customerJSON);
  localStorage.setItem("customerData", customerJSONString);

  if (getCustomersData()) {
    console.log("Entered post request");
    // Storing Information as a JSON
    let jsondata = {
      customerId: customerId,
      email: customerEmail,
      firstName: customerFirstName,
      lastName: customerLastName,
      imageUrl: customerImageURL,
    };

    console.log(jsondata);
    // Create AJAX settings
    // prettier-ignore
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://velocity-554e.restdb.io/rest/customer",
        "method": "POST",
        "headers": {
          "content-type": "application/json",
          "x-apikey": APIKEY,
          "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(jsondata)
      }

    $.ajax(settings).done(function (response) {
      // This will run after 2 seconds
      getCustomersData();
      animatedOverlay.style.display = "none";
      console.log(response);
      // redirect user back to where he came from
      window.location.href = previousPath;
    });
  } else {
    // Using the sleep function
    sleep(2000).then(() => {
      // This will run after 2 seconds
      animatedOverlay.style.display = "none";
      // redirect user back to where he came from
      window.location.href = previousPath;
    });
  }
};

function decodeJwtResponse(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

function getCustomersData() {
  //[STEP 7]: Create our AJAX settings
  let settings = {
    async: false,
    crossDomain: true,
    url: "https://velocity-554e.restdb.io/rest/customer",
    method: "GET", // use GET to retrieve info
    headers: {
      "content-type": "application/json",
      "x-apikey": APIKEY,
      "cache-control": "no-cache",
    },
  };

  let customerDataJSONString = localStorage.getItem("customerData");
  let customerDataJSON = JSON.parse(customerDataJSONString);
  //[STEP 8]: Make our AJAX calls
  //Once we get the response, we modify our table content by creating the content internally. We run a loop to continously add on data
  //RESTDb/NoSql always adds in a unique id for each data, we tap on it to have our data and place it into our links
  let isNew = true;
  var responseIsNew = "";

  $.ajax(settings).done(function (response) {
    localStorage.setItem("customersData", JSON.stringify(response));
    for (var i = 0; i < response.length; i++) {
      if (customerDataJSON["customerId"] == response[i]["customerId"]) {
        // Assign retrieved customer data to customerData in localStorage
        for (const key in response[i]) {
          if (response[i].hasOwnProperty(key)) {
            // Check to avoid inherited properties
            customerDataJSON[key] = response[i][key];
          }
        }
        localStorage.setItem("customerData", JSON.stringify(customerDataJSON));
        // return customer is Not New
        isNew = false;
        responseIsNew = isNew;
      }
    }
    console.log(response);
    responseIsNew = isNew;
  });

  console.log(responseIsNew);
  return responseIsNew;
}

// Retrieve Previous Path
// Call the retrieve ProductDetails function when the productDetails.html loads
window.onload = retrieveProductDetails;

function getQueryParam(previousPath) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(previousPath);
}

function retrieveProductDetails() {
  // Get the encoded URI parameters
  const encodedProductName = getQueryParam("previousPath");

  // Decode the URI parameters
  previousPath = decodeURIComponent(encodedProductName);
}
