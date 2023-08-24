'use strict';
var data = [];

$(document).ready(function() {
    data = JSON.parse(JSON.stringify(data));
    showData();
})
var serial_no = 0;
function showData() {
    for (var i = 0; i < data.length; i++) {
        serial_no++
        $("#content").append("<p class='question'>"+serial_no+". "+data[i].q+"</p><p class='answer'><b>Ans. </b>"+data[i].a+"</p>")
    }
    $(".total_question").text("Total Questions Uploaded : "+data.length);
}

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
})