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
function renderMovies() {

const keyword = filterInput.value.toLowerCase();
const sortType = sortSelect.value;

let filteredMovies = moviesData
.filter(movie =>
movie.Title.toLowerCase().includes(keyword)
)

.sort((a,b)=>{

if(sortType === "title-asc"){
return a.Title.localeCompare(b.Title)
}

if(sortType === "title-desc"){
return b.Title.localeCompare(a.Title)
}

if(sortType === "year-asc"){
return a.Year - b.Year
}

if(sortType === "year-desc"){
return b.Year - a.Year
}

return 0;

});

displayMovies(filteredMovies);

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

<div class="movie-actions">

<button onclick="addWatchlist('${movie.imdbID}')">
Watchlist
</button>

<button onclick="addFavorite('${movie.imdbID}')">
❤ Favorite
</button>

</div>

</div>

</div>

`).join("");

}
