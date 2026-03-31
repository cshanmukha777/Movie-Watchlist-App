const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const moviesContainer = document.getElementById("movies");
const loading = document.getElementById("loading");


searchBtn.addEventListener("click", searchMovies);

searchInput.addEventListener("keypress", function(e) {
if (e.key === "Enter") {
searchMovies();
}
});
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

displayMovies(data.Search);

} catch (error) {

hideLoading();
showEmptyState("Something went wrong");

}

}