const BASE_API = "/api/requests/"
const BASE_URL = "https://api.themoviedb.org/3/search/movie";
const IMAGE_PATH = "https://image.tmdb.org/t/p/original";
const API_LAYER_CONNECTION_URL = "https://yogeshkumarjamre.pythonanywhere.com/tmdb/?url=";

var REQUESTS_DB = [];
var isParsed = false;

$(document).ready(function() {
    loadRequests();
})


var page = 1;

function fetchData() {
    var sQuery = $(".form input").val().trim();
    var sUrl = API_LAYER_CONNECTION_URL + encodeURIComponent(BASE_URL + "?query=" + sQuery + "&include_adult=true&page=" + page);

    fetch(sUrl)
    .then(response => response.json())
    .then(data => {
        if (data.success !== false) {
            data.results.forEach(item => {
                var releaseYear = getYearFromDate(item.release_date);
                if (isNaN(releaseYear)) return;

                var idMatched = REQUESTS_DB.some(dbItem => {
                    if (item.id === dbItem.movie_id) {
                        $(".result_items").append(
                            `<div class='movie_item'>
                            <img class='poster' src='${IMAGE_PATH}${item.poster_path}'/>
                            <h2 class='title'>${item.title} (${releaseYear})</h2>
                            <p class='status ${getStatus(dbItem.is_uploaded).toLowerCase()}'>${getStatus(dbItem.is_uploaded)}</p>
                            <p class='divider'></p>
                            </div>`
                        );
                        return true;
                    }
                    return false;
                });

                if (!idMatched) {
                    $(".result_items").append(
                        `<div class='movie_item'>
                        <img class='poster' src='${IMAGE_PATH}${item.poster_path}'/>
                        <h2 class='title'>${item.title} (${releaseYear})</h2>
                        <button class='request' onclick='request(${item.id}, "${item.title}", ${releaseYear})'>Request</button>
                        <p class='divider'></p>
                        </div>`
                    );
                }
            });

            if (!data.results.length) alert("No results found");
            if (page < data.total_pages) {
                $("#viewMore").show();
                page++;
            } else {
                $("#viewMore").hide();
            }
        }
    })
    .catch(error => console.error("Error: ", error));
}

$(".form button").click(function () {
    page = 1;
    $(".result_items").html("");
    fetchData();
});


$("#viewMore").click(function () {
    fetchData();
});

$(document).on('click', '.request', function() {
    $(".loader-container").css("top", "100px")
})

function request(id, title, releaseYear) {
    if (user !== "") {
        var data = {
            username: user,
            movie_id: id,
            movie_title: title,
            release_year: releaseYear,
            device_id: userDeviceId,
        };

        $.ajax({
            url: BASE_API + 'add/',
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(response, textStatus, xhr) {
                handleStatusResponse(xhr.status, response);
            },
            error: function(xhr) {
                const errorResponse = xhr.responseJSON || {
                    message: xhr.statusText || "Unknown error"
                };
                handleStatusResponse(xhr.status, errorResponse);
            }
        });
    } else {
        Swal.fire({
            title: 'Please Wait!',
            text: 'Please wait! the page is loading...',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    }
}

function handleStatusResponse(statusCode, response) {
    $(".loader-container").css("top", "-100px");
    const message = response.message || 'Something happened';
    let alertData = {
        icon: 'info',
        title: `Request Info`,
        text: message,
    };

    if (statusCode >= 200 && statusCode < 300) {
        alertData.icon = 'success';
        alertData.title = 'Success';
    } else if (statusCode >= 400 && statusCode < 500) {
        alertData.icon = 'warning';
        alertData.title = 'Client Error';
    } else if (statusCode >= 500) {
        alertData.icon = 'error';
        alertData.title = 'Server Error';
    }

    Swal.fire(alertData);
}


let dataLoaded = false;
let showRequestsCallback = null;

function loadRequests() {
    REQUESTS_DB.length = 0;
    $(".loader-container").css("top", "100px");
    $(".form button").attr("disabled", "true");

    $.getJSON(BASE_API, function(json) {
        for (var i = 0; i < json.requests.length; i++) {
            REQUESTS_DB.push(json.requests[i]);
        }
        REQUESTS_DB.reverse();
        dataLoaded = true;
        $(".loader-container").css("top", "-100px");
        $(".form button").removeAttr("disabled");
        if (showRequestsCallback) {
            showRequestsCallback();
        }
    });
}

async function showRequests() {
    let serialNumber = 1;
    if (!dataLoaded) {
        showRequestsCallback = showRequests;
        return; 
    }

    for (let i = 0; i < REQUESTS_DB.length; i++) {
        try {
            const title = REQUESTS_DB[i].movie_title
            const isUploaded = REQUESTS_DB[i].is_uploaded;
            let status = getStatus(isUploaded);

            const row = $("<tr><td>" + serialNumber + "</td><td>" + REQUESTS_DB[i].username + "</td><td>" + title + "</td><td>" + formatDate(REQUESTS_DB[i].request_date) + "</td><td class='p-0 " + status.toLowerCase() + "'><span class='p-1 m-1 rounded-1'>" + status + "</span></td></tr>");
            $("#results").append(row);
            serialNumber++;

        }catch (error) {
            console.error("Error: ", error);
        }
    }
}


function getStatus(isUploaded) {
    if (isUploaded === 1) {
        status = "Uploaded";
    } else if (isUploaded === 2) {
        status = "Canceled";
    } else if (isUploaded === 3) {
        status = "Unavailable";
    } else if (isUploaded === 4) {
        status = "Pending";
    } else {
        status = "Unknown";
    }
    return status;
}

function getYearFromDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    return year;
}

function formatDate(dateString) {
    let formattedDate;
    if (dateString.includes(', ')) {
        const [datePart,
            timePart] = dateString.split(', ');
        const [day,
            month,
            year] = datePart.split('/').map(Number);
        const [hours,
            minutes,
            seconds] = timePart.split(':').map(Number);
        const paddedDay = String(day).padStart(2, '0');
        const paddedMonth = String(month).padStart(2, '0');
        formattedDate = `${paddedDay}/${paddedMonth}/${year}`;
    } else {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());
        formattedDate = `${month}/${day}/${year}`;
    }
    return formattedDate;
}

$(".request_movie").click(function() {
    $("#all-requests-page").hide();
    $("#request-page").show();
    $(".canvas").click();
});

$(".all_requests").click(function() {
    $("#all-requests-page").show();
    $("#request-page").hide();
    $(".canvas").click();
    $('#results tr:not(:first)').remove();
    showRequests();
});

$("#all-requests-page").hide();
$("#request-page").show();


$("#viewMore").hide();
$(".nav_menu").click(function() {
    $(".nav_items").css("width", "280px")
    $(".canvas").css("display", "block")
})

$('.reload_btn').click(function() {
    location.reload();
});

$(".canvas").click(function() {
    $(".nav_items").css("width", "0px")
    $(".canvas").css("display", "none")
})