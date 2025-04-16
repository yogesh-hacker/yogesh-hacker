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
        $("body").html(`
            <center style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
            <h2>Unauthorized Access</h2>
            <p>This page is meant to be embedded within our app. Please
            <a href="../" style="color: #007BFF; text-decoration: none;">download</a>
            our app to view the content.</p>
            </center>
            `);
        $("body").css({
            "background-color": "#fff",
            "margin": "0",
            "padding": "0",
            "height": "100vh",
            "display": "flex",
            "align-items": "center",
            "justify-content": "center"
        });
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
                        $(".change-username-description").text(`Modifying your username merely updates your public identity, while your inherent identification, User ID: <b>${userDeviceId}<b>, remains immutable.`)
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

$(".member_form_canvas").click(function () {
    $(".member_form , .member_form_canvas").css("display", "none")
});

function updateUsername() {
    var username = $("#username").val().trim();
    if (username.length > 3 && username != "") {
        var url = LOGIN_URL + "?callback=saveUsernameChanges&device_id="+userDeviceId+"&username="+username+"&action=change_username";

        var request = jQuery.ajax({
            crossDomain: true,
            url: url,
            method: "GET",
            dataType: "jsonp"
        });
    } else {
        Swal.fire({
            title: 'Change Username',
            text: 'Please choose a valid username...',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
    }
}

function saveUsernameChanges() {
    fetchUsers()
    $(".member_form , .member_form_canvas").css("display",
        "none")
    Swal.fire({
        title: 'Change Username',
        text: 'The username has been successfully updated to the new one.',
        icon: 'success',
        confirmButtonText: 'OK'
    });
}
