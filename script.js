const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const moviesContainer = document.getElementById("movies");
const loading = document.getElementById("loading");

const filterInput = document.getElementById("keywordFilter");
const sortSelect = document.getElementById("sortBy");

const resultCount = document.getElementById("resultCount");
const watchlistContainer = document.getElementById("watchlist");
const watchlistCount = document.getElementById("watchlistCount");

const themeToggle = document.getElementById("themeToggle");

const API_KEY = "7a53f7e7";

let moviesData = [];
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// SEARCH
searchForm.addEventListener("submit", function(e){
e.preventDefault();
searchMovies();
});

filterInput.addEventListener("input", renderMovies);
sortSelect.addEventListener("change", renderMovies);

// DARK MODE FIX
const savedTheme = localStorage.getItem("theme");

if(savedTheme === "dark"){
document.documentElement.setAttribute("data-theme","dark");
themeToggle.textContent = "☀ Light Mode";
}

themeToggle.addEventListener("click", () => {

const currentTheme = document.documentElement.getAttribute("data-theme");

if(currentTheme === "dark"){
document.documentElement.removeAttribute("data-theme");
localStorage.setItem("theme","light");
themeToggle.textContent = "🌙 Dark Mode";
}else{
document.documentElement.setAttribute("data-theme","dark");
localStorage.setItem("theme","dark");
themeToggle.textContent = "☀ Light Mode";
}

});

// SEARCH MOVIES
async function searchMovies(){

const query = searchInput.value.trim();
if(!query) return;

showLoading();

try{

const response = await fetch(
`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
);

const data = await response.json();

hideLoading();

if(data.Response === "False"){
showEmptyState("No movies found");
return;
}

moviesData = data.Search;
renderMovies();

}catch(error){
hideLoading();
showEmptyState("Something went wrong");
}

}

// RENDER MOVIES
function renderMovies(){

const keyword = filterInput.value.toLowerCase();
const sortType = sortSelect.value;

let filteredMovies = moviesData
.filter(movie =>
movie.Title.toLowerCase().includes(keyword)
)

.sort((a,b)=>{

if(sortType === "title-asc") return a.Title.localeCompare(b.Title);
if(sortType === "title-desc") return b.Title.localeCompare(a.Title);
if(sortType === "year-asc") return parseInt(a.Year) - parseInt(b.Year);
if(sortType === "year-desc") return parseInt(b.Year) - parseInt(a.Year);

return 0;

});

resultCount.textContent = filteredMovies.length + " results";
displayMovies(filteredMovies);

}

// DISPLAY MOVIES
function displayMovies(movies){

moviesContainer.innerHTML = movies.map(movie => {

const isFavorite = favorites.some(f => f.imdbID === movie.imdbID);

return `

<div class="movie-card">

<img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450"}">

<div class="movie-info">
<h3>${movie.Title}</h3>
<p>${movie.Year}</p>

<button onclick="addWatchlist('${movie.imdbID}')">
Add to Watchlist
</button>

<button onclick="toggleFavorite('${movie.imdbID}')">
${isFavorite ? "❤️ Favorited" : "🤍 Favorite"}
</button>

</div>

</div>

`;

}).join("");

}

// WATCHLIST
function addWatchlist(id){

const movie = moviesData.find(m => m.imdbID === id);

if(!watchlist.some(m => m.imdbID === id)){
watchlist.push(movie);
localStorage.setItem("watchlist", JSON.stringify(watchlist));
renderWatchlist();
}

}

// REMOVE WATCHLIST
function removeWatchlist(id){

watchlist = watchlist.filter(m => m.imdbID !== id);
localStorage.setItem("watchlist", JSON.stringify(watchlist));
renderWatchlist();

}

// FAVORITE TOGGLE
function toggleFavorite(id){

const movie = moviesData.find(m => m.imdbID === id);

if(favorites.some(m => m.imdbID === id)){
favorites = favorites.filter(m => m.imdbID !== id);
}else{
favorites.push(movie);
}

localStorage.setItem("favorites", JSON.stringify(favorites));
renderMovies();

}

// RENDER WATCHLIST
function renderWatchlist(){

watchlistContainer.innerHTML = watchlist.map(movie => `

<div class="movie-card">

<img src="${movie.Poster}">

<div class="movie-info">
<h3>${movie.Title}</h3>
<p>${movie.Year}</p>

<button onclick="removeWatchlist('${movie.imdbID}')">
Remove
</button>

</div>

</div>

`).join("");

watchlistCount.textContent = watchlist.length + " saved";

}

// LOADING
function showLoading(){
loading.classList.remove("hidden");
moviesContainer.innerHTML = "";
}

function hideLoading(){
loading.classList.add("hidden");
}

function showEmptyState(message){
moviesContainer.innerHTML = `<div class="empty">${message}</div>`;
}

renderWatchlist();
