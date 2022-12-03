$(".switch").click(function() {
    $("#amount").css("display", "none")
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
        curr_fun_type.attr("onclick", "search_by_name()")
        input_field.val("")

    } else {
        $("#result").css("display", "none")
        input_field.attr({
            placeholder: "Enter number to search...", "data-type": "number", type: "tel"
        })
        curr_search_type.html("Search by name instead...")
        curr_fun_type.attr("onclick", "search_by_number()")
        input_field.val("")
    }
})

$(".close").click(function() {
    $("#data_mode").css("display", "none")
})

$(".change_mode").click(function() {
    $("#data_mode").css("display", "flex")
})


function auth() {
    let key = prompt("Please enter your special key to access!",
        "")
    if (key === "@osint1234") {
        alert("Welcome!")
    } else {
        $('.default').prop('checked', true);
        $('.non_default').prop('checked',false)
        alert("Get Out! Invalid key!")
    }
}


var data = []
$(document).ready(function() {
    const mydata = JSON.parse(JSON.stringify(data))
    data.push(mydata)
})

var protocol = "https://"
var domain = "yogesh-hacker.github.io/"
var subDict_1 = "yogesh-hacker/"
var subDict_2 = "images/"
var photo = protocol + domain + subDict_1 +subDict_2;



function search_by_number() {
    $("#amount").css("display",
        "none")
    var data_mode = $('input[name="details_mode"]:checked').val()
    var search_query = $("#s_query").val().trim();
    var checkpoint = 1;
    $("#result").css("display",
        "none")
    $("#result").html("")
    for (var i = 0; i < data.length; i++) {
        if (search_query === data[i].number) {
            $("#result").css("display", "flex")
            if (data_mode === "advance") {
                if (data[i].is_verified === "true") {
                    $("#result").html("<p>Name : "+data[i].name+" <i id='verified_badge' class='fa-solid fa-badge-check'></i></p><p>Father Name : "+data[i].father_name+"</p><p>Mother Name : "+data[i].mother_name+"</p><p>DOB : "+data[i].dob+"</p><p>Religion : "+data[i].religion+"</p><p>Blood Group : "+data[i].blood_group+"</p><p>Phone Number : +91"+data[i].number+"</p><p>Email : "+data[i].email+"</p><p>Adhaar No : "+data[i].adhaar_no+"</p><p>Address : "+data[i].address+"</p><p>School : "+data[i].school+"</p><p>College : "+data[i].college+"</p><p>Photo : <img class='owner_photo' src='"+photo+"P"+data[i].number+".png'></img></p><p>Sign : <img class='owner_photo' src='"+photo+"S"+data[i].number+".png'></img></p><div class='divider'></div>")
                    checkpoint = 0;
                } else {
                    $("#result").html("<p>Name : "+data[i].name+"</p><p>Father Name : "+data[i].father_name+"</p><p>Mother Name : "+data[i].mother_name+"</p><p>DOB : "+data[i].dob+"</p><p>Religion : "+data[i].religion+"</p><p>Blood Group : "+data[i].blood_group+"</p><p>Phone Number : +91"+data[i].number+"</p><p>Email : "+data[i].email+"</p><p>Adhaar No : "+data[i].adhaar_no+"</p><p>Address : "+data[i].address+"</p><p>School : "+data[i].school+"</p><p>College : "+data[i].college+"</p><p>Photo : <img class='owner_photo' src='"+photo+"P"+data[i].number+".png'></img></p><p>Sign : <img class='owner_photo' src='"+photo+"P"+data[i].number+".png'></img></p><div class='divider'></div>")
                    checkpoint = 0;
                }
            }
            if (checkpoint == 1) {
                if (data[i].is_verified === "true") {
                    $("#result").html("<p>Name : "+data[i].name+" <i id='verified_badge' class='fa-solid fa-badge-check'></i></p><p>Phone Number : +91"+data[i].number+"</p><p>Address : "+data[i].address+"</p><p>School : "+data[i].school+"</p><p>College : "+data[i].college+"</p><p>Photo : <img class='owner_photo' src='"+photo+"P"+data[i].number+".png'></img></p><div class='divider'></div>")
                    checkpoint = 0;
                } else {
                    $("#result").html("<p>Name : "+data[i].name+"</p><p>Phone Number : +91"+data[i].number+"</p><p>Address : "+data[i].address+"</p><p>School : "+data[i].school+"</p><p>College : "+data[i].college+"</p><p>Photo : <img class='owner_photo' src='"+photo+"P"+data[i].number+".png'></img></p><div class='divider'></div>")
                    checkpoint = 0;
                }
            }
            checkpoint = 0;
        }
        if (checkpoint == 1) {
            $("#result").css("display", "flex")
            $("#result").text("No data found!")
        }
    }
}

function search_by_name() {
    $("#amount").css("display", "none")
    var data_mode = $('input[name="details_mode"]:checked').val()
    var search_query = $("#s_query").val().trim();
    var checkpoint = 1;
    $("#result").css("display",
        "none")
    $("#result").html("")
    for (var i = 0; i < data.length; i++) {
        if (search_query === data[i].name) {
            $("#result").css("display", "flex")
            if (data_mode === "advance") {
                if (data[i].is_verified === "true") {
                    $("#result").html("<p>Name : "+data[i].name+" <i id='verified_badge' class='fa-solid fa-badge-check'></i></p><p>Father Name : "+data[i].father_name+"</p><p>Mother Name : "+data[i].mother_name+"</p><p>DOB : "+data[i].dob+"</p><p>Religion : "+data[i].religion+"</p><p>Blood Group : "+data[i].blood_group+"</p><p>Phone Number : +91"+data[i].number+"</p><p>Email : "+data[i].email+"</p><p>Adhaar No : "+data[i].adhaar_no+"</p><p>Address : "+data[i].address+"</p><p>School : "+data[i].school+"</p><p>College : "+data[i].college+"</p><p>Photo : <img class='owner_photo' src='"+photo+"P"+data[i].number+".png'></img></p><p>Sign : <img class='owner_photo' src='"+photo+"S"+data[i].number+".png'></img></p><div class='divider'></div>")
                    checkpoint = 0;
                } else {
                    $("#result").html("<p>Name : "+data[i].name+"</p><p>Father Name : "+data[i].father_name+"</p><p>Mother Name : "+data[i].mother_name+"</p><p>DOB : "+data[i].dob+"</p><p>Religion : "+data[i].religion+"</p><p>Blood Group : "+data[i].blood_group+"</p><p>Phone Number : +91"+data[i].number+"</p><p>Email : "+data[i].email+"</p><p>Adhaar No : "+data[i].adhaar_no+"</p><p>Address : "+data[i].address+"</p><p>School : "+data[i].school+"</p><p>College : "+data[i].college+"</p><p>Photo : <img class='owner_photo' src='"+photo+"P"+data[i].number+".png'></img></p><p>Sign : <img class='owner_photo' src='"+photo+"P"+data[i].number+".png'></img></p><div class='divider'></div>")
                    checkpoint = 0;
                }
            }
            if (checkpoint == 1) {
                if (data[i].is_verified === "true") {
                    $("#result").html("<p>Name : "+data[i].name+" <i id='verified_badge' class='fa-solid fa-badge-check'></i></p><p>Phone Number : +91"+data[i].number+"</p><p>Address : "+data[i].address+"</p><p>School : "+data[i].school+"</p><p>College : "+data[i].college+"</p><p>Photo : <img class='owner_photo' src='"+photo+"P"+data[i].number+".png'></img></p><div class='divider'></div>")
                    checkpoint = 0;
                } else {
                    $("#result").html("<p>Name : "+data[i].name+"</p><p>Phone Number : +91"+data[i].number+"</p><p>Address : "+data[i].address+"</p><p>School : "+data[i].school+"</p><p>College : "+data[i].college+"</p><p>Photo : <img class='owner_photo' src='"+photo+"P"+data[i].number+".png'></img></p><div class='divider'></div>")
                    checkpoint = 0;
                }
            }
            checkpoint = 0;
        }
        if (checkpoint == 1) {
            $("#result").css("display", "flex")
            $("#result").text("No data found!")
        }
    }
}

$("#seeall").click(function() {
    $("#amount").css("display", "none")
    var data_mode = $('input[name="details_mode"]:checked').val()
    var group_type = $("#group_type").val();
    $("#result").css("display", "none")
    $("#result").html("")
    $(".loader").css("display", "flex")
    var counter = 0;
    var checkpoint = 0;
    $("#result").css("display", "flex")
    for (var i = 0; i < data.length; i++) {
        if (data[i].group_type === group_type) {
            checkpoint = 1;
            counter++
            $("#amount").text(`Total `+counter+` amount of data found!`)
            $("#amount").css("display", "block")
            if (data_mode === "advance") {
                if (data[i].is_verified === "true") {
                    $("#result").append("<p>Name : "+data[i].name+" <i id='verified_badge' class='fa-solid fa-badge-check'></i></p><p>Father Name : "+data[i].father_name+"</p><p>Mother Name : "+data[i].mother_name+"</p><p>DOB : "+data[i].dob+"</p><p>Religion : "+data[i].religion+"</p><p>Blood Group : "+data[i].blood_group+"</p><p>Phone Number : +91"+data[i].number+"</p><p>Email : "+data[i].email+"</p><p>Adhaar No : "+data[i].adhaar_no+"</p><p>Address : "+data[i].address+"</p><p>School : "+data[i].school+"</p><p>College : "+data[i].college+"</p><p>Photo : <img class='owner_photo' src='"+photo+"P"+data[i].number+".png'></img></p><p>Sign : <img class='owner_photo' src='"+photo+"S"+data[i].number+".png'></img></p><div class='divider'></div>")
                } else {
                    $("#result").append("<p>Name : "+data[i].name+"</p><p>Father Name : "+data[i].father_name+"</p><p>Mother Name : "+data[i].mother_name+"</p><p>DOB : "+data[i].dob+"</p><p>Religion : "+data[i].religion+"</p><p>Blood Group : "+data[i].blood_group+"</p><p>Phone Number : +91"+data[i].number+"</p><p>Email : "+data[i].email+"</p><p>Adhaar No : "+data[i].adhaar_no+"</p><p>Address : "+data[i].address+"</p><p>School : "+data[i].school+"</p><p>College : "+data[i].college+"</p><p>Photo : <img class='owner_photo' src='"+photo+"P"+data[i].number+".png'></img></p><p>Sign : <img class='owner_photo' src='"+photo+"S"+data[i].number+".png'></img></p><div class='divider'></div>")
                }
            } else {
                if (data[i].is_verified === "true") {
                    $("#result").append("<p>Name : "+data[i].name+" <i id='verified_badge' class='fa-solid fa-badge-check'></i></p><p>Phone Number : +91"+data[i].number+"</p><p>Address : "+data[i].address+"</p><p>School : "+data[i].school+"</p><p>College : "+data[i].college+"</p><p>Photo : <img class='owner_photo' src='"+photo+"P"+data[i].number+".png'></img></p><div class='divider'></div>")
                } else {
                    $("#result").append("<p>Name : "+data[i].name+" </p><p>Phone Number : +91"+data[i].number+"</p><p>Address : "+data[i].address+"</p><p>School : "+data[i].school+"</p><p>College : "+data[i].college+"</p><p>Photo : <img class='owner_photo' src='"+photo+"P"+data[i].number+".png'></img></p><div class='divider'></div>")
                }
            }
        }
        if (checkpoint == 0) {
            $("#amount").text(`Total 0 amount of data found!`)
            $("#amount").css("display", "block")
            $("#result").css("display", "flex")
            $("#result").text("Please Choose Group Type First!")
        }
    }
})



$("#s_query").keyup(function() {
    var data_type = $("#s_query").attr("data-type")
    $("#osint_sugg").html("")
    if (data_type === "number") {
        for (var i = 0; i < data.length; i++) {
            var num_sugg_list = document.createElement("li")
            num_sugg_list.className = "num_sugg"
            num_sugg_list.innerHTML = data[i].number
            $("#osint_sugg").append(num_sugg_list)
        }
    }
    if (data_type === "name") {
        for (var i = 0; i < data.length; i++) {
            var name_sugg_list = document.createElement("li")
            name_sugg_list.className = "num_sugg"
            name_sugg_list.innerHTML = data[i].name;
            $("#osint_sugg").append(name_sugg_list)
        }
    }
    if ($("#s_query").val() === "") {
        $("#osint_sugg").css("display", "none")
    } else {
        $("#osint_sugg").css("display", "block")
    }
    mySearch()
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