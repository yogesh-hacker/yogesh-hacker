var mResultContainer = $("#ytdl-result");
var mVideoInfoContainer = $(".ytdl-result-video-info");
var mVideoDownloadQualitiesContainer = $(".ytdl-result-video-downloads");

$(document).ready(function () {
    $('#ytdl-download').on('click', function () {
        const mInputUrl = $('#ytdl-url-input').val();

        const settings = {
            async: true,
            crossDomain: true,
            url: 'https://youtube86.p.rapidapi.com/api/youtube/links',
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-Forwarded-For': '70.41.3.18',
                'X-RapidAPI-Key': 'd75d999194msh3d44beadad8616cp163090jsn5cb53ae5e285',
                'X-RapidAPI-Host': 'youtube86.p.rapidapi.com'
            },
            processData: false,
            data: JSON.stringify({
                "url": mInputUrl
            })
        };

        $.ajax(settings).done(function (response) {
            showDownloadOptions(response[0]);
        });
    });
});

function showDownloadOptions(response) {
    console.log(response)
    $(mVideoInfoContainer).append("<div class='ytdl-result-video-info-thumbnail-container'><img src='"+response.pictureUrl+"'/><span>"+response.meta.duration+"</span></div><h2>"+response.meta.title+"</h3>");
    var serializedQualities = ["144",
        "240",
        "360",
        "480",
        "720",
        "1080",
        "1440",
        "2160"];

    for (var i = 0; i < serializedQualities.length; i++) {
        // Find the corresponding URL based on the serialized order
        console.log
        var correspondingURL = response.urls.find(url => url.quality === serializedQualities[i]);

        if (correspondingURL) {
            $(mVideoDownloadQualitiesContainer).append(`
                <div class="ytdl-video-download-quality-container">
                <p class="ytdl-video-download-quality">${correspondingURL.quality}p</p>
                <p class="ytdl-video-download-quality-format">${correspondingURL.extension}</p>
                <p class="ytdl-video-download-quality-size">30.0MB</p>
                <a class="ytdl-video-download" href="${correspondingURL.url}" download="${response.meta.title}">Download</button>
                </div>
                `);
        }
    }

}