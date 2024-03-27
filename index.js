// DOM element selection
const searchForm = document.querySelector("form"); // Selecting the form element
const searchResultDiv = document.querySelector(".search-result"); // Selecting the search result div
const container = document.querySelector(".container"); // Selecting the container div

// Global variables
let searchQuery = ""; //  empty search query
const APP_ID = '8cc76b7c'; 
const APP_key = '29881c82581417fdb86151397efe14a4'; 
let map; 
let userLocation; 

// Event listener for form submission
searchForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Preventing the default  submission behavior
    searchQuery = e.target.querySelector("input").value; 
    fetchAPI(); 
});

// Asynchronous function to fetch data from API
async function fetchAPI() {
    const baseURL = `https://api.edamam.com/search?q=${searchQuery}&app_id=${APP_ID}&app_key=${APP_key}&from=0&to=20`; // API endpoint URL
    const response = await fetch(baseURL); 
    const data = await response.json(); 
    generateHTML(data.hits); 
    console.log(data); // Logging the API response 
}

// Function to generate HTML content based on API results
function generateHTML(results) {
    container.classList.remove("initial"); // Removing the 'initial' class from the container 
    let generatedHTML = ""; // Starting w/ an empty HTML string
    results.map((result) => {
        generatedHTML += `
            <div class="item">
                <img src="${result.recipe.image}" alt="img">
                <div class="flex-container">
                    <h1 class="title">${result.recipe.label}</h1>
                    <a class="view-btn" target="_blank" href="${result.recipe.url}">View Recipe</a>
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



const storeSearchBtn = document.getElementById('restaurantSearchBtn');

// Only initMap declaration
window.initMap = function() {
    const center = userLocation || { lat: 37.7749, lng: -122.4194 };
    map = new google.maps.Map(document.getElementById("map"), {
        center: center,
        zoom: 12,
    });

    if (userLocation) {
        new google.maps.Marker({
            position: center,
            map: map,
            title: "Your Location",
        });
    }
};

// Function to create a marker on the map for a place
function createMarker(place) {
    new google.maps.Marker({
        position: place.geometry.location, 
        map: map, 
        title: place.name 
    });
}

// Event listener for the storeSearchBtn click event
storeSearchBtn.addEventListener('click', function () {
    const storeName = document.getElementById('storeInput').value.trim(); // Get the trimmed value from the storeInput field
    if (storeName && userLocation) { // Check if storeName and userLocation are both good
        const service = new google.maps.places.PlacesService(map); // Create a PlacesService instance using the map
        service.nearbySearch({
            location: userLocation, 
            radius: 5000, 
            type: ['grocery_or_supermarket'], 
            keyword: storeName 
        }, processSearchResults); 
    } else {
        alert('Please enter a store name and allow geolocation to search nearby stores.'); // Show an alert if storeName or userLocation is falsy
    }
});

// Function to process the search results and display them on the page
function processSearchResults(results, status) {
    const restaurantList = document.getElementById('restaurantList'); // Get the restaurantList element
    restaurantList.innerHTML = ''; // Clear the HTML content of restaurantList
    if (status === google.maps.places.PlacesServiceStatus.OK && results.length) { // Check if the search status is OK and results are not empty
        let bounds = new google.maps.LatLngBounds();
        results.slice(0, 3).forEach(place => { 
            createMarker(place); 
            bounds.extend(place.geometry.location); 
            const storeItem = document.createElement('div'); 
            storeItem.textContent = place.name; 
            restaurantList.appendChild(storeItem); // Append the div to restaurantList
        });
        map.fitBounds(bounds); // Fit the map to the bounds
    } else {
        console.error('PlacesService error:', status); // Log an error if the search status is not OK or results are empty
    }
}


function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            initMap(); // Show the map once user location is fetched
        }, () => {
            console.error('Geolocation failed or denied by the user');
            initMap(); // show the map even if geolocation fails
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
        initMap(); // as above
    }
}

document.addEventListener("DOMContentLoaded", getUserLocation);
