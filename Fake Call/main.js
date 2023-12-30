var elem = document.getElementById("full-screen")
var audioPlayer = $("#pre-voice")[0];
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
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    stopTimer();
})

$(".speaker").click(function() {
    audioPlayer.play();
    setTimeout(startTimer, 9500);
});

var intervalId;

function startTimer() {
    var timer = 0;
    var timerElement = $(".call-status");

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


audioPlayer.addEventListener("timeupdate", function() {
    if (audioPlayer.currentTime * 1000 >= 11000) {
        startTimer();
        audioPlayer.removeEventListener("timeupdate", arguments.callee);
    }
});