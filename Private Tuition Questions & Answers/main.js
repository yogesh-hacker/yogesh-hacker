'use strict';
var data = [];

$(document).ready(function() {
    var script_url = "https://script.google.com/macros/s/AKfycbxZZ4TtWgEYUwfUDzp2oSHs6gcarK0wpOP9bbNU-5LbIr7gALr6rgAJSFDvoWR2tVX-/exec";

    var url = script_url + "?action=read";
    $.getJSON(url, function (json) {
        for(var i=0;i<json.records.length;i++){
            $("#questions").append("<p class='question'>"+i+". "+json.records[i].question+"</p>")
        }
    })
})
var serial_no = 0;
var serial_no_2 = 0
function showData() {
    for (var i = 0; i < data.length; i++) {

        if (data[i].poem_id === "1") {
            serial_no++
            $(".poem_content_1").append("<p class='question'>"+serial_no+". "+data[i].q+"</p><p class='answer'><b>Ans. </b>"+data[i].a+"</p>")
        } else {
            serial_no_2++
            $(".poem_content_2").append("<p class='question'>"+serial_no_2+". "+data[i].q+"</p><p class='answer'><b>Ans. </b>"+data[i].a+"</p>")
        }
    }
    $(".total_question").text("Total Questions Uploaded : "+data.length);
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