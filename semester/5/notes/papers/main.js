var data = [];
var mAccessKey;
var accessKeys = [{
    "name": "All",
    "key": "commit-id@2025#secure&full",
    "status": "active"
}];
var mPaperId = 11;

var mCurrentPage = window.location.href;
if (mCurrentPage.includes("/11")) {
    mPaperId = 11;
} else if (mCurrentPage.includes("/12")) {
    mPaperId = 12;
} else if (mCurrentPage.includes("/1")) {
    mPaperId = 1;
} else if (mCurrentPage.includes("/2")) {
    mPaperId = 2;
}

$(document).ready(function() {
    var accessKey = Cookies.get("_access_key_");

    if (accessKey) {
        if (accessKey.length !== 26) {
            $("#result").html("Invalid access key length. The key must be 25 characters long.&nbsp<a href='#' onclick='showLoginForm()'>Re-enter access key</a>");
            return;
        }

        let user = accessKeys.find(user => user.key === accessKey);

        if (!user) {
            $("#result").html("Invalid access key. Please check your key and try again.&nbsp<a href='#' onclick='showLoginForm()'>Re-enter access key</a>");
            return;
        }

        if (user.status === "revoked") {
            $("#result").html("This access key has been revoked. Please contact support.&nbsp<a href='#' onclick='showLoginForm()'>Re-enter access key</a>");
            return;
        }
        loadData()
    } else {
        showLoginForm();
    }
});

function loadData() {
    $("#result").html("");
    var script_url = "https://script.google.com/macros/s/AKfycbwjc1_xJgC36Y3ij6htZKxDk8czpP_gGBBvZj9iEXjWDm1n31aT9gGh2Vbu6tIxw4yD/exec";
    $(".canvas").css("display",
        "flex");
    var url = script_url + "?action=read&paper_id="+mPaperId;
    $.getJSON(url,
        function (json) {
            $(".canvas").css("display", "none");
            if (json.records.length != 0) {
                for (var i = 0; i < json.records.length; i++) {
                    data.push(json.records[i])
                }
            } else {
                $("#result").append("<p class='data-error'>No Questions and Answers available, Check Back Later!</p>")
            }
            showData();
        })
}

function showData() {
    var serialNumbers = {};

    for (var i = 0; i < data.length; i++) {
        var item_id = data[i].item_id;
        var item_title = data[i].item_title;

        if (!serialNumbers[item_id]) {
            serialNumbers[item_id] = 1;
        }

        var questionNumber = serialNumbers[item_id]++;
        var questionDiv = $("<div class='questionDiv'></div>");

        if ($("#item_id_" + item_id).length === 0) {
            var itemHeading = $("<h2 class='book-title'>" + getItemTitle(item_title) + "</h2>");
            $("#result").append(itemHeading);
            var itemDiv = $("<div id='item_id_" + item_id + "' class='itemDiv'></div>");
            $("#result").append(itemDiv);
        }


        if (!isCollapseEnabled) {
            questionDiv.append("<div class='question-container'><p class='question'>" + questionNumber + ". " + data[i].question + "<span class='mark'>" + data[i].mark + "<span></p><br><div id='answer_" + item_id + "_" + questionNumber + "'><p class='answer'><b>Ans. </b>" + data[i].answer + "</p></div></div>");
        } else {
            questionDiv.append("<div class='question-container'><p class='question' data-bs-toggle='collapse' data-bs-target='#answer_"+item_id+"_"+questionNumber+"'>" + questionNumber + ". " + data[i].question + "<span class='mark'>" + data[i].mark + "</span><span class='tts-button-container' onclick='getRefineAnswer(answer_"+item_id+"_"+questionNumber+",$(this))'><i class='fa-solid fa-volume'></i></span></p><br><div id='answer_" + item_id + "_" + questionNumber + "' class='collapse'><p class='answer'><b>Ans. </b>" + data[i].answer + "</p></div></div>");
        }
        $("#item_id_" + item_id).append(questionDiv);
        applyFontStyle();
    }
}

function getItemTitle(sentence) {
    const words = sentence.split(' ');
    let insideBrackets = false;
    const capitalizedWords = words.map((word) => {
        if (word.includes('(')) {
            insideBrackets = true;
        }

        const capitalizedWord = insideBrackets
        ? word: word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

        if (word.includes(')')) {
            insideBrackets = false;
        }
        return capitalizedWord;
    });
    const capitalizedSentence = capitalizedWords.join(' ');
    return capitalizedSentence;
}


$("button").click(function() {
    $(".collapse").collapse('hide')
})

$('.question').on('click', function () {
    var target = $(this).data('bs-target');
    $(target).collapse('toggle');
});

$("#login").click(function() {
    var mAccessKey = $("#userNumber").val().trim();

    if (mAccessKey.length === 26) {
        var user = accessKeys.find(user => user.key === mAccessKey);

        if (user) {
            if (user.status === "active") {
                Cookies.set("_access_key_", mAccessKey, {
                    expires: 5
                });

                user.loggedInBefore = true;
                alert("Welcome, " + user.name + "! I'm glad to see you here!");
                hideLoginForm();
                loadData();
            } else if (user.status === "revoked") {
                $(".error").text("This access key has been revoked. Please contact support.");
            }
        } else {
            $(".error").text("This access key isn't verified!");
        }
    } else {
        $(".error").text("Invalid access key!");
    }
});

function showLoginForm() {
    $(".login_canvas").css("display",
        "flex");
}

function hideLoginForm() {
    $(".login_canvas").css("display",
        "none");
}

function hideAlert() {
    $(".info").css("display",
        "none");
}

var themeMode = Cookies.get("_theme_mode_");
var questionFontFamily = Cookies.get('_question_font_family');
var answerFontFamily = Cookies.get("_answer_font_family");
var isCollapseEnabled = Cookies.get("_is_collapse_enabled");

// Convert isCollapseEnabled to a boolean
if (isCollapseEnabled === "true") {
    isCollapseEnabled = true;
} else if (isCollapseEnabled === "false") {
    isCollapseEnabled = false;
} else {
    isCollapseEnabled = true;
}

const root = document.documentElement;

if (themeMode === "light") {
    root.style.setProperty('--secondary-color', '#fff');
    root.style.setProperty('--secondary-accent-color', "#000")
    root.style.setProperty('--question-mark-background-color', '#FF008D');
    root.style.setProperty('--question-container-background-color', 'rgba(0,0,0,0.05')
    root.style.setProperty('--color-question', '#000');
    root.style.setProperty('--color-answer', '#000')
    root.style.setProperty('--primary-button-text-color', '#fff')
    root.style.setProperty('--color-error', '#000')
}


function applyFontStyle() {
    if (questionFontFamily) {
        $(".question").css("font-family", questionFontFamily);
        $(".question u").css("font-family", questionFontFamily);
        $(".question span").css("font-family", questionFontFamily);
        $(".question i").each(function() {
            if (!$(this).hasClass("fa-solid") || !$(this).hasClass("fa-volume")) {
                $(this).css("font-family", questionFontFamily);
            }
        });
    }

    if (answerFontFamily) {
        $(".answer").css("font-family", answerFontFamily);
        $(".answer u").css("font-family", answerFontFamily);
        $(".answer i").css("font-family", answerFontFamily);
        $(".answer s").css("font-family", answerFontFamily);
        $(".answer span").css("font-family", answerFontFamily);
    }
}


function getRefineAnswer(targetAnswer, elem) {
    $(elem).html("<div class='loader'></div>")
    var refineAnswer = $(targetAnswer).find('.answer').text();
    console.log(refineAnswer);
    speakAnswer(refineAnswer, elem);
}

let wakeLock = null;
let currentElem = null;

async function requestWakeLock() {
    try {
        wakeLock = await navigator.wakeLock.request('screen');
        console.log('Wake Lock is active');
    } catch (err) {
        console.error(`${err.name}, ${err.message}`);
    }
}

function releaseWakeLock() {
    if (wakeLock !== null) {
        wakeLock.release()
        .then(() => {
            wakeLock = null;
            console.log('Wake Lock released');
        })
        .catch((err) => {
            console.error(`${err.name}, ${err.message}`);
        });
    }
}

function getUrlParameter(name) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(window.location.href);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var speedParam = getUrlParameter('speed');

function speakAnswer(answer, elem) {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        releaseWakeLock();
        if (currentElem) {
            $(currentElem).html("<i class='fa-solid fa-volume'></i>");
        }
    }

    currentElem = elem;
    $(currentElem).html("<div class='loader'></div>")

    const voices = speechSynthesis.getVoices();
    const chunks = splitTextIntoChunks(answer, 160);
    let chunkIndex = 0;
    let utteranceSpeed = 1.0;
    if (speedParam && !isNaN(speedParam) && speedParam >= 0.1 && speedParam <= 10) {
        utteranceSpeed = parseFloat(speedParam);
    }

    async function speakChunk() {
        if (chunkIndex === 0) {
            await requestWakeLock();
        }

        if (chunkIndex < chunks.length) {
            const utterance = new SpeechSynthesisUtterance(chunks[chunkIndex]);
            utterance.voice = voices[0];
            utterance.lang = "en-IN";
            utterance.rate = utteranceSpeed;
            utterance.onend = () => {
                chunkIndex++;
                speakChunk();
            };
            speechSynthesis.speak(utterance);
        } else {
            releaseWakeLock();
            $(elem).html("<i class='fa-solid fa-volume'></i>");
        }
    }

    speakChunk();
}

function splitTextIntoChunks(text, maxLength) {
    const sentences = text.match(/[^\.!\?।]+[\.!\?।]+/g);
    const chunks = [];
    let chunk = '';

    sentences.forEach(sentence => {
        if ((chunk + sentence).length > maxLength) {
            chunks.push(chunk);
            chunk = sentence;
        } else {
            chunk += sentence;
        }
    });

    if (chunk) {
        chunks.push(chunk);
    }

    return chunks;
}
