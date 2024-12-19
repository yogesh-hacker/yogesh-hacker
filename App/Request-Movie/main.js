var BASE_URL = "https://api.themoviedb.org/3/search/movie";
var BASE_URL_MOVIE = "https://api.themoviedb.org/3/movie/"
var API_KEY = "0216c7f0ac7eccd88428ff92bbccd0a1";
var IMAGE_PATH = "https://image.tmdb.org/t/p/original";
var REQUESTS_DB = [];
var API_LAYER_CONNECTION_URL = "https://yogeshkumarjamre.pythonanywhere.com/api/?url=";

var SCRIPT_BASE_URL = "https://script.google.com/macros/s/AKfycbwCmFRnUTINVl44POlSnE52NWxqr009WdKRcrTBdldcX_-CqYsOGS5e8dtn9GzQz4YG5w/exec";
var isParsed = false;

$(document).ready(function() {
    loadRequests();
})

$("#all-requests-page").hide();
$("#request-page").show();


$("#viewMore").hide();
$(".nav_menu").click(function() {
    $(".nav_items").css("width", "280px")
    $(".canvas").css("display", "block")
})

$(".canvas").click(function() {
    $(".nav_items").css("width", "0px")
    $(".canvas").css("display", "none")
})
var page = 1;

function fetchData() {
    var uploadStatus = "";
    var status = "";
    var sQuery = $(".form input").val().trim();
    var sUrl = API_LAYER_CONNECTION_URL + BASE_URL + "?api_key=" + API_KEY + "%26query=" + sQuery + "%26include_adult=true%26page=" + page;

    fetch(sUrl)
    .then(response => response.json())
    .then(data => {
        if (data.success !== false) {
            for (var i = 0; i < data.results.length; i++) {
                var idMatched = false;

                for (var j = 0; j < REQUESTS_DB.length; j++) {
                    if (data.results[i].id == REQUESTS_DB[j].movie_id) {
                        var isUploaded = REQUESTS_DB[j].is_uploaded;
                        var statusText = getStatus(REQUESTS_DB[j].is_uploaded);

                        $(".result_items").append("<div class='movie_item'><img class='poster' src='" + IMAGE_PATH + data.results[i].poster_path + "'/>" + "<h2 class='title'>" + data.results[i].title + " ("+getYearFromDate(data.results[i].release_date)+")</h2><p class='status " + statusText.toLowerCase() + "'>" + statusText + "</p><p class='divider'></p></div>");

                        idMatched = true;
                        break;
                    }
                }

                if (!idMatched) {
                    $(".result_items").append(`<div class='movie_item'><img class='poster' src='${IMAGE_PATH}${data.results[i].poster_path}'/><h2 class='title'>${data.results[i].title} (${getYearFromDate(data.results[i].release_date)})</h2><button class='request' onclick='request(${data.results[i].id}, "${data.results[i].title}")'>Request</button><p class='divider'></p></div>`);
                }
            }



            if (data.results.length == 0) {
                alert("No results found");
            }
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


function ctrlq(e) {
    $(".loader-container").css("top",
        "-100px")
    if (e.result === "success") {
        loadRequests();
        customAlertDialog('Request Info', 'Successfully requested for the movie. The movie will be uploaded soon!', [{
            name: 'OK',
            action: () => {}
        }]);

    } else if (e.result === "failed") {
        customAlertDialog('Request Info', 'There is already a pending request for the movie...', [{
            name: 'OK',
            action: () => {}
        }]);
    }
}

function request(id, title) {
    var url = `${SCRIPT_BASE_URL}?callback=ctrlq&serial_no=1&request_id=${user}&movie_id=${id}&movie_title=${title}&is_uploaded=0&device_id=${userDeviceId}&action=insert`;
    if (user != "") {
        var request = jQuery.ajax({
            crossDomain: true,
            url: url,
            method: "GET",
            dataType: "jsonp"
        });
    } else {
        customAlertDialog('Please Wait!',
            'Please wait! the page is loading...',
            [{
                name: 'OK',
                action: () => {}
            }]);
    }
}


let dataLoaded = false;
let showRequestsCallback = null;

function loadRequests() {
    REQUESTS_DB.length = 0;
    $(".loader-container").css("top", "100px");
    $(".form button").attr("disabled", "true");

    $.getJSON(SCRIPT_BASE_URL + "?action=read", function(json) {
        for (var i = 0; i < json.records.length; i++) {
            REQUESTS_DB.push(json.records[i]);
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

async function showRequests() {
    //("#results").empty();
    let serialNumber = 1;
    if (!dataLoaded) {

        showRequestsCallback = showRequests;
        return; // Exit the function
    }

    for (let i = 0; i < REQUESTS_DB.length; i++) {
        try {
            console.log(REQUESTS_DB[i]);
            console.log("Index " + i + ": Movie ID - " + REQUESTS_DB[i].movie_id);
            const title = REQUESTS_DB[i].movie_title
            console.log("Title for request ID " + REQUESTS_DB[i].request_id + ": " + title);
            const isUploaded = REQUESTS_DB[i].is_uploaded;
            let status;

            switch (isUploaded) {
                case 0:
                    status = "Pending";
                    break;
                case 1:
                    status = "Uploaded";
                    break;
                case 2:
                    status = "Canceled";
                    break;
                case 3:
                    status = "Unavailable";
                    break;
                default:
                    status = "Unknown";
                    break;
            }

            const row = $("<tr><td>" + serialNumber + "</td><td>" + REQUESTS_DB[i].request_id + "</td><td>" + title + "</td><td>" + formatDate(REQUESTS_DB[i].request_date) + "</td><td class='p-0 " + status.toLowerCase() + "'><span class='p-1 m-1 rounded-1'>" + status + "</span></td></tr>");
            $("#results").append(row);
            serialNumber++;

        }catch (error) {
            console.error("Error: ", error);
        }
    }
}



function parseTitle(movieId) {
    return fetch(API_LAYER_CONNECTION_URL + BASE_URL_MOVIE + movieId + "?api_key=" + API_KEY)
    .then(response => response.json())
    .then(data => {
        if (data.success !== false) {
            return data.title;
        } else {
            throw new Error("Movie title not found");
        }
    });
}

function customAlertDialog(title, message, buttons) {
    const dialog_canvas = document.createElement('div');
    const dialog = document.createElement('div');
    dialog_canvas.className = 'custom-dialog-canvas'
    dialog.className = 'custom-dialog';
    const dialogTitle = document.createElement('h2');
    dialogTitle.textContent = title;

    const dialogMessage = document.createElement('p');
    dialogMessage.textContent = message;
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    buttons.forEach(button => {
        const buttonElement = document.createElement('button');
        buttonElement.textContent = button.name;
        buttonElement.addEventListener('click', () => {
            button.action();
            dialog_canvas.remove();
        });
        buttonContainer.appendChild(buttonElement);
    });

    dialog_canvas.appendChild(dialog)
    dialog.appendChild(dialogTitle);
    dialog.appendChild(dialogMessage);
    dialog.appendChild(buttonContainer);
    document.body.appendChild(dialog_canvas);
}

function getStatus(isUploaded) {
    if (isUploaded === 0) {
        status = "Pending";
    } else if (isUploaded === 1) {
        status = "Uploaded";
    } else if (isUploaded === 2) {
        status = "Canceled";
    } else if (isUploaded === 3) {
        status = "Unavailable";
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
