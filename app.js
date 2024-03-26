document.addEventListener('DOMContentLoaded', function () {
    // Reference to the main containers of the page
    const recipeContainer = document.getElementById('recipe-container');
    const restaurantContainer = document.getElementById('restaurant-container');
    const searchBtn = document.getElementById('searchBtn');
    const storeSearchBtn = document.getElementById('restaurantSearchBtn');
    const recipeList = document.getElementById('recipeList');
    const storeInput = document.getElementById('storeInput');

    // Style settings
    recipeContainer.style.display = "block";
    restaurantContainer.style.display = 'block';
    recipeContainer.style.backgroundImage = "url('search.jpg')";
    recipeContainer.style.backgroundSize = "cover";
    recipeContainer.style.backgroundPosition = "center";
    recipeContainer.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundImage = "url('background.png')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";

    // Initialize the map
    initMap();

    // Load recipes from local JSON file on search button click
    searchBtn.addEventListener('click', function () {
        loadLocalRecipes();
    });

    // Function to load recipes from the local JSON file
    async function loadLocalRecipes() {
        try {
            const response = await fetch('cookbook-100.json');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            displayRecipes(data, recipeList);
        } catch (error) {
            console.error('Error loading local recipes:', error);
        }
    }

    // Function to display recipes in the UI
    function displayRecipes(recipes, targetElement) {
        targetElement.innerHTML = '';
        recipes.forEach(recipe => {
            const recipeCard = createRecipeCard(recipe);
            targetElement.appendChild(recipeCard);
        });
    }

    // Function to create a card element for each recipe
    function createRecipeCard(recipe) {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');

        const title = document.createElement('h2');
        title.textContent = recipe.name;
        const image = document.createElement('img');
        image.src = recipe.image;
        image.alt = recipe.name;

        recipeCard.appendChild(title);
        recipeCard.appendChild(image);

        if (recipe.instructions) {
            const instructions = document.createElement('p');
            instructions.textContent = recipe.instructions;
            recipeCard.appendChild(instructions);
        }

        return recipeCard;
    }

    // Search nearby stores
    storeSearchBtn.addEventListener('click', function () {
        const storeName = storeInput.value.trim();
        if (storeName && userLocation) {
            const service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
                location: userLocation,
                radius: 5000,
                type: ['grocery_or_supermarket'],
                keyword: storeName
            }, processSearchResults);
        }
    });

    function processSearchResults(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK && results.length) {
            let bounds = new google.maps.LatLngBounds();
            results.slice(0, 3).forEach(place => {
                createMarker(place);
                bounds.extend(place.geometry.location);
            });
            map.fitBounds(bounds);
        } else {
            console.error('PlacesService error:', status);
        }
    }
});

let map;
let userLocation;

function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map = new google.maps.Map(document.getElementById('map'), {
                center: userLocation,
                zoom: 15
            });
        }, () => {
            console.error('Geolocation failed or denied by the user');
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}

function createMarker(place) {
    const marker = new google.maps.Marker({
        position: place.geometry.location,
        map: map,
        title: place.name
    });
    return marker;
}
