const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const moviesContainer = document.getElementById("movies");
const loading = document.getElementById("loading");
const API_KEY = "7a53f7e7"

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
function displayMovies(movies) {

moviesContainer.innerHTML = movies
.map(movie => `

<div class="movie-card">
<img 
src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450"}" 
alt="${movie.Title}"
/>

<div class="movie-info">
<h3>${movie.Title}</h3>
<p>${movie.Year}</p>
</div>

</div>

`).join("");

}
function showLoading() {
loading.classList.remove("hidden");
moviesContainer.innerHTML = "";
}

function hideLoading() {
loading.classList.add("hidden");
}

function showEmptyState(message) {
moviesContainer.innerHTML = `
<div class="empty">
${message}
</div>
`;
}