var data = []
$(".search").click(function() {
    $("#result").empty()
    data.length = 0;
    var squery_name = $("#file-name").val()
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
        for (var i = 0; i < response.files_found.length; i++) {
            data.push(response.files_found[i])
        }
        setTimeout(load_data(), 1000);
    });
})

function load_data() {
    $("#result").append(`<p class="result-amount">Total `+ data.length +` amount of data found</p>`)
    for (var i = 0; i < data.length; i++) {
        $("#result").append(`<div class="result_card"><p>File ID : <span>`+data[i].file_id+`</span></p><p>File Name : <span>`+data[i].file_name+`</span></p><p>File Type : <span class="file-type">`+data[i].file_type+`</span></p><p>File Size : <span>`+data[i].file_size+`</span></p><p>File Host : <span>`+data[i].referrer_host+`</span></p><p>File Path : <span>`+data[i].readable_path+`</span></p><p>File Link : </p><div class="file"><input class="file-link" value=`+data[i].file_link+` type="text"/><span file-type="`+data[i].file_type+`" file-link="`+data[i].file_link+`" class="viewfile"><i class="fa-solid fa-eye"></i></span></div><p>Upload Date : <span>`+data[i].date_added+`</span></p><p>Last Update : <span>`+data[i].time_ago+`</span></p></div>`)
    }
}

$(document).on('click', '.viewfile', function() {
    var file_type = $(this).attr("file-type").toLowerCase();
    var file_link = $(this).attr("file-link");
    $("#container").css("display", "block")
    if (file_type === "mp4" || "mkv"||"flv") {
        $("#view_file").html(`<video id="dxy" src="`+file_link+`" height="" width="" preload="none" autoplay controls></video>`)
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
        $(".fa-right").attr("class","fa-solid fa-left")
        $("#container").css({"right":"0px","left":"auto"})
        side = "right"
    } else {
        $(".fa-left").attr("class","fa-solid fa-right")
        $("#container").css({"right":"auto","left":"0px"})
        side = "left"
    }
})

var isFullScreen = false;
$("#fullscreen").click(function() {
    $("#container").css("transform","translate3d (0px,0px,0)")
    if (isFullScreen == false) {
        $("#container").css({"height":"600px","width":"100%"})
        $(".fa-expand").attr("class","fa-solid fa-compress")
        isFullScreen = true;
    } else {
        $("#container").css({"height":"200px","width":"90%"})
        $(".fa-compress").attr("class","fa-solid fa-expand")
        isFullScreen = false;
    }
})

$("#close").click(function(){
    $("#container").css("display","none")
    $("#container").html("")
})