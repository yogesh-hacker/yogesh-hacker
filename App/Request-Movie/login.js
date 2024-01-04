var userDeviceId;
var LOGIN_URL = "https://script.google.com/macros/s/AKfycbx642t0EFHWeKeZdf2AhXjs5VRMMHy0fhGAlEeisYG0zCA-D4_QgHuR4hm2LZSMP-9GjQ/exec"

$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const manufacturer = urlParams.get('manufacturer');
    const model = urlParams.get('model');
    const androidId = urlParams.get('androidId');
    if (androidId != null && androidId != "") {
        $(".user_id").append("User ID : "+androidId);
        userDeviceId = androidId;
    } else {
        $("body").html("<center>Unauthorized Access<br>This page used to embed please <a href='../'>download </a>our app to view this page.</center>")
        $("body").css("background-color", "#fff")
    }
});

var user = "";

$(document).ready(function() {
    fetchUsers();
})

function fetchUsers() {
    var url = LOGIN_URL+"?action=read";

    $.getJSON(url,
        function (json) {
            for (var i = 0; i < json.records.length; i++) {
                if (json.records[i].device_id === userDeviceId) {
                    username = json.records[i].username;
                    user = username;
                    if (username) {
                        Cookies.set("username", username, {
                            expires: 365
                        })
                        $(".username").html("Username : "+username+"<span class='edit-username' onclick='openForm()'><i class='fa-solid fa-pencil'></i></span>")
                        $(".change-username-description").text(`Modifying your username merely updates your public identity, while your inherent identification, User ID: ${userDeviceId}, remains immutable.`)
                        $(".member_form , .member_form_canvas").css("display", "none")
                    }
                }
            }
        })
}

function openForm() {
    $(".member_form , .member_form_canvas").css("display",
        "flex")
}

function updateUsername() {
    var username = $("#username").val().trim();
    var url = LOGIN_URL + "?callback=saveUsernameChanges&device_id="+userDeviceId+"&username="+username+"&action=change_username";

    var request = jQuery.ajax({
        crossDomain: true,
        url: url,
        method: "GET",
        dataType: "jsonp"
    });
}

function saveUsernameChanges() {
    fetchUsers()
    $(".member_form , .member_form_canvas").css("display",
        "none")
    customAlertDialog('Change Username',
        'Successfully! Changed your current username to requested one...',
        [{
            name: 'OK',
            action: () => {}
        }]);
}
