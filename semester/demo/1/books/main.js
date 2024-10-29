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
            // Construct the poem number for the URL
            var poemNumber = i + 1; // Assuming the index starts from 0, so +1 gives the correct poem number
            var itemSource = `https://script.google.com/macros/s/AKfycbxuqfE5hs6fz38VdHpiQCLlrypDXiatvS959qAxruBvt0rILiVb23JaWOlyjav8zZwX/exec?poem_no=${poemNumber}`; // Adjust script_url to your actual URL

            if (data[i].item_paper_id === "CC_" + paper_id) {
                $(".books-container").append(`<div class="item">
                    <img src="book_cover.png" alt="" />
                    <p>` + data[i].title + `</p>
                    <a class="viewOrDownload" href="` + itemSource + `">View or Download</a>
                    </div>`)
            } else if (paper_id == 0) {
                $(".books-container").append(`<div class="item">
                    <img src="book_cover.png" alt="" />
                    <p>` + data[i].title + `</p>
                    <a class="viewOrDownload" href="` + itemSource + `">View or Download</a>
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