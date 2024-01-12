/*function convertToImage() {
    var element = document.getElementById('h2c-canvas');

    html2canvas(element, {
        allowTaint: true, useCORS: true, scale: 8
    }).then(function (canvas) {
        var img = new Image();
        img.src = canvas.toDataURL('image/png');
        console.log(img.src);

        var link = $('#h2c-result-download');
        link.attr("href", img.src);
        link.attr("download", 'myImage.png');
        link.click();
        alert("Done");
    });
}

// Assuming you trigger this function on a button click or some event
$('#convertButton').on('click', function () {
    convertToImage();
});*/

var isGenerated = false;

function convertToImage() {
    var element = document.getElementById('h2c-canvas');

    // Introduce a delay before capturing the screenshot
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
        if(getTypo() != ""){
            $(".h2c-title").html($("#h2c-title-input").val()+`<span class="h2c-movie-quality"><sup>${getTypo()}</sup><span>`);
        }
        else{
            $(".h2c-title").html($("#h2c-title-input").val());
        }
        $(".h2c-poster").attr("src",$("#h2c-poster-input").val());
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
            $("#h2c-canvas").attr("class","theme-normal");
            break;
        case '1':
            $("#h2c-canvas").attr("class","theme-normal");
            break;
        case '2':
            $("#h2c-canvas").attr("class","theme-violence");
            break;
        case '3':
            $("#h2c-canvas").attr("class","theme-aqua");
            break;
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
        default:
            return "";
            break;
    }
}
