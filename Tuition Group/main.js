$(".switch").click(function() {
    var data_type = $("#s_query").attr("data-type")
    var input_field = $("#s_query");
    var curr_search_type = $(".cstype");
    var curr_fun_type = $(".search");
    if (data_type === "number") {
        $("#result").css("display", "none")
        input_field.attr("placeholder", "Enter name to search...")
        input_field.attr("data-type", "name")
        curr_search_type.html("Search by number instead...")
        curr_fun_type.attr("onclick", "searchbyname()")
        input_field.val("")

    } else {
        $("#result").css("display", "none")
        input_field.attr("placeholder", "Enter number to search...")
        input_field.attr("data-type", "number")
        curr_search_type.html("Search by name instead...")
        curr_fun_type.attr("onclick", "searchbynumber()")
        input_field.val("")
    }
})

var data = [];
$(document).ready(function() {
    const mydata = JSON.parse(JSON.stringify(data));
    data.push(mydata)
})

function searchbynumber() {
    var s_query = $("#s_query").val().trim();
    var checkpoint = 0;
    for (var i = 0; i < data.length; i++) {
        if (s_query === data[i].number) {
            $("#result").css("display", "flex")
            $("#result").html("<p>Name : "+data[i].name+"</p><p>Phone Number : +91"+data[i].number+"</p><p>Address : "+data[i].address+"</p><p>School : "+data[i].school+"</p><p>College : "+data[i].college+"</p><p>Photo : <img class='owner_photo' src='"+data[i].photo+"'</img></p>")
            //alert("Match Found!")
            checkpoint = 1;
        }
    }
    if (checkpoint == 0) {
        alert("No Match Found!")
    }
}

function searchbyname() {
    var s_query = $("#s_query").val();
    var checkpoint = 0;
    for (var i = 0; i < data.length; i++) {
        if (s_query.toUpperCase() === data[i].name.toUpperCase()) {
            $("#result").css("display", "flex")
            $("#result").html("<p>Name : "+data[i].name+"</p><p>Phone Number : +91"+data[i].number+"</p><p>Address : "+data[i].address+"</p><p>School : "+data[i].school+"</p><p>College : "+data[i].college+"</p><p>Photo : <img class='owner_photo' src='"+data[i].photo+"'</img></p>")
            //alert("Match Found!")
            checkpoint = 1;
        }
    }
    if (checkpoint == 0) {
        alert("No Match Found!")
    }
}

$("#seeall").click(function() {
for (var i = 0; i < data.length; i++) {
            $("#result").css("display", "flex")
            $("#result").append("<p>Name : "+data[i].name+"</p><p>Phone Number : +91"+data[i].number+"</p><p>Address : "+data[i].address+"</p><p>School : "+data[i].school+"</p><p>College : "+data[i].college+"</p><p>Photo : <img class='owner_photo' src='"+data[i].photo+"'</img></p><div class='divider'></div>")
        }

})

/*        for (var i = 0; i < data.length; i++) {
            $("#result").css("display", "flex")
            $("#result").append("<p>Name : "+data[i].name+"</p><p>Phone Number : +91"+data[i].number+"</p><p>Address : "+data[i].address+"</p><p>School : "+data[i].school+"</p><p>College : "+data[i].college+"</p><p>Photo : <img class='owner_photo' src='"+data[i].photo+"'</img></p><div class='divider'></div>")
        }*/