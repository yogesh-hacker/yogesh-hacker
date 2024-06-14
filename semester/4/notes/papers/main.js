var data = [];
var mAccessKey;
var accessKeys = ["A6AVP97APFTNTWJS74AGN3G3A","commit-id@2024#secure&full"]
var mPaperId = 8;


var mCurrentPage = window.location.href;
if (mCurrentPage.includes("/8")) {
    mPaperId = 8;
} else if (mCurrentPage.includes("/9")) {
    mPaperId = 9;
} else if (mCurrentPage.includes("/10")) {
    mPaperId = 10;
} else if (mCurrentPage.includes("/sec-2")) {
    mPaperId = "sec-2"
}

$(document).ready(function() {
    var accessKey = Cookies.get("_access_key_");
    if (accessKey != undefined) {
        var validUser = false;
        var fullAccess = false;
        if(accessKey != "commit-id@2024#secure&full"){
            validUser = true;
            fullAccess = false;
            $("#result").html("Ensure you have committed to this page, unless it's inaccessible even with the access key.&nbsp<a href='#' onclick='showLoginForm()'>Re-enter access key</a>");
            return;
        } else {
            fullAccess = true;
        }
        for (var i = 0; i < accessKeys.length; i++) {
            if (accessKey === accessKeys[i]) {
                validUser = true;
                break;
            }
        }
        if (validUser) {
            if(fullAccess){
                loadData();
            }
        } else {
            showLoginForm();
        }
    } else {
        showLoginForm();
    }
})


function loadData() {
    $("#result").html("");
    var script_url = "https://script.google.com/macros/s/AKfycbyzXcc-oRdehTMWT_z6JQawPFy8kpRhE-YSTb4p_KLHfSo3H_3o4LIHBTziwFB-CHN0/exec";
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
        } else{
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
    mAccessKey = $("#userNumber").val();
    if (mAccessKey.length == 25 || mAccessKey.length == 26) {
        for (var i = 0; i < accessKeys.length; i++) {
            if (mAccessKey === accessKeys[i]) {
                Cookies.set("_access_key_", mAccessKey, {
                    expires: 5
                })
                alert("Welcome dear user, I am glad to see you here!")
                hideLoginForm();
                loadData()
            } else {
                $(".error").text("This access key isn't verified!")
            }
        }
    } else {
        $(".error").text("Invalid access key!");
    }
})

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
    }
}


function getRefineAnswer(targetAnswer, elem) {
    $(elem).html("<div class='loader'></div>")
    var refineAnswer = $(targetAnswer).find('.answer').text();
    speakAnswer(refineAnswer);
}

function speakAnswer(answer) {
    const utterance = new SpeechSynthesisUtterance(answer);
    const voices = speechSynthesis.getVoices();
    utterance.voice = voices[0];
    speechSynthesis.speak(utterance);
    $(elem).html("<i class='fa-solid fa-volume'></i>")
}
