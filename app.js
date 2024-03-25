
document.addEventListener('DOMContentLoaded', function () {
    // Reference to the main containers of the page
    const recipeContainer = document.getElementById('recipe-container');
    const instructionContainer = document.getElementById('instruction-container');
    const restaurantContainer = document.getElementById('restaurant-container');

    // Directly display these containers without login
    recipeContainer.style.display = "block";
    restaurantContainer.style.display = 'block';

    // Set the background image for the containers
    recipeContainer.style.backgroundImage = "url('search.jpg')";
    recipeContainer.style.backgroundSize = "cover";
    recipeContainer.style.backgroundPosition = "center";
    recipeContainer.style.backgroundRepeat = "no-repeat";

    // Set the background image for the page
    document.body.style.backgroundImage = "url('background.png')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";

    // The rest of your JavaScript logic for map initialization, recipe search, etc.
    // ...
});

 
let map;
let center;

async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    center = { lat: 37.4161493, lng: -122.0812166 };
    map = new Map(document.getElementById("map"), {
        center: center,
        zoom: 14,
    });

    document.getElementById("restaurantSearchBtn").addEventListener("click", findPlaces);
}


async function findPlaces() {
    const { Place } = await google.maps.importLibrary("places");
    //@ts-ignore
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const searchInput = document.getElementById("restaurantSearchInput");
    const query = searchInput.value.trim() || "Restaurant";

    const request = {
        textQuery: query,
        fields: ["displayName", "location", "businessStatus"],
        includedType: "restaurant",
        isOpenNow: true,
        language: "en-US",
        maxResultCount: 7,
        minRating: 3.2,
        region: "us",
        useStrictTypeFiltering: false,
    };
    //@ts-ignore
    const { places } = await Place.searchByText(request);

    if (places.length) {
        console.log(places);

        const { LatLngBounds } = await google.maps.importLibrary("core");
        const bounds = new LatLngBounds();

        places.forEach((place) => {
            const markerView = new AdvancedMarkerElement({
                map,
                position: place.location,
                title: place.displayName,
            });

            bounds.extend(place.location);
            console.log(place);
        });
        map.setCenter(bounds.getCenter());
    } else {
        console.log("No results");
    }
}

    // Spoonacular API key and endpoint configuration
    const apiKey = 'a156522ddcb24504a5ca124328c177c8';
    const recipeApiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=`;

    // Setup for the recipe search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const recipeList = document.getElementById('recipeList');

    // Event listener for the recipe search button click
    searchBtn.addEventListener('click', function () {
        const searchTerm = searchInput.value.trim();
        const includedIngredients = 'tomato,cheese'; // Example of included ingredients
        if (searchTerm !== '') {
            // Construct the fetch URL with the search term and included ingredients
            const fetchUrl = `${recipeApiUrl}${searchTerm}&includeIngredients=${includedIngredients}`;
            fetchRecipes(fetchUrl, recipeList);
        }
    });

// Function to fetch recipes based on the search term
async function fetchRecipes(apiUrl, targetElement) {
    try {
        const urlWithDetails = `${apiUrl}&addRecipeInformation=true`;
        const response = await fetch(urlWithDetails);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        displayRecipes(data.results, targetElement);
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
}
// Function to display recipes in the UI
function displayRecipes(recipes, targetElement) {
    targetElement.innerHTML = ''; // Clear existing content

    // Display each recipe
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
    title.textContent = recipe.title;

    const image = document.createElement('img');
    image.src = recipe.image;
    image.alt = recipe.title;

    recipeCard.appendChild(title);
    recipeCard.appendChild(image);

    // Check if detailed instructions are available and append them
    if (recipe.instructions) {
        const instructions = document.createElement('p');
        instructions.textContent = recipe.instructions;
        recipeCard.appendChild(instructions);
    }

    return recipeCard;
}

    // Setup for fetching analyzed instructions for a recipe
    const instructionBtn = document.getElementById('instructionBtn');
    if (instructionBtn) {
        instructionBtn.addEventListener('click', function () {
            const instructionInput = document.getElementById('instructionInput');
            if (instructionInput) {
                const recipeId = instructionInput.value.trim();
                if (recipeId !== '') {
                    fetchAnalyzedInstructions(recipeId);
                }
            } else {
                console.error('Instruction input element not found');
            }
        });

    }

    // Function to fetch and display analyzed instructions for a given recipe ID
    async function fetchAnalyzedInstructions(recipeId) {
        const apiUrl = `https://api.spoonacular.com/recipes/${recipeId}/analyzedInstructions?apiKey=${apiKey}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            displayAnalyzedInstructions(data, document.getElementById('instructionList'));
        } catch (error) {
            console.error('Error fetching analyzed instructions:', error);
        }
    }

    
     // Ensure this function is properly closed

    function initMap() {
        // Create the map centered on the user's location
        const map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 15
        });
    
        // Use the Places Library to search for nearby restaurants
        const service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
            location: map.getCenter(),
            radius: 1000, // Search within a 1km radius
            type: ['restaurant']
        }, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                console.log(results); // Process the results
            }
        });
    }
    
