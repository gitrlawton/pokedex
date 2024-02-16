const MAX_POKEMON = 151;
const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");

let allPokemon = [];

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
.then((response) => response.json())
.then((data) => {
    allPokemon = data.results;
    displayPokemon(allPokemon);
});

// Trying to fetch the data for both pokemon and pokemon species.  
async function fetchPokemonDataBeforeRedirect(id) {
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

        return true;
    }

    catch (error) {
        console.error("Failed to fetch Pokemon data before redirect.");
    }
}

function displayPokemon(pokemon) {
    // Emptying the list wrapper, that way if we reload the page, it's
    // not adding pokemon on top of the existing ones.
    listWrapper.innerHTML = "";

    // Creating the HTML structure for each pokemon.
    pokemon.forEach((pokemon) => {
        const pokemonID = pokemon.url.split("/")[6];
        const listItem = document.createElement("div");

        listItem.className = "list-item";
        listItem.innerHTML = `
            <div class="number-wrap">
                <p class="caption-fonts">#${pokemonID}</p>
            </div>
            <div class="img-wrap">
                <img 
                    src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" 
                    alt="${pokemon.name}" 
                />
            </div>
            <div class="name-wrap">
                <p class="body3-fonts">#${pokemon.name}</p>
            </div>
        `;

        // Click event that takes us to the details of each pokemon
        // when we click on it from the main page.
        listItem.addEventListener("click", async () => {
            const success = await fetchPokemonDataBeforeRedirect(pokemonID);
            
            if (success) {
                window.location.href = `./detail.html?id=${pokemonID}`;
            }
        });

        // Adding all the list items to the list wrapper.
        listWrapper.appendChild(listItem);
    });
}