$(".nav_menu").click(function() {
    $(".nav_items").css("width", "250px")
    $(".canvas").css("display", "block")
})

$(".canvas").click(function() {
    $(".nav_items").css("width", "0px")
    $(".canvas").css("display", "none")
})

$(".notes").click(function(){
    window.location.replace("https://yogesh-hacker.github.io/yogesh-hacker/Private%20Tuition%20Questions%20&%20Answers/")
})
$(".books").click(function(){
    window.location.replace("https://yogesh-hacker.github.io/yogesh-hacker/semester/3/books")
})
