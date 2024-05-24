const advanced = {
    init: function() {
        console.log('advanced.init() has been called.');
      function hideAds() {
    const ads = document.getElementsByClassName("ytp-ad-text");
    const overlays = document.getElementsByClassName("ytp-ad-overlay-close-button");
    const playNextButton = document.querySelector('.playnext-button a');

    if (ads.length > 0) {
        const video = document.getElementsByClassName("video-stream html5-main-video")[0];
        if (video) {
            video.currentTime = video.duration;
        }
        const video1 = document.getElementsByClassName("video-stream html5-main-video")[1];
        if (video1) {
            video1.currentTime = video1.duration;
        }
    }

    if (overlays.length > 0) {
        overlays[0].click();
        if (overlays[1]) overlays[1].click();
    }
    if (playNextButton) {
        playNextButton.click();
    }
}

const observer = new MutationObserver(hideAds);
observer.observe(document.body, {
    childList: true, subtree: true
});
    }
};
