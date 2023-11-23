$(".nav_menu").click(function() {
    $(".nav_items").css("width", "250px")
    $(".canvas").css("display", "block")
})

$(".canvas").click(function() {
    $(".nav_items").css("width", "0px")
    $(".canvas").css("display", "none")
})

$(".notes").click(function(){
    window.location.href = "https://yogesh-hacker.github.io/yogesh-hacker/semester/3/notes/";
})
$(".books").click(function(){
    window.location.href = "https://yogesh-hacker.github.io/yogesh-hacker/semester/3/books/";
})
