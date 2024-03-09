$(".nav_menu").click(function() {
    $(".nav_items").css("width", "290px")
    $(".canvas").css("display", "block")
})

$(".canvas").click(function() {
    $(".nav_items").css("width", "0px")
    $(".canvas").css("display", "none")
})

$(".cc-8").click(function() {
    window.location.href = "https://yogesh-hacker.github.io/yogesh-hacker/semester/4/notes/papers/8/";
})

$(".cc-9").click(function() {
    window.location.href = "https://yogesh-hacker.github.io/yogesh-hacker/semester/4/notes/papers/9/";
})

$(".cc-10").click(function() {
    window.location.href = "https://yogesh-hacker.github.io/yogesh-hacker/semester/4/notes/papers/10/";
})

$(".sec-2").click(function() {
    window.location.href = "https://yogesh-hacker.github.io/yogesh-hacker/semester/4/notes/papers/2/";
})

$(document).ready(function() {
    if (data.length != 0) {
        for (var i = 0; i < data.length; i++) {
            $(".books-container").append(`<div class="item">
                <img src="`+data[i].item_cover+`" alt="" />
                <p>`+data[i].item_title+`</p>
                <a class="viewOrDownload" href="`+data[i].item_source+`">View or Download</a>
                </div>`)
        }
    } else {
        $(".books-container").append("<p class='data-error'>No books available, Check Back Later!</p>")
    }
})