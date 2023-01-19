$("button").click(function() {
    $('.collapse').collapse('hide');
});

$(document).ready(function() {
    showCC()
    attachStyleButton()
})

$("#SEM_name").change(function() {
    showCC()
})

function showCC() {
    var SEM_name = $("#SEM_name").val()
    $(".cc").css("display", "none")
    var currSEM = "."+SEM_name+"_SEM"
    $(currSEM).css("display", "block")
}

$(document).ready(function() {
    var data = JSON.parse(JSON.stringify(mydata))
    for (var i = 0; i < data.length; i++) {
        $("#questions").append(`<div id="`+data[i].cc_name+`" class="collapse questions_container"></div>`)
        for (var l = 0; l < data[i].questions.length; l++) {
            $("#"+data[i].cc_name).append(`<div class="bn_questions" id="`+data[i].questions[l].book_name+`" class="book_name"><h3 class="book_name">`+data[i].questions[l].book_name+`</h3></div>`)
            for (var x = 0; x < data[i].questions[l].questions.length; x++) {
                $("#"+data[i].questions[l].book_name).append(`<p class="questions">`+data[i].questions[l].questions[x]+`</p>`)
            }
        }
    }
})



function attachStyleButton(){
    var buttons = $("button")
    for(var i=0;i<buttons.length;i++){
        $(buttons[i]).addClass("btn btn-primary mybtn")
    }
}