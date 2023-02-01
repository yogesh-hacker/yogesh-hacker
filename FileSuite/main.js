var data = []
var __amount__ = 0;
var __query__ = "";
var isAdvancedSearch;
var isNormalSearch;
$(".search").click(function() {
    $("#result").empty()
    $(".search").html("<span class='loader'></span>")
    data.length = 0;
    var squery_name = $("#file-name").val()
    __query__ = squery_name;
    var squery_type = $("#file-type").val()
    var squery_sort = $("#sort-by").val()
    var url = `https://filepursuit.p.rapidapi.com/?q=`+squery_name.toLowerCase()+`&type=`+squery_type+`&sort=`+squery_sort;
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": "GET",
        "headers": {
            "X-RapidAPI-Key": "d75d999194msh3d44beadad8616cp163090jsn5cb53ae5e285",
            "X-RapidAPI-Host": "filepursuit.p.rapidapi.com"
        }
    };

    $.ajax(settings).done(function (response) {
        if (response.status === "not_found") {
            $("#result").html(`<p style="color: red;" class="result-amount">No data found!</p>`)
            $(".search").html("Search")
        } if (response.status != "not_found") {
            for (var i = 0; i < response.files_found.length; i++) {
                data.push(response.files_found[i])
            }
            load_data()
        }
    });
})

var counter = 0;
function deep_search() {
    var squery_name = $("#file-name").val()
    counter++
    $.ajax({
        url: "https://archive.org/advancedsearch.php?q="+squery_name+"&fl%5B%5D=identifier&fl%5B%5D=item_size&fl%5B%5D=mediatype&fl%5B%5D=publicdate&fl%5B%5D=title&sort%5B%5D=&sort%5B%5D=&sort%5B%5D=&rows=1&page="+counter+"&output=json&save=yes",
        type: 'GET',
        success: function(res) {
            var callback = JSON.parse(JSON.stringify(res))
            $("#deep_search").append(`<div class="result_card"><p>Media Title : <span>`+callback.response.docs[0].title+`</span</p><p>Media Identifier : <span>`+callback.response.docs[0].identifier+`</span></p><p>Media Size : <span class="file-type">`+niceBytes(callback.response.docs[0].item_size)+`</span></p><p>Media Type : <span class="file-type">`+callback.response.docs[0].mediatype+`</span></p><p>Media Public Date : <span>`+callback.response.docs[0].publicdate+`</span></p><p>Media Link : <span><a class="media-link" href="https://archive.org/download/`+callback.response.docs[0].identifier+`">https://archive.org/download/`+callback.response.docs[0].identifier+`</a></span></p></div>`)
        }
    });
}


function load_data() {
    if (isNormalSearch == true) {
        $(".search").html("Search")
        $("#result").append(`<p class="result-amount">Total `+ data.length +` amount of data found</p>`)
        for (var i = 0; i < data.length; i++) {
            $("#result").append(`<div class="result_card"><p>File ID : <span>`+data[i].file_id+`</span></p><p>File Name : <span>`+data[i].file_name+`</span></p><p>File Type : <span class="file-type">`+data[i].file_type+`</span></p><p>File Size : <span>`+data[i].file_size+`</span></p><p>File Host : <span>`+data[i].referrer_host+`</span></p><p>File Path : <span>`+data[i].readable_path+`</span></p><p>File Link : </p><div class="file"><input class="file-link" value=`+data[i].file_link+` type="text" readonly/><span file-type="`+data[i].file_type+`" file-link="`+data[i].file_link+`" class="viewfile"><i class="fa-solid fa-eye"></i></span></div><p>Upload Date : <span>`+data[i].date_added+`</span></p><p>Last Update : <span>`+data[i].time_ago+`</span></p></div>`)
        }
    }
    if (isNormalSearch == false) {
        $(".search").html("Search")
        $("#result").html("<p class='res_info'>Please enable normal search from settings!</p>")
    }
    vaildate()
    if (isAdvancedSearch == true) {
        var ds_amount = 0
        $.ajax({
            url: "https://archive.org/advancedsearch.php?q="+__query__+"&fl%5B%5D=identifier&fl%5B%5D=item_size&fl%5B%5D=mediatype&fl%5B%5D=publicdate&fl%5B%5D=title&sort%5B%5D=&sort%5B%5D=&sort%5B%5D=&rows=1&page=1&output=json&save=yes",
            type: "GET",
            success: function(res) {
                var callback = JSON.parse(JSON.stringify(res))
                ds_amount = callback.response.numFound
                __amount__ = callback.response.numFound
            }
        })
        $("#deep_search").html("")
        $("#deep_search").append("<p class='ds_loader'>Deep Searching...</p>")
        setTimeout(function() {
            setIntervalX(function() {
                deep_search()
            }, 1000, ds_amount);
        }, 5000);
    }
    if (isAdvancedSearch == false) {
        $("#deep_search").html("<p class='res_info'>Please enable deep search from settings!</p>")
    }
}

function vaildate() {
    $(".file-link").each(function() {
        if ($(this).val().split(":")[0] === "http") {
            $(this).css("color", "red")
        }
    })
}


$(document).on('click', '.viewfile', function() {
    var file_type = $(this).attr("file-type").toLowerCase();
    var file_link = $(this).attr("file-link");
    $("#container").css("display", "block")
    if (file_type === "mp4" || "mkv" || "flv") {
        $("#view_file").html(`<video id="my_video" src="`+file_link+`" height="" width="" preload="none" autoplay controls></video>`)
    }
})

var dragItem = document.querySelector("#drag");
var container = document.querySelector("body");

var active = false;
var currentX;
var currentY;
var initialX;
var initialY;
var xOffset = 0;
var yOffset = 0;

container.addEventListener("touchstart", dragStart, false);
container.addEventListener("touchend", dragEnd, false);
container.addEventListener("touchmove", drag, false);

container.addEventListener("mousedown", dragStart, false);
container.addEventListener("mouseup", dragEnd, false);
container.addEventListener("mousemove", drag, false);

function dragStart(e) {
    if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
    } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    }

    if (e.target === dragItem) {
        active = true;
    }
}

function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;

    active = false;
}

function drag(e) {
    if (active) {

        e.preventDefault();

        if (e.type === "touchmove") {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, dragItem);
    }
}

function setTranslate(xPos, yPos) {
    if (yPos >= 0 && yPos <= 600) {
        $("#container").css("transform", "translate3d(0px, " + yPos + "px, 0")
    }
}

var side = "left"
$("#change_side").click(function() {
    if (side === "left") {
        $(".fa-right").attr("class", "fa-solid fa-left")
        $("#container").css({
            "right": "0px", "left": "auto"
        })
        side = "right"
    } else {
        $(".fa-left").attr("class", "fa-solid fa-right")
        $("#container").css({
            "right": "auto", "left": "0px"
        })
        side = "left"
    }
})

var isFullScreen = false;
$("#fullscreen").click(function() {
    $("#container").css("transform", "translate3d (0px,0px,0)")
    if (isFullScreen == false) {
        $("#container").css({
            "height": "600px", "width": "100%"
        })
        $(".fa-expand").attr("class", "fa-solid fa-compress")
        isFullScreen = true;
    } else {
        $("#container").css({
            "height": "200px", "width": "90%"
        })
        $(".fa-compress").attr("class", "fa-solid fa-expand")
        isFullScreen = false;
    }
})

$("#close").click(function() {
    $("#container").css("display", "none")
    $("#my_video").attr("src", "#")
})



/*-------- Interval For Specific --------*/

function setIntervalX(callback, delay, repetitions) {
    var x = 0;
    var intervalID = window.setInterval(function () {
        callback();
        if (++x === repetitions) {
            window.clearInterval(intervalID);
            $(".ds_loader").text("Deep search results")
        }
    },
        delay);
}


/*-------- Settings --------*/


$(".hidden_canvas").click(function() {
    $(".sett-container,.hidden_canvas").css("display", "none")
    $(".fa-gear").css("animation-name", "rotate")
    setTimeout(function() {
        $(".fa-gear").css("animation-name", "none")
    }, 500);
})

$(".settings").click(function() {
    $(".fa-gear").css("animation-name", "rotate")
    setTimeout(function() {
        $(".fa-gear").css("animation-name", "none")
        $(".sett-container,.hidden_canvas").css("display", "flex")
    }, 500);
})


$(document).ready(function() {
    isAdvancedSearch = true;
    isNormalSearch = true;
})

$("#search-type").change(function() {
    var type = $(this).val()
    if (type === "default") {
        isAdvancedSearch = true;
        isNormalSearch = true;
    }
    if (type === "1") {
        isAdvancedSearch = false;
        isNormalSearch = true;
    }
    if (type === "2") {
        isAdvancedSearch = true;
        isNormalSearch = false;
    }
    if (type === "3") {
        isAdvancedSearch = true;
        isNormalSearch = true;
    }
})


const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

function niceBytes(x) {
    let l = 0, n = parseInt(x,
        10) || 0;
    while (n >= 1024 && ++l) {
        n = n/1024;
    }
    return(n.toFixed(n < 10 && l > 0 ? 1: 0) + ' ' + units[l]);
}