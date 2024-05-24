const advanced = {
    init: function() {
        console.log('advanced.init() has been called.');

        function hideAds() {
            const ads = document.getElementsByClassName("ytp-ad-text");
            const overlays = document.getElementsByClassName("ytp-ad-overlay-close-button");
            const playNextButton = document.querySelector('.playnext-button a');

            if (ads.length > 0) {
                const videos = document.getElementsByClassName("video-stream html5-main-video");
                for (let i = 0; i < videos.length; i++) {
                    if (videos[i]) {
                        videos[i].currentTime = videos[i].duration;
                    }
                }
            }

            for (let i = 0; i < overlays.length; i++) {
                overlays[i].click();
            }

            if (playNextButton) {
                playNextButton.click();
            }
        }

        const observer = new MutationObserver(hideAds);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/eruda";
        document.body.appendChild(script);
        script.onload = function() {
            eruda.init();
        };
    }
};
