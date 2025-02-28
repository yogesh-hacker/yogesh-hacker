$(".nav_menu").click(function() {
    $(".nav_items").css("width", "290px")
    $(".canvas").css("display", "block")
})

$(".canvas").click(function() {
    $(".nav_items").css("width", "0px")
    $(".canvas").css("display", "none")
})

$(".cc-8").click(function() {
    window.location.href = "https://yogesh-hacker.github.io/yogesh-hacker/semester/4/notes/papers/8/";
})

$(".cc-9").click(function() {
    window.location.href = "https://yogesh-hacker.github.io/yogesh-hacker/semester/4/notes/papers/9/";
})

$(".cc-10").click(function() {
    window.location.href = "https://yogesh-hacker.github.io/yogesh-hacker/semester/4/notes/papers/10/";
})

$(".sec-2").click(function() {
    window.location.href = "https://yogesh-hacker.github.io/yogesh-hacker/semester/4/notes/papers/2/";
})


function showData(paper_id) {
    $(".books-container").html("");
    if (data.length != 0) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].item_paper_id === "CC_"+paper_id) {
                $(".books-container").append(`<div class="item">
                    <img src="covers/`+data[i].item_cover+`" alt="" />
                    <p>`+data[i].item_title+`</p>
                    <a class="viewOrDownload" href="`+data[i].item_source+`">View or Download</a>
                    </div>`)
            } else if (paper_id == 0) {
                $(".books-container").append(`<div class="item">
                    <img src="covers/`+data[i].item_cover+`" alt="" />
                    <p>`+data[i].item_title+`</p>
                    <a class="viewOrDownload" href="`+data[i].item_source+`">View or Download</a>
                    </div>`)
            }
        }
    } else {
        $(".books-container").append("<p class='data-error'>No books available, Check Back Later!</p>")
    }
}
showData(0);

$("#filter-by-paper").change(function() {
    showData($(this).val());
})

$("#clear-search").hide();

$("#clear-search").on("click", function(e) {
    e.preventDefault();
    $("#search-input").val('');
    $(this).hide();
    $(".books-container .item").show();
});

$("#search-input").on("keyup", function() {
    let searchTerm = $(this).val().trim().toLowerCase().replace(/[^a-z0-9\s]/gi, '');

    if (searchTerm.length > 0) {
        $("#clear-search").show();
    } else {
        $("#clear-search").hide();
    }

    $(".books-container .item").each(function() {
        let itemTitle = $(this).find("p").text().toLowerCase().replace(/[^a-z0-9\s]/gi, '');
        if (itemTitle.includes(searchTerm)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
});
