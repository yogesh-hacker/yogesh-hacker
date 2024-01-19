var isOpen = false;
$("#menu").click(function() {
    $("#menu-bars").toggleClass("fa-light fa-xmark")
    if (isOpen == false) {
        $(".nav_menu_items").css("max-height", "400px")
        $("#menu-bars").css("font-size", "25px")
        isOpen = true;
    } else {
        $(".nav_menu_items").css("max-height", "0px")
        $("#menu-bars").css("font-size", "20px");
        isOpen = false;
    }
})

var appData = []
$(document).ready(function() {
    $.getJSON("https://yogesh-hacker.github.io/yogesh-hacker/App/data.json", function(data) {
        const rawData = data;
        appData.push(rawData.data[0]);
        loadData()
    });
});


function loadData() {
    $(".app_name").text(appData[0].app_name)
    $(".app_size").text(appData[0].app_size)
    $(".app_version").text(appData[0].latest_version)
    $(".last_update_date").text(appData[0].last_updated_date)
    $(".d_gen").attr("href",
        appData[0].latest_version_src)
}
