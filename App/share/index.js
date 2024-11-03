// API Constants
const BASE_URL = "https://api.themoviedb.org/3/movie/";
const API_KEY = "0216c7f0ac7eccd88428ff92bbccd0a1";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

// Variables
let mMovieId = 0;
let isValid = true;

// Function to initialize page with movie details
$(document).ready(() => {
    const urlParams = new URLSearchParams(window.location.search);
    mMovieId = urlParams.get("movie_id");
    
    if (mMovieId) {
        fetchMovieDetails(mMovieId);
    } else {
        alert("Movie ID is missing in the URL.");
    }
});

// Fetch movie details from the API
function fetchMovieDetails(movieId) {
    const url = `${BASE_URL}${movieId}?api_key=${API_KEY}`;

    fetch(`https://yogeshkumarjamre.pythonanywhere.com/api/?url=${url}`)
        .then(response => response.json())
        .then(data => {
            if (data.success !== false) {
                isValid = true;
                displayMovieDetails(data);
            } else {
                isValid = false;
                alert("Invalid movie data received.");
            }
        })
        .catch(error => console.error("Error fetching movie details:", error));
}

// Display movie details on the page
function displayMovieDetails(data) {
    $("#movie-title").text(data.title);
    $("#release-year").text(data.release_date.split("-")[0]);
    $("#movie-runtime").text(`• ${formatRuntime(data.runtime)}`);
    $("#movie-description").text(data.overview);
    $("#movie-thumbnail").attr("src", `${IMAGE_BASE_URL}${data.backdrop_path}`);
    $("#movie-poster").attr("src", `${IMAGE_BASE_URL}${data.poster_path}`);
    $("#movie-popularity").text(`Popularity: ${data.popularity}`);
    $("#original_language").text(`Original Language: ${data.original_language.toUpperCase()}`);

    // Display genres
    const genresContainer = $(".genres_container").empty();
    data.genres.forEach(genre => {
        genresContainer.append(`<span class="movie-genre">${genre.name}</span>`);
    });
}

// Format runtime from minutes to "Xhr Ymin"
function formatRuntime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}hr ${mins}min`;
}

// Open movie in the app
$("#open_in_app").click(() => {
    if (mMovieId && isValid) {
        window.location.replace(`hackflix://movie?movie_id=${mMovieId}`);
    } else {
        alert("Invalid movie ID.");
    }
});

// Navigation menu controls
$(".nav_menu").click(() => {
    $(".nav_items").css("width", "290px");
    $(".canvas").show();
});

$(".canvas").click(() => {
    $(".nav_items").css("width", "0");
    $(".canvas").hide();
});
