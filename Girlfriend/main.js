var mGirlfriendName;
var mAgeGroup;
var pass;

$(document).ready(function() {
    function swipeEffect(currentQuestion, nextQuestionBox) {
        currentQuestion.addClass('swipe-out').delay(500).hide(0, function() {
            nextQuestionBox.removeClass('swipe-out').css("display", "flex");
        });
    }

    function handleLastQuestion() { 
        isTarget = mGirlfriendName.toLowerCase() == "sanchita" || mGirlfriendName.toLowerCase() == "sonchita";
        if (!isTarget) {
                $("#april-fool")[0].play();
        }
        $(".girlfriend-name-reveal-box").css("display", "flex");
        $("#name-container").html(`I Love You <span>${mGirlfriendName}</span>`);
        if (mAgeGroup == 1) {
            $("#reveal-description").html(`হ্যাঁ, এটাই সত্যি যে, ${mGirlfriendName} আমার জীবনের একমাত্র ভালোবাসা। ${mGirlfriendName} যার সঙ্গে আমি একা নয়, তোর সঙ্গে আমি সবকিছু অনুভব করি, সবকিছু অবস্থান করি। তোর অভাবে আমার জীবন অসম্পূর্ণ, এমনকি সূর্য অবস্থান করেছে অন্ধকারে।<br><br>To ${mGirlfriendName}, তোকে আমি খুব খুব ভালোবাসি তা আমার কথার সমাহার নয়। ${mGirlfriendName}, আমি তোকে ভালোবাসি তা বলতে পারি না, কারণ সময় থেকে অদৃশ্য হয়ে ওঠে। তোর দৃশ্যে আমার মনের সব দুঃখ ভুলে যায়, সব অসুখ মৃত্যুর সমান নষ্ট হয়ে যায়।<br><br>তোর অমৃত হাসি, তোর চমৎকার চোখ, এসব মেলে যায় আমার মনের অগ্নিপরীক্ষা হয়ে যাওয়ার সময়। তোর সঙ্গে পাঁচালীর সুর, বনের শান্তি, সব মিলে আমার জীবনে প্রেমের কাহিনী লিখে যায়।<br><br>${mGirlfriendName} তোর অকৃত্রিম সৌন্দর্য আমাকে মোহ করে, তোর কথা শোনার সাথে আমার হৃদয় ছুঁয়ে যায়। তোর সাথে আমি একা নয়, তোর সাথে আমি পূর্ণতা অনুভব করি।<br><br>আমার প্রিয় ${mGirlfriendName}, তুই আমার প্রতি সদায় একটি অবিচল আত্মা হয়ে সব সময় আছিস। তুই আমার জীবনের প্রকৃত অর্থ, প্রকৃত সুখ, এবং প্রকৃত সমৃদ্ধি।<br><br>আমার প্রিয় ${mGirlfriendName}, তুই আমার অমৃত প্রেমের কবিতা, আমার সকল সৃষ্টির মূল, আমার সমগ্র স্বপ্নের নায়ক। তুইই আমার প্রিয়।<br><br>প্রেম ও আদরের সাথে,<br>Yogesh Kumar Jamre`);
        } else if (mAgeGroup == 2) {
            $("#reveal-description").html(`হ্যাঁ, এটাই সত্যি যে, ${mGirlfriendName} আমার জীবনের একমাত্র ভালোবাসা। ${mGirlfriendName} যার সঙ্গে আমি একা নয়, তোমার সঙ্গে আমি সবকিছু অনুভব করি, সবকিছু অবস্থান করি। তোমার অভাবে আমার জীবন অসম্পূর্ণ, এমনকি সূর্য অবস্থান করেছে অন্ধকারে।<br><br>To ${mGirlfriendName}, তোমাকে আমি খুব খুব ভালোবাসি তা আমার কথার সমাহার নয়। ${mGirlfriendName}, আমি তোমাকে ভালোবাসি তা বলতে পারি না, কারণ সময় থেকে অদৃশ্য হয়ে ওঠে। তোমার দৃশ্যে আমার মনের সব দুঃখ ভুলে যায়, সব অসুখ মৃত্যুর সমান নষ্ট হয়ে যায়।<br><br>তোমার অমৃত হাসি, তোমার চমৎকার চোখ, এসব মেলে যায় আমার মনের অগ্নিপরীক্ষা হয়ে যাওয়ার সময়। তোমার সঙ্গে পাঁচালীর সুর, বনের শান্তি, সব মিলে আমার জীবনে প্রেমের কাহিনী লিখে যায়।<br><br>${mGirlfriendName} তোমার অকৃত্রিম সৌন্দর্য আমাকে মোহ করে, তোমার কথা শোনার সাথে আমার হৃদয় ছুঁয়ে যায়। তোমার সাথে আমি একা নয়, তোমার সাথে আমি পূর্ণতা অনুভব করি।<br><br>আমার প্রিয় ${mGirlfriendName}, তুমি আমার প্রতি সদায় একটি অবিচল আত্মা হয়ে সব সময় আছো। তুমি আমার জীবনের প্রকৃত অর্থ, প্রকৃত সুখ, এবং প্রকৃত সমৃদ্ধি।<br><br>আমার প্রিয় ${mGirlfriendName}, তুমি আমার অমৃত প্রেমের কবিতা, আমার সকল সৃষ্টির মূল, আমার সমগ্র স্বপ্নের নায়ক। তুমিই আমার প্রিয়।<br><br>প্রেম ও আদরের সাথে,<br>Yogesh Kumar Jamre`);
        }
        Cookies.set('hasFormSubmitted', true);
        $('.question-box').hide();
        $('#message').show();
    }

    $('.submit-button').click(function() {
        var currentQuestion = $(this).closest('.question-box');
        var nextQuestionNumber = $(this).data('next');
        mGirlfriendName = $("#name").val().trim()
        var nextQuestionBox = $('#question-box-' + nextQuestionNumber);

        if (nextQuestionNumber == 2) {
            if (mGirlfriendName.length >= 4) {
                Cookies.set("_girlfriend_name_", mGirlfriendName);
                pass = true;
            }if (mGirlfriendName.length < 4) {
                pass = false
            }
        }

        if (nextQuestionNumber > 3) {
            handleLastQuestion();
        } else if (pass) {
            swipeEffect(currentQuestion, nextQuestionBox);
        }else{
            alert("Wrong Name!")
        }
    });

    var submittedForm = Cookies.get('hasFormSubmitted');
    if (submittedForm === 'true') {
        mGirlfriendName = Cookies.get("_girlfriend_name_");
        mAgeGroup = Cookies.get("_age_group_");
        handleLastQuestion();
        console.log("User has submitted the form before.");
        // Example action: hide question boxes and show a message
        $('.question-box').hide();
    } else {
        $("#question-box-1").css("display", "flex");
    }
});

function setAge(age_group) {
    mAgeGroup = age_group;
    Cookies.set("_age_group_",
        age_group)
}