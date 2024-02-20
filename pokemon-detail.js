let currentPokemonId = null;

document.addEventListener("DOMContentLoaded", () => {
    const MAX_POKEMON = 151;
    const pokemonID = new URLSearchParams(window.location.search).get("id");
    // Turn the string held in const pokemonID to an int.
    const id = parseInt(pokemonID, 10);

    // Return to main page if id is not a valid number.
    if (id < 1 || id > MAX_POKEMON) {
        return (window.location.href = "./index.html");
    }

    currentPokemonId = id;
    loadPokemon(id);
});

async function loadPokemon(id) {
    try {
        const [pokemon, pokemonSpecies] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then((response) => 
                response.json()
            ),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
            .then((response) => 
                response.json()
            ),
        ]);

        const abilitiesWrapper = document.querySelector(".pokemon-detail-wrap .pokemon-detail.move");
        // Clear the previous pokemon's abilities if we are on one.
        abilitiesWrapper.innerHTML = "";

        if (currentPokemonId === id) {
            displayPokemonDetails(pokemon);

            const flavorText = getEnglishFlavorText(pokemonSpecies);
            document.querySelector(".body3-fonts.pokemon-description").textContent = flavorText;
        
            const [leftArrow, rightArrow] = ["#leftArrow", "#rightArrow"].map(
                (selection) => document.querySelector(selection)
            );

            leftArrow.removeEventListener("click", navigatePokemon);
            rightArrow.removeEventListener("click", navigatePokemon);
            
            // Left arrow goes to the next pokemon, to the left.
            if  (id !== 1) {
                leftArrow.addEventListener("click", () => {
                    navigatePokemon(id - 1);
                });
            }

            // Right arrow goes to the next pokemon, to the right.
            if (id !== 151) {
                rightArrow.addEventListener("click", () => {
                    navigatePokemon(id + 1);
                });
            }

            // Single-page application implementation, to allow new
            // details to replace previous details.
            window.history.pushState({}, "", `./detail.html?id=${id}`);
        }
        
        return true;
    }
    catch (error) {
        console.error("An error occurred while fetching Pokemon data: ", error);
        return false;
    }
}

async function navigatePokemon(id) {
    currentPokemonId = id;
    await loadPokemon(id);
}

// Defines the color for the background of the details page
// depending on the pokemon's type.
const typeColors = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
};