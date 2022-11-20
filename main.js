$(".switch").click(function() {
    var data_type = $("#s_query").attr("data-type")
    var input_field = $("#s_query");
    var curr_search_type = $(".cstype");
    var curr_fun_type = $(".search");
    if (data_type === "number") {
        $("#result").css("display", "none")
        input_field.attr({
            placeholder: "Enter name to search...", "data-type": "name", type: "text"
        })
        curr_search_type.html("Search by number instead...")
        curr_fun_type.attr("onclick", "searchbyname()")
        input_field.val("")

    } else {
        $("#result").css("display", "none")
        input_field.attr({
            placeholder: "Enter number to search...", "data-type": "number", type: "tel"
        })
        curr_search_type.html("Search by name instead...")
        curr_fun_type.attr("onclick", "searchbynumber()")
        input_field.val("")
    }
})

var data = [];
$(document).ready(function() {
    const mydata = JSON.parse(JSON.stringify(data));
    data.push(mydata)
    setTimeout(function() {
        $("#loader").css("display","none")
    }, 1000);
})


function searchbynumber() {
    $("#amount").css("display",
        "none")
    var mode = $('input[name="details_mode"]:checked').val()
    var s_query = $("#s_query").val().trim();
    var checkpoint = 0;
    for (var i = 0; i < data.length; i++) {
        if (s_query === data[i].number) {
            $("#result").css("display", "flex")
            if (mode === "advance") {
                $("#result").html("<p>Name : "+data[i].name+"</p><p>Father Name : "+data[i].father_name+"</p><p>Mother Name : "+data[i].mother_name+"</p><p>DOB : "+data[i].dob+"</p><p>Religion : "+data[i].religion+"</p><p>Blood Group : "+data[i].blood_group+"</p><p>Phone Number : +91"+data[i].number+"</p><p>Email : "+data[i].email+"</p><p>Adhaar No : "+data[i].adhaar_no+"</p><p>Address : "+data[i].address+"</p><p>School : "+data[i].school+"</p><p>College : "+data[i].college+"</p><p>Photo : <img class='owner_photo' src='"+data[i].photo+"'</img></p><p>Sign : <img class='owner_photo' src='"+data[i].sign+"'</img></p><div class='divider'></div>")
                checkpoint = 1;
            } else {
                $("#result").html("<p>Name : "+data[i].name+"</p><p>Phone Number : +91"+data[i].number+"</p><p>Address : "+data[i].address+"</p><p>School : "+data[i].school+"</p><p>College : "+data[i].college+"</p><p>Photo : <img class='owner_photo' src='"+data[i].photo+"'</img></p><div class='divider'></div>")
                checkpoint = 1;
            }
            checkpoint = 1;
        }
    }
    if (checkpoint == 0) {
        $("#result").css("display", "flex")
        $("#result").text("No data found!")
    }
}

function searchbyname() {
    var s_query = $("#s_query").val().trim();
    var checkpoint = 0;
    var mode = $('input[name="details_mode"]:checked').val()
    $("#amount").css("display", "none")
    for (var i = 0; i < data.length-1; i++) {
        if (data[i].status === "verified") {
            if (s_query === data[i].name.slice(0, -60)) {
                $("#result").css("display", "flex")
                if (mode === "advance") {
                    $("#result").html("<p>Name : "+data[i].name+"</p><p>Father Name : "+data[i].father_name+"</p><p>Mother Name : "+data[i].mother_name+"</p><p>DOB : "+data[i].dob+"</p><p>Religion : "+data[i].religion+"</p><p>Blood Group : "+data[i].blood_group+"</p><p>Phone Number : +91"+data[i].number+"</p><p>Email : "+data[i].email+"</p><p>Adhaar No : "+data[i].adhaar_no+"</p><p>Address : "+data[i].address+"</p><p>School : "+data[i].school+"</p><p>College : "+data[i].college+"</p><p>Photo : <img class='owner_photo' src='"+data[i].photo+"'</img></p><p>Sign : <img class='owner_photo' src='"+data[i].sign+"'</img></p><div class='divider'></div>")
                    checkpoint = 1;
                } else {
                    $("#result").html("<p>Name : "+data[i].name+"</p><p>Phone Number : +91"+data[i].number+"</p><p>Address : "+data[i].address+"</p><p>School : "+data[i].school+"</p><p>College : "+data[i].college+"</p><p>Photo : <img class='owner_photo' src='"+data[i].photo+"'</img></p><div class='divider'></div>")
                    checkpoint = 1;
                }
            }
        } else {
            if (s_query === data[i].name) {
                $("#result").css("display", "flex")
                if (mode === "advance") {
                    $("#result").html("<p>Name : "+data[i].name+"</p><p>Father Name : "+data[i].father_name+"</p><p>Mother Name : "+data[i].mother_name+"</p><p>DOB : "+data[i].dob+"</p><p>Religion : "+data[i].religion+"</p><p>Blood Group : "+data[i].blood_group+"</p><p>Phone Number : +91"+data[i].number+"</p><p>Email : "+data[i].email+"</p><p>Adhaar No : "+data[i].adhaar_no+"</p><p>Address : "+data[i].address+"</p><p>School : "+data[i].school+"</p><p>College : "+data[i].college+"</p><p>Photo : <img class='owner_photo' src='"+data[i].photo+"'</img></p><p>Sign : <img class='owner_photo' src='"+data[i].sign+"'</img></p><div class='divider'></div>")
                    checkpoint = 1;
                } else {
                    $("#result").html("<p>Name : "+data[i].name+"</p><p>Phone Number : +91"+data[i].number+"</p><p>Address : "+data[i].address+"</p><p>School : "+data[i].school+"</p><p>College : "+data[i].college+"</p><p>Photo : <img class='owner_photo' src='"+data[i].photo+"'</img></p><div class='divider'></div>")
                    checkpoint = 1;
                }
            }
        }
    }
    if (checkpoint == 0) {
        $("#result").css("display", "flex")
        $("#result").text("No data found!")
    }
}

$("#seeall").click(function() {
    var group_type = $("#group_type").val();
    var mode = $('input[name="details_mode"]:checked').val()
    var checkpoint = 0;
    var counter = 0;
    $("#result").html("")
    for (var i = 0; i < data.length; i++) {
        if (group_type === data[i].group_type) {
            counter++
            $("#result").css("display", "flex")
            $("#amount").text(`Total `+counter+` amount of data found!`)
            $("#amount").css("display", "block")
            if (mode === "advance") {
                $("#result").append("<p>Name : "+data[i].name+"</p><p>Father Name : "+data[i].father_name+"</p><p>Mother Name : "+data[i].mother_name+"</p><p>DOB : "+data[i].dob+"</p><p>Religion : "+data[i].religion+"</p><p>Blood Group : "+data[i].blood_group+"</p><p>Phone Number : +91"+data[i].number+"</p><p>Email : "+data[i].email+"</p><p>Adhaar No : "+data[i].adhaar_no+"</p><p>Address : "+data[i].address+"</p><p>School : "+data[i].school+"</p><p>College : "+data[i].college+"</p><p>Photo : <img class='owner_photo' src='"+data[i].photo+"'</img></p><p>Sign : <img class='owner_photo' src='"+data[i].sign+"'</img></p><div class='divider'></div>")
                checkpoint = 1;
            } else {
                $("#result").append("<p>Name : "+data[i].name+"</p><p>Phone Number : +91"+data[i].number+"</p><p>Address : "+data[i].address+"</p><p>School : "+data[i].school+"</p><p>College : "+data[i].college+"</p><p>Photo : <img class='owner_photo' src='"+data[i].photo+"'</img></p><div class='divider'></div>")
                checkpoint = 1;
            }
        }
    }
    if (checkpoint == 0) {
        $("#result").css("display", "flex")
        $("#result").text("No data found!")
        $("#amount").text(`Total 0 amount of data found!`)
        $("#amount").css("display", "block")
    }
})

$(document).ready(function() {
    if (data.length - 1 != data[data.length - 2].serialno) {
        $("#errors").text("Please check your database serialization!")
        $("#errors").css("display", "flex")
    }
})


$(".close").click(function() {
    $("#data_mode").css("display", "none")
})

$(".change_mode").click(function() {
    $("#data_mode").css("display", "flex")
})

$("#s_query").keyup(function() {
    var data_type = $("#s_query").attr("data-type")
    $("#osint_sugg").html("")
    if ($("#s_query").val() === "") {
        $("#osint_sugg").css("display", "none")
    } else {
        $("#osint_sugg").css("display", "block")
    }
    if (data_type === "number") {
        for (var i = 0; i < data.length-1; i++) {
            var num_sugg_list = document.createElement("li")
            num_sugg_list.className = "num_sugg"
            num_sugg_list.innerHTML = data[i].number
            $("#osint_sugg").append(num_sugg_list)
        }}
    if (data_type === "name") {
        for (var i = 0; i < data.length-1; i++) {
            var name_sugg_list = document.createElement("li")
            name_sugg_list.className = "num_sugg"
            name_sugg_list.innerHTML = data[i].name;
            $("#osint_sugg").append(name_sugg_list)
        }}
    mySearch();
})


function mySearch() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('s_query');
    filter = input.value.toUpperCase();
    ul = document.getElementById("osint_sugg");
    li = ul.getElementsByTagName('li');

    for (i = 0; i < li.length; i++) {
        a = li[i];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

$("#osint_sugg").click(function(event) {
    var sugg_target = event.target.innerText
    $("#s_query").val(sugg_target)
    $("#osint_sugg").css("display", "none")
    $(".search").click()
})
$("body").click(function() {
    if (event.target != $(".s_query")) {
        $("#osint_sugg").css("display", "none")
    }
})
