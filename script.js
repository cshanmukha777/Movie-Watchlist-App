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