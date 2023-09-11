var data = [];
var mPhoneNumber;
var users = ["8538032595","9093388551","7047493161","8250054588","9093663287","9681590517"]
var isAnswerShown = false;

$(document).ready(function() {
    var userId = Cookies.get("_user_id");
    if (userId != undefined) {
        var userFound = false;
        for (var i = 0; i < users.length; i++) {
            if (userId === users[i]) {
                userFound = true;
                break; // Exit the loop once a matching user is found
            }
        }
        if (userFound) {
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
    $(".canvas").css("display","flex");
    var url = script_url + "?action=read";
    $.getJSON(url,
        function (json) {
            $(".canvas").css("display","none");
            for (var i = 0; i < json.records.length; i++) {
                data.push(json.records[i])
            }
            showData(false);
        })
}

function showData(isAnswer) {
    var serialNumbers = {}; // Initialize an object to store serial numbers for each item_id
    for (var i = 0; i < data.length; i++) {
        var item_id = data[i].item_id;
        if (!serialNumbers[item_id]) {
            serialNumbers[item_id] = 1; // Initialize serial number to 1 for a new item_id
        }
        var questionNumber = serialNumbers[item_id]++; // Get the current serial number and increment
        if (isAnswer == true) {
            $("#item_id_" + item_id).append("<p class='question'>" + questionNumber + ". " + data[i].question + "<span class='mark'>"+data[i].mark+"<span></p><br><p class='answer'><b>Ans. </b>"+data[i].answer+"</p><div class='hairline'></div>");
        } else {
            $("#item_id_" + item_id).append("<p class='question'>" + questionNumber + ". " + data[i].question + "<span class='mark'>"+data[i].mark+"<span></p><div class='hairline'></div>");
        }
    }
}


$(".showAnswer").click(function() {
    for (var i = 0; i < 9; i++) {
        $("#item_id_"+i).html("")
    }
    if (isAnswerShown == true) {
        isAnswerShown = false;
        showData(false);
        $(this).text("Show Answer (Disabled)")
    } else {
        isAnswerShown = true;
        showData(true);
        $(this).text("Show Answer (Active)")
    }
})

$("#login").click(function() {
    mPhoneNumber = $("#userNumber").val();
    console.log(mPhoneNumber)
    if (mPhoneNumber.length == 10) {
        for (var i = 0; i < users.length; i++) {
            if (mPhoneNumber === users[i]) {
                Cookies.set("_user_id", mPhoneNumber, {
                    expires: 5
                })
                alert("Welcome dear user, I am glad to see you here!")
                hideLoginForm();
                loadData()
            } else {
                $(".error").text("This number cannot be verified!")
            }
        }
    } else {
        $(".error").text("Invalid mobile number!");
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

/*
$("#enable_selection").change(function() {
    var isChecked = $(this).prop("checked")
    if (isChecked == true) {
        $("body").css("user-select", "auto");
        $("body").css("-moz-user-select", "auto");
        $("body").css("-webkit-user-select", "auto");
        $("body").css("-ms-user-select", "auto");

    } else {
        $("body").css("user-select", "none");
        $("body").css("-moz-user-select", "none");
        $("body").css("-webkit-user-select", "none");
        $("body").css("-ms-user-select", "none");
    }
})*/