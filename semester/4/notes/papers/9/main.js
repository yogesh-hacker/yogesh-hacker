var data = [];
var mAccessKey;
var accessKeys = ["3de013132a81731687c1", "a13df950d3172fe1df8b", "5cb343ceeae2263e3471", "24c4ba9cad9bf5aae190", "ffc1ec0b6bedd74122c2", "03968fde20f5cca2fe99", "624ba2d56f22a3f3618c", "9bbdcd61084e818079f8"]
var mPaperId = 9;

$(document).ready(function() {
    var accessKey = Cookies.get("_access_key_");
    if (accessKey != undefined) {
        var validUser = false;
        for (var i = 0; i < accessKeys.length; i++) {
            if (accessKey === accessKeys[i]) {
                validUser = true;
                break;
            }
        }
        if (validUser) {
            loadData();
        } else {
            showLoginForm();
        }
    } else {
        showLoginForm();
    }
})


function loadData() {
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
                $("#result").append("<p class='error'>No Questions and Answers available, Check Back Later!</p>")
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


        questionDiv.append("<div class='question-container'><p class='question'>" + questionNumber + ". " + data[i].question + "<span class='mark'>" + data[i].mark + "<span></p><br><div id='answer_" + item_id + "_" + questionNumber + "'><p class='answer'><b>Ans. </b>" + data[i].answer + "</p></div></div>");
        $("#item_id_" + item_id).append(questionDiv);
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
    if (mAccessKey.length == 20) {
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
