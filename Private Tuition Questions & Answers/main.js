var data = [];
var mPhoneNumber;
var users = ["8538032595","9093388551","7047493161","8250054588","9093663287","9681590517","7501229420","8167820876", "8653320376", "7362901471", "7501229420", "7585096739", "7810963935", "8710056730", "9093663287", "9641678785", "9883197344", "9832688913", "7364809322", "8927014704", "9635234044", "9800529490", "6294517940", "6294929563", "6295743714", "6296669189", "7364954958", "7384084667", "7501232294", "7501679468", "7551079437", "7908709140", "8159970606", "8250961015", "8509631824", "8597129899", "8972414605", "9093407831", "9641800949", "9832492874", "9883442208", "9883931860", "8159980596", "9874939856", "7602511703", "8101582239", "8101191624", "8334804409", "7718703816", "9083580724", "7047493161", "8348561909", "6297608556", "9883001908", "7384157546", "9083167435"]
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
    for (var i = 0; i < 10; i++) {
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
