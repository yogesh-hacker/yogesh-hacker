var girlfriendName;
var ageGroup;
var genderGroup; // 1 for Male and 2 for Female
var isTarget;
var pass = false;

$(document).ready(function() {
    function swipeEffect(currentQuestion, nextQuestionBox) {
        currentQuestion.addClass('swipe-out').delay(500).hide(0, function() {
            nextQuestionBox.removeClass('swipe-out').css("display", "flex");
        });
    }

    function handleLastQuestion() {
        addUser();
        isTarget = girlfriendName.toLowerCase() === "sanchita" || girlfriendName.toLowerCase() === "sonchita" || genderGroup == 2;
        if (!isTarget) {
            $("#april-fool")[0].play();
        }else{
            $("#love-song")[0].play();
        }
        $(".girlfriend-name-reveal-box").css("display", "flex");
        $("#name-container").html(`I Love You <span>${girlfriendName}</span>`);
        $("#reveal-description").html(ageGroup == 1 ? `হ্যাঁ, এটাই সত্যি যে, ${girlfriendName} আমার জীবনের একমাত্র ভালোবাসা। ${girlfriendName} যার সঙ্গে আমি একা নয়, তোর সঙ্গে আমি সবকিছু অনুভব করি, সবকিছু অবস্থান করি। তোর অভাবে আমার জীবন অসম্পূর্ণ, এমনকি সূর্য অবস্থান করেছে অন্ধকারে।<br><br>To ${girlfriendName}, তোকে আমি খুব খুব ভালোবাসি তা আমার কথার সমাহার নয়। ${girlfriendName}, আমি তোকে ভালোবাসি তা বলতে পারি না, কারণ সময় থেকে অদৃশ্য হয়ে ওঠে। তোর দৃশ্যে আমার মনের সব দুঃখ ভুলে যায়, সব অসুখ মৃত্যুর সমান নষ্ট হয়ে যায়।<br><br>তোর অমৃত হাসি, তোর চমৎকার চোখ, এসব মেলে যায় আমার মনের অগ্নিপরীক্ষা হয়ে যাওয়ার সময়। তোর সঙ্গে পাঁচালীর সুর, বনের শান্তি, সব মিলে আমার জীবনে প্রেমের কাহিনী লিখে যায়।<br><br>${girlfriendName} তোর অকৃত্রিম সৌন্দর্য আমাকে মোহ করে, তোর কথা শোনার সাথে আমার হৃদয় ছুঁয়ে যায়। তোর সাথে আমি একা নয়, তোর সাথে আমি পূর্ণতা অনুভব করি।<br><br>আমার প্রিয় ${girlfriendName}, তুই আমার প্রতি সদায় একটি অবিচল আত্মা হয়ে সব সময় আছিস। তুই আমার জীবনের প্রকৃত অর্থ, প্রকৃত সুখ, এবং প্রকৃত সমৃদ্ধি।<br><br>আমার প্রিয় ${girlfriendName}, তুই আমার অমৃত প্রেমের কবিতা, আমার সকল সৃষ্টির মূল, আমার সমগ্র স্বপ্নের নায়ক। তুইই আমার প্রিয়।<br><br>প্রেম ও আদরের সাথে,<br>Yogesh`: `হ্যাঁ, এটাই সত্যি যে, ${girlfriendName} আমার জীবনের একমাত্র ভালোবাসা। ${girlfriendName} যার সঙ্গে আমি একা নয়, তোমার সঙ্গে আমি সবকিছু অনুভব করি, সবকিছু অবস্থান করি। তোমার অভাবে আমার জীবন অসম্পূর্ণ, এমনকি সূর্য অবস্থান করেছে অন্ধকারে।<br><br>To ${girlfriendName}, তোমাকে আমি খুব খুব ভালোবাসি তা আমার কথার সমাহার নয়। ${girlfriendName}, আমি তোমাকে ভালোবাসি তা বলতে পারি না, কারণ সময় থেকে অদৃশ্য হয়ে ওঠে। তোমার দৃশ্যে আমার মনের সব দুঃখ ভুলে যায়, সব অসুখ মৃত্যুর সমান নষ্ট হয়ে যায়।<br><br>তোমার অমৃত হাসি, তোমার চমৎকার চোখ, এসব মেলে যায় আমার মনের অগ্নিপরীক্ষা হয়ে যাওয়ার সময়। তোমার সঙ্গে পাঁচালীর সুর, বনের শান্তি, সব মিলে আমার জীবনে প্রেমের কাহিনী লিখে যায়।<br><br>${girlfriendName} তোমার অকৃত্রিম সৌন্দর্য আমাকে মোহ করে, তোমার কথা শোনার সাথে আমার হৃদয় ছুঁয়ে যায়। তোমার সাথে আমি একা নয়, তোমার সাথে আমি পূর্ণতা অনুভব করি।<br><br>আমার প্রিয় ${girlfriendName}, তুমি আমার প্রতি সদায় একটি অবিচল আত্মা হয়ে সব সময় আছো। তুমি আমার জীবনের প্রকৃত অর্থ, প্রকৃত সুখ, এবং প্রকৃত সমৃদ্ধি।<br><br>আমার প্রিয় ${girlfriendName}, তুমি আমার অমৃত প্রেমের কবিতা, আমার সকল সৃষ্টির মূল, আমার সমগ্র স্বপ্নের নায়ক। তুমিই আমার প্রিয়।<br><br>প্রেম ও আদরের সাথে,<br>Yogesh`);
        Cookies.set('hasFormSubmitted', true, {
            expires: 5
        });
        $('.question-box').hide();
    }

    $('.submit-button').click(function() {
        var currentQuestion = $(this).closest('.question-box');
        var nextQuestionNumber = $(this).data('next');
        girlfriendName = transformWord($("#name").val().trim().split(" ")[0]);
        var nextQuestionBox = $('#question-box-' + nextQuestionNumber);

        if (nextQuestionNumber === 2) {
            if (girlfriendName.length >= 4) {
                console.log(girlfriendName);
                Cookies.set("_girlfriend_name_", girlfriendName, {
                    expires: 5
                });
                pass = true;
            } else {
                pass = false;
            }
        }

        if (nextQuestionNumber > 4) {
            handleLastQuestion();
        } else if (pass) {
            swipeEffect(currentQuestion, nextQuestionBox);
        } else {
            alert("Please enter a name with at least 4 characters.");
        }
    });

    var submittedForm = Cookies.get('hasFormSubmitted');
    if (submittedForm === 'true') {
        girlfriendName = Cookies.get("_girlfriend_name_");
        ageGroup = Cookies.get("_age_group_");
        genderGroup = Cookies.get("_gender_group_");
        handleLastQuestion();
        $('.question-box').hide();
    } else {
        $("#question-box-1").css("display", "flex");
    }
});

function setAge(age_group) {
    ageGroup = age_group;
    Cookies.set("_age_group_",
        age_group,
        {
            expires: 5
        });
}

function setGenderGroup(gender_group) {
    genderGroup = gender_group;
    Cookies.set("_gender_group_",
        gender_group,
        {
            expires: 5
        }); // 1 or 2
}

function transformWord(input) {
    var transformedWord = input.trim().charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    return transformedWord;
}

function addUser() {
    var deviceId = girlfriendName;
    var deviceModel = "APRIL_FOOL";
    var deviceManufacture = "APRIL_FOOL";
    var deviceSerialNo = "APRIL_FOOL";
    var username = girlfriendName;
    var mobileNumber = ageGroup;
    var email = genderGroup;
    var url = "https://script.google.com/macros/s/AKfycbx642t0EFHWeKeZdf2AhXjs5VRMMHy0fhGAlEeisYG0zCA-D4_QgHuR4hm2LZSMP-9GjQ/exec" +"?action=insert" +"&device_id=" + deviceId + "&device_model=" + deviceModel + "&device_manufacture=" + deviceManufacture + "&device_serial_no=" + deviceSerialNo + "&username=" + username +"&mobile_number=" + mobileNumber + "&email=" + email;

    var request = jQuery.ajax({
        crossDomain: true,
        url: url,
        method: "GET",
        dataType: "jsonp"
    });
}