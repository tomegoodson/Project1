document.addEventListener('DOMContentLoaded', function () {
    // Get references to the main containers of the page
    const loginContainer = document.getElementById('login-container');
    const recipeContainer = document.getElementById('recipe-container');
    const instructionContainer = document.getElementById('instruction-container');

    // Add event listener for the login form submission
    document.getElementById("login-form").addEventListener("submit", function (event) {
        event.preventDefault();  // Prevent the default form submission behavior
    
        // Get the user input from the login form
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
    
        // Check if the username and password match the expected values
        if (username === "Chef" && password === "Password1") {
            // Clear the form fields
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
    
            // Greet the user and update the display of containers
            alert("Welcome back, Chef!");
            loginContainer.style.display = "none";
            recipeContainer.style.display = "block";
            instructionContainer.style.display = "block";
    
            // Set the background image for a successful login
            document.body.style.backgroundImage = "url('background.png')";
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundPosition = "center";
            document.body.style.backgroundRepeat = "no-repeat";
        } else {
            // Clear the password field and notify the user of an incorrect login attempt
            document.getElementById("password").value = "";
            alert("Incorrect username or password. Please try again.");
        }
    });
    
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
            const response = await fetch(apiUrl);
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
    
        // Limit the display to the first 3 recipes
        const limitedRecipes = recipes.slice(0, 3);
    
        limitedRecipes.forEach(recipe => {
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
    } else {
        console.error('Instruction button element not found');
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

    // Function to display analyzed instructions in the UI
    function displayAnalyzedInstructions(instructions, targetElement) {
        targetElement.innerHTML = '';
        instructions.forEach((instructionSet) => {
            instructionSet.steps.forEach((step, index) => {
                const stepElement = document.createElement('div');
                stepElement.classList.add('recipe-step');

                const stepNumber = document.createElement('h3');
                stepNumber.textContent = `Step ${index + 1}:`;

                const stepDescription = document.createElement('p');
                stepDescription.textContent = step.step;

                stepElement.appendChild(stepNumber);
                stepElement.appendChild(stepDescription);

                targetElement.appendChild(stepElement);
            });
        });
    } // Ensure this function is properly closed

    // Set background images for specific containers
    recipeContainer.style.backgroundImage = "url('search.jpg')";
    recipeContainer.style.backgroundSize = "cover";
    recipeContainer.style.backgroundPosition = "center";
    recipeContainer.style.backgroundRepeat = "no-repeat";

    instructionContainer.style.backgroundImage = "url('instructions.jpg')";
    instructionContainer.style.backgroundSize = "cover";
    instructionContainer.style.backgroundPosition = "center";
    instructionContainer.style.backgroundRepeat = "no-repeat";
});
