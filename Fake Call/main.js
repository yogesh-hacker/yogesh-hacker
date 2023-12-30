var elem = document.getElementById("full-screen")

$("body").click(function () {
    fullscreen();
});

const currentDate = new Date();
const hours = currentDate.getHours();
const minutes = currentDate.getMinutes();

const formattedTime = `${hours}:${minutes}`;
$(".device-time").text(formattedTime);


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

$(".hangup").click(function() {
    $("#pre-voice")[0].pause();
    $("#pre-voice")[0].currentTime = 0;
    stopTimer();
})

$(".speaker").click(function() {
    $("#pre-voice")[0].play();
    setTimeout(startTimer, 9500);
});

var intervalId;

function startTimer() {
    var timer = 0;
    var timerElement = $(".call-status");

    var audioPlayer = $("#pre-voice")[0];

    audioPlayer.addEventListener("ended",
        function() {
            stopTimer();
        });

    intervalId = setInterval(function() {
        var minutes = Math.floor(timer / 60);
        var seconds = timer % 60;
        var formattedTime =
        (minutes < 10 ? '0': '') + minutes + ':' +
        (seconds < 10 ? '0': '') + seconds;
        timerElement.text(formattedTime);
        timer++;
    },
        1000);

    $(".add-call").attr("class",
        "button add-call active");
    $(".hold").attr("class",
        "button hold active");
}

function stopTimer() {
    clearInterval(intervalId);
    $(".call-status").text("Call Ended");
}


if ('wakeLock' in navigator) {
    navigator.wakeLock.request('screen').then((wakeLock) => {
        console.log('Screen wake lock activated');
    }).catch((error) => {
        console.error(`Error requesting screen wake lock: ${error}`);
    });
} else {
    console.warn('Wake Lock API not supported');
}