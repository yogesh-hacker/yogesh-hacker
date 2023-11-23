var data = [];
var mPhoneNumber;
var accessKeys = ["3de013132a81731687c1", "a13df950d3172fe1df8b", "5cb343ceeae2263e3471", "24c4ba9cad9bf5aae190", "ffc1ec0b6bedd74122c2", "03968fde20f5cca2fe99"]

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
    var script_url = "https://script.google.com/macros/s/AKfycbxZZ4TtWgEYUwfUDzp2oSHs6gcarK0wpOP9bbNU-5LbIr7gALr6rgAJSFDvoWR2tVX-/exec";
    $(".canvas").css("display",
        "flex");
    var url = script_url + "?action=read";
    $.getJSON(url,
        function (json) {
            $(".canvas").css("display", "none");
            for (var i = 0; i < json.records.length; i++) {
                data.push(json.records[i])
            }
            showData();
        })
}

function showData() {
    var serialNumbers = {};

    for (var i = 0; i < data.length; i++) {
        var item_id = data[i].item_id;
        var item_title = data[i].item_title;
        var cc_id = data[i].cc_id;

        if (!serialNumbers[item_id]) {
            serialNumbers[item_id] = 1;
        }

        var questionNumber = serialNumbers[item_id]++;
        var questionDiv = $("<div class='questionDiv'></div>");
        if ($("#cc_" + cc_id).length === 0) {
            var ccDiv = $("<div id='cc_" + cc_id + "' class='collapse'></div>");
            $("#result").append(ccDiv);
        }


        if ($("#item_id_" + item_id).length === 0) {
            var itemHeading = $("<h2 class='heading'>" + getItemTitle(item_title) + "</h2>");
            $("#cc_" + cc_id).append(itemHeading);
            var itemDiv = $("<div id='item_id_" + item_id + "' class='itemDiv'></div>");
            $("#cc_" + cc_id).append(itemDiv);
        }


        questionDiv.append("<p class='question' data-bs-toggle='collapse' data-bs-target='#answer_" + item_id + "_" + questionNumber + "'>" + questionNumber + ". " + data[i].question + "<span class='mark'>" + data[i].mark + "<span></p><br><div id='answer_" + item_id + "_" + questionNumber + "' class='collapse'><p class='answer'><b>Ans. </b>" + data[i].answer + "</p></div><div class='hairline'></div>");
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
    console.log(mPhoneNumber)
    if (mAccessKey.length == 20) {
        for (var i = 0; i < accessKeys.length; i++) {
            if (mAccessKey === accessKeys[i]) {
                Cookies.set("_user_id", mAccessKey, {
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