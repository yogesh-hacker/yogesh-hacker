var BASE_URL = "https://api.themoviedb.org/3/movie/";
var API_KEY = "0216c7f0ac7eccd88428ff92bbccd0a1";
var API_URL = BASE_URL + "MOVIE_ID?api_key=" + API_KEY;
var IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";
var mMovieId = 0;
var isValid = true;

$("body").ready(function() {
    var mUrlParams = new URLSearchParams(window.location.search);
    mMovieId = mUrlParams.get("movie_id");
    fetchMovieDetails(mMovieId);
})


function fetchMovieDetails(movieId) {
    var url = API_URL.replace("MOVIE_ID", movieId);
    fetch(url)
    .then(response => response.json())
    .then(data => {
        if (data.success != false) {
            isValid == true;
            $("#movie-title").text(data.title);
            $("#release-year").text(data.release_date.split("-")[0]);
            $("#movie-runtime").text("• "+formatRuntime(data.runtime));
            $("#movie-description").text(data.overview);
            $("#movie-thumbnail").attr("src", IMAGE_BASE_URL+data.backdrop_path)
            $("#movie-poster").attr("src", IMAGE_BASE_URL + data.poster_path);
            $("#movie-popularity").text("Popularity : "+data.popularity)
            $("#original_language").text("Original Language : "+data.original_language.toUpperCase());
            for (var i = 0; i < data.genres.length; i++) {
                $(".genres_container").append(`<span class="movie-genre">`+data.genres[i].name+`<span>`);
            }
        } else {
            isValid = false;
        }
    })
    .catch(error => console.error('Error fetching movie details:', error));
}


$(".nav_menu").click(function() {
    $(".nav_items").css("width", "250px")
    $(".canvas").css("display", "block")
})

$(".canvas").click(function() {
    $(".nav_items").css("width", "0px")
    $(".canvas").css("display", "none")
})

$("#open_in_app").click(function() {
    if (mMovieId != "" && mMovieId != null && mMovieId != "undefined" && isValid == true) {
        window.location.replace("hackflix://movie?movie_id="+mMovieId)
    } else {
        alert("Invalid movie ID");
    }
})


function formatRuntime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}hr ${mins}min`;
}