const BASE_URL = "http://localhost:3000/";
const TRAINERS_URL = `${BASE_URL}trainers/`;
const POKEMONS_URL = `${BASE_URL}pokemons/`;

// API
function get(url) {
	return fetch(url).then(response => response.json());
}

function post(url, data) {
	const config = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify(data),
	};
	return fetch(url, config).then(response => response.json());
}

function patch(url, id, data) {
	const config = {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify(data),
	};
	return fetch(`${url}${id}`, config).then(response => response.json());
}

function destroy(url, id) {
	const config = {
		method: "DELETE",
	};
	return fetch(`${url}${id}`, config).then(response => response.json());
}

const API = { get, post, patch, destroy };

// CONSTANTS
const main = document.querySelector("main");

// FUNCTIONS
function renderAllTrainerCards(e) {
	API.get(TRAINERS_URL).then(trainers => {
		trainers.forEach(trainer => createTrainerCard(trainer));
	});
}

function createTrainerCard(trainer) {
	let card = document.createElement("div");
	card.className = "card";
	card.setAttribute("data-id", trainer.id);

	let trainerName = document.createElement("p");
	trainerName.innerText = trainer.name;

	let addPkmnBttn = document.createElement("button");
	addPkmnBttn.setAttribute("data-trainer-id", trainer.id);
	addPkmnBttn.innerText = "Add Pokemon";
	addPkmnBttn.addEventListener("click", e => handleAddPokemonClick(trainer));

	let pokemonList = document.createElement("ul");

	trainer.pokemons.forEach(pokemon => {
		let listItem = createPokemonLi(pokemon);
		pokemonList.appendChild(listItem);
	});

	card.append(trainerName, addPkmnBttn, pokemonList);
	main.appendChild(card);
}

function createPokemonLi(pokemon) {
	let item = document.createElement("li");
	item.innerText = `${pokemon.nickname} (${pokemon.species})`;

	let removeBtn = document.createElement("button");
	removeBtn.innerText = "Release";
	removeBtn.className = "release";
	removeBtn.setAttribute("data-pokemon-id", pokemon.id);
	removeBtn.addEventListener("click", event => handleRemoveClick(event));
	item.appendChild(removeBtn);
	return item;
}

function handleAddPokemonClick(trainer) {
	let trainerList = document.querySelectorAll(
		`.card[data-id="${trainer.id}"] li`,
	);

	if (trainerList.length < 6) {
		API.post(POKEMONS_URL, {
			trainer_id: trainer.id,
		}).then(response => {
			let list = document.querySelector(`.card[data-id="${trainer.id}"] ul`);
			let item = createPokemonLi(response);
			list.appendChild(item);
		});
	} else {
		alert("No trainer can have more than 6 Pokemons!");
	}
}

function handleRemoveClick(event) {
	API.destroy(POKEMONS_URL, event.target.getAttribute("data-pokemon-id")).then(
		response => {
			document
				.querySelector(`button[data-pokemon-id="${response.id}"]`)
				.parentNode.remove();
		},
	);
}

// EVENT LISTENERS
document.addEventListener("DOMContentLoaded", renderAllTrainerCards);
