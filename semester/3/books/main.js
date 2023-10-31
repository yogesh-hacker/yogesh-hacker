$(".nav_menu").click(function() {
    $(".nav_items").css("width", "250px")
    $(".canvas").css("display", "block")
})

$(".canvas").click(function() {
    $(".nav_items").css("width", "0px")
    $(".canvas").css("display", "none")
})

$(document).ready(function() {
    for (var i = 0; i < data.length; i++) {
        $(".items-container").append(`<div class="item">
            <img src="`+data[i].cover_image+`" alt="" />
            <p>`+data[i].book_title+`</p>
            <a class="viewOrDownload" href="`+data[i].source+`">View or Download</a>
            </div>`)
    }
})