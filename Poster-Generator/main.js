var isGenerated = false;
var __custom_typo__, __image_url__;

function convertToImage() {
    var element = document.getElementById('h2c-canvas');

    setTimeout(function () {
        html2canvas(element, {
            allowTaint: true,
            useCORS: true,
            scale: 10
        }).then(function (canvas) {
            canvas.toBlob(function (blob) {
                var link = document.getElementById('h2c-result-download');
                var imgURL = URL.createObjectURL(blob);
                link.href = imgURL;
                link.download = generateFileName();
                link.click();
                $(".h2c-status").text("Downloading...");

                // Revoke the object URL after some time
                setTimeout(function () {
                    URL.revokeObjectURL(imgURL);
                    $(".h2c-status").text("");
                }, 1000);
            }, 'image/png');
        });
    }, 1000);
}


$('#convertButton').click(function () {
    if (isGenerated) {
        $(".h2c-status").text("Converting...");
        setTimeout(convertToImage(), 1000);
    } else {
        $(".h2c-status").text("Generating...");
        $(".h2c-title").html($("#h2c-title-input").val()+`<span class="h2c-movie-quality"><sup>${getTypo()}</sup><span>`);
        $(".h2c-poster").attr("src", $("#h2c-poster-input").val());
        setTheme();
        setTimeout(function() {
            $("#convertButton").text("Convert to Image")
            $(".h2c-status").text("Generated");
            setTimeout(function() {
                $(".h2c-status").text("");
            }, 1000);
        }, 2000);
        isGenerated = true;
    }
});

$("#movie-typo").change(function() {
    if ($(this).val() === "7") {
        var customTypo = prompt("Add your custom typo:", "");

        if (customTypo !== null) {
            __custom_typo__ = customTypo;
        } else {
            alert("No custom typo added.");
        }
    }
});

$("#movie-poster-theme").change(function() {
    if ($(this).val() === "6") {
        var imageUrl = prompt("Enter a Image URL:", "");

        if (imageUrl !== null) {
            __image_url__ = imageUrl;
        } else {
            alert("No Image URL Added");
        }
    }
});


function generateFileName() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2,
        '0');
    const day = String(now.getDate()).padStart(2,
        '0');
    const hours = String(now.getHours()).padStart(2,
        '0');
    const minutes = String(now.getMinutes()).padStart(2,
        '0');

    const fileName = `IMG_${year}_${month}_${day}_${hours}_${minutes}.png`;

    return fileName;
}

function setTheme() {
    var __theme__ = $("#movie-poster-theme").val();
    switch (__theme__) {
        case 'null':
            $("#h2c-canvas").attr("class",
                "theme-normal");
            break;
        case '1':
            $("#h2c-canvas").attr("class",
                "theme-normal");
            break;
        case '2':
            $("#h2c-canvas").attr("class",
                "theme-violence");
            break;
        case '3':
            $("#h2c-canvas").attr("class",
                "theme-aqua");
            break;
        case '4':
            $("#h2c-canvas").attr("class",
                "theme-gold");
            break;
        case '5':
            $("#h2c-canvas").attr("class",
                "theme-nature");
            break;
        case '6':
            if(__image_url__){
                setBlurBackground(__image_url__);
            }
        default:
            // code
            break;
    }
}

function getTypo() {
    var __typo__ = $("#movie-typo").val();
    switch (__typo__) {
        case '1':
            return "";
            break;
        case '2':
            return "On•Demand"
            break;
        case '3':
            return "WEB-DL"
            break;
        case '4':
            return "UHD"
            break;
        case '5':
            return "FHD"
            break;
        case '6':
            return "HD"
            break;
        case '7':
            return __custom_typo__
            break;
        default:
            return null;
            break;
    }
}

function setBlurBackground(imageUrl) {
    var canvas = $("#h2c-canvas");
    $(canvas).css("background", "none");

    // Create background wrapper if missing
    if ($("#h2c-bg").length === 0) {
        canvas.prepend('<div id="h2c-bg"></div>');
    }

    var bg = $("#h2c-bg");
    bg.css({
        "background-image": `url(${imageUrl})`,
        "background-size": "cover",
        "background-position": "center",
        "filter": "blur(1px) brightness(0.8)",
        "position": "absolute",
        "top": 0,
        "left": 0,
        "width": "100%",
        "height": "100%",
        "z-index": "-1",
        "border-radius": "12px"
    });
}