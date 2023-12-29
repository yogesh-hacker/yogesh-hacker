var elem = document.getElementById("full-screen")

$("body").click(function () {
    fullscreen();
});


function fullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
}


var isActive = false;
$("#play-button").click(function() {
    if (!isActive) {
        $(this).find("i").css("color", "#30C67E")
        $(this).css("color", "#30C67E")
        isActive = true;
    } else {
        $(this).find("i").css("color", "white")
        $(this).css("color", "white")
        isActive = false;
    }
})

$(".speaker").click(function() {
    $("#pre-voice")[0].play();
    setTimeout(startTimer, 10000);
});

function startTimer() {
    var timer = 0;
    var timerElement = $(".call-status");
    setInterval(function() {
        var minutes = Math.floor(timer / 60);
        var seconds = timer % 60;
        var formattedTime = 
            (minutes < 10 ? '0' : '') + minutes + ':' + 
            (seconds < 10 ? '0' : '') + seconds;
        timerElement.text(formattedTime);
        timer++;
    }, 1000);
}

