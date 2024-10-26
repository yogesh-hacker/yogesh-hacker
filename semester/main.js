$(".nav_menu").click(function() {
    $(".nav_items").css("width", "290px");
    $(".canvas").css("display", "block");
});

$(".canvas").click(function() {
    $(".nav_items").css("width", "0px");
    $(".canvas").css("display", "none");
});

$(".item").click(function(){
    var semester = $(this).attr('class').match(/semester-\d+/)[0];
    var semesterNum = semester.split('-')[1];
    if (semesterNum == 1) {
        window.location.href = "https://yogesh-hacker.github.io/yogesh-hacker/semester/demo/1";
    } else if (semesterNum == 2) {
        window.location.href = "https://yogesh-hacker.github.io/yogesh-hacker/semester/demo/2";
    } else if (semesterNum == 5) {
        window.location.href = "https://yogesh-hacker.github.io/yogesh-hacker/semester/5/";
    } else {
        window.location.href = "https://yogesh-hacker.github.io/yogesh-hacker/semester/demo/coming-soon/";
    }
});
