var isOpen = false;
$("#menu").click(function() {
    $(this).toggleClass("fa-light fa-xmark")
    if (isOpen == false) {
        $(".nav_menu_items").css("max-height", "230px")
        $(this).css("font-size","25px")
        isOpen = true;
    } else {
        $(".nav_menu_items").css("max-height", "0px")
        $(this).css("font-size","20px");
        isOpen = false;
    }
})