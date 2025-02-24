$(".nav_menu").click(function() {
    $(".nav_items").css("width", "290px")
    $(".canvas").css("display", "block")
})

$(".canvas").click(function() {
    $(".nav_items").css("width", "0px")
    $(".canvas").css("display", "none")
})

$(".books").click(function(){
    window.location.href = "https://yogesh-hacker.github.io/yogesh-hacker/semester/6/books/";
})

$(".notes").click(function(){
    window.location.href = "https://yogesh-hacker.github.io/yogesh-hacker/semester/6/notes/";
})

$(".syllabus").click(function(){
    window.location.href = "https://yogesh-hacker.github.io/yogesh-hacker/semester/6/syllabus/";
})

$(".past-papers").click(function(){
    window.location.href = "https://yogesh-hacker.github.io/yogesh-hacker/semester/6/past-papers/";
})
