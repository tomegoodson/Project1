const searchForm = document.querySelector("form");
const searchResultDiv = document.querySelector(".search-result");
const container = document.querySelector(".container");
let searchQuery = "";
const APP_ID = '8cc76b7c';
const APP_key = '29881c82581417fdb86151397efe14a4';	

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  searchQuery = e.target.querySelector("input").value;
  fetchAPI();
});

async function fetchAPI() {
  const baseURL = `https://api.edamam.com/search?q=${searchQuery}&app_id=${APP_ID}&app_key=${APP_key}&from=0&to=20`;
  const response = await fetch(baseURL);
  const data = await response.json();
  generateHTML(data.hits);
  console.log(data);
}

function generateHTML(results) {
  container.classList.remove("initial");
  let generatedHTML = "";
  results.map((result) => {
    generatedHTML += `
      <div class="item">
        <img src="${result.recipe.image}" alt="img">
        <div class="flex-container">
          <h1 class="title">${result.recipe.label}</h1>
          <a class="view-btn" target="_blank" href="${
            result.recipe.url
          }">View Recipe</a>
        </div>
        <p class="item-data">Calories: ${result.recipe.calories.toFixed(2)}</p>
        <p class="item-data">Diet label: ${
          result.recipe.dietLabels.length > 0
            ? result.recipe.dietLabels
            : "No Data Found"
        }</p>
        <p class="item-data">Health labels: ${result.recipe.healthLabels}</p>
      </div>
    `;
  });
  searchResultDiv.innerHTML = generatedHTML;
}

const storeSearchBtn = document.getElementById('restaurantSearchBtn'); // Select the search button

function initMap() {
  // Specify the center of the map (you can adjust these coordinates as needed)
  const center = { lat: 37.7749, lng: -122.4194 };

  // Create a new map instance
  const map = new google.maps.Map(document.getElementById("map"), {
      center: center,
      zoom: 12, // Adjust the initial zoom level as needed
  });

  // Example marker (you can customize this based on your requirements)
  const marker = new google.maps.Marker({
      position: center,
      map: map,
      title: "Center Marker",
  });
}

// Add event listener to the search button
storeSearchBtn.addEventListener('click', function () {
    const storeName = document.getElementById('storeInput').value.trim(); // Get the store name from the input field
    if (storeName && userLocation) {
        const service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
            location: userLocation,
            radius: 5000,
            type: ['grocery_or_supermarket'],
            keyword: storeName
        }, processSearchResults);
    } else {
        alert('Please enter a store name and allow geolocation to search nearby stores.');
    }
});

// Function to process search results and display nearby stores
function processSearchResults(results, status) {
    const restaurantList = document.getElementById('restaurantList');
    restaurantList.innerHTML = ''; // Clear previous results

    if (status === google.maps.places.PlacesServiceStatus.OK && results.length) {
        let bounds = new google.maps.LatLngBounds();
        results.slice(0, 3).forEach(place => {
            createMarker(place);
            bounds.extend(place.geometry.location);

            // Display the store name in the restaurantList div
            const storeItem = document.createElement('div');
            storeItem.textContent = place.name;
            restaurantList.appendChild(storeItem);
        });
        map.fitBounds(bounds);
    } else {
        console.error('PlacesService error:', status);
    }
}

// Define userLocation variable
let userLocation;

// Function to get the user's geolocation
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        }, () => {
            console.error('Geolocation failed or denied by the user');
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}

// Call the function to get the user's geolocation
getUserLocation();
document.addEventListener("DOMContentLoaded", () => {
  initMap();
});
