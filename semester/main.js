$(".nav_menu").click(function() {
    $(".nav_items").css("width", "290px");
    $(".canvas").css("display", "block");
})

$(".canvas").click(function() {
    $(".nav_items").css("width", "0px");
    $(".canvas").css("display", "none");
})

$(".item").click(function(){
    var semester = $(this).attr('class').match(/semester-\d+/)[0]
    var semesterNum = semester.split('-')[1];
    window.location.href = "https://yogesh-hacker.github.io/yogesh-hacker/semester/demo/" + semesterNum;
});
