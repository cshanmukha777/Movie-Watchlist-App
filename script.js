const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const moviesContainer = document.getElementById("movies");
const loading = document.getElementById("loading");

const filterInput = document.getElementById("keywordFilter");
const sortSelect = document.getElementById("sortBy");

const API_KEY = "7a53f7e7";

let moviesData = [];
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
searchBtn.addEventListener("click", searchMovies);

searchInput.addEventListener("keypress", function(e) {
if (e.key === "Enter") {
searchMovies();
}
});

filterInput.addEventListener("input", renderMovies);
sortSelect.addEventListener("change", renderMovies);
async function searchMovies() {

const query = searchInput.value.trim();

if (!query) return;

showLoading();

try {

const response = await fetch(
`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
);

const data = await response.json();

hideLoading();

if (data.Response === "False") {
showEmptyState("No movies found");
return;
}

moviesData = data.Search;

renderMovies();

} catch (error) {

hideLoading();
showEmptyState("Something went wrong");

}

}
