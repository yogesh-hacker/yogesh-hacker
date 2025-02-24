$(".nav_menu").click(function() {
    $(".nav_items").css("width", "290px")
    $(".canvas").css("display", "block")
})

$(".canvas").click(function() {
    $(".nav_items").css("width", "0px")
    $(".canvas").css("display", "none")
})

$(".cc-13").click(function() {
    window.location.href = "papers/13/";
})

$(".cc-14").click(function() {
    window.location.href = "papers/14/";
})

$(".dse-3").click(function() {
    window.location.href = "papers/3/";
})

$(".dse-4").click(function() {
    window.location.href = "papers/4/";
})

$("#notes-theme").change(function() {
    Cookies.set("_theme_mode_", $(this).val(), {
        expires: 365
    })
})

$("#answer-collapse").change(function() {
    Cookies.set("_is_collapse_enabled", $(this).val(), {
        expires: 365
    })
})

$("#question-font-family").change(function() {
    Cookies.set("_question_font_family", $(this).val(), {
        expires: 365
    })
})

$("#answer-font-family").change(function() {
    Cookies.set("_answer_font_family", $(this).val(), {
        expires: 365
    })
})


var themeMode = Cookies.get("_theme_mode_");
var collapseAnswer = Cookies.get("_is_collapse_enabled");
var questionFontFamily = Cookies.get('_question_font_family');
var answerFontFamily = Cookies.get("_answer_font_family");

if (themeMode) {
    $("#notes-theme").val(themeMode);
}

if (collapseAnswer) {
    $("#answer-collapse").val(collapseAnswer);
}

if (questionFontFamily) {
    $("#question-font-family").val(questionFontFamily);
}

if (answerFontFamily) {
    $("#answer-font-family").val(answerFontFamily);
}

$(".notes-page-settings-canvas").click(function() {
    $(".notes-page-settings-container").hide();
})

$("#notes-page-setting").click(function() {
    $(".notes-page-settings-container").show();
})
