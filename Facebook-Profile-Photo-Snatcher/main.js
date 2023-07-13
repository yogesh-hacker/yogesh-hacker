var BASE_URL = "https://graph.facebook.com/";
var ACCESS_TOKEN = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
var mPhotoWidth, mPhotoHeight


$(".parse").click(function() {
    var mFacebookIDRaw = $(".fb_id").val().trim();
    mPhotoWidth = $(".width").val();
    mPhotoHeight = $(".height").val();
    $(".result").css("transition-duration", "0.5s")
    $(".result").css("max-height", "0px");
    $(".result").css("src", "");
    if (mFacebookIDRaw != "" && mFacebookIDRaw != null) {
        var mFacebookID = parseId($(".fb_id").val());
        if (mPhotoWidth != "" && mPhotoHeight != "" && mPhotoWidth != null && mPhotoHeight) {
            setTimeout(function() {
                $(".result").css("transition-duration", "3s")
                snatchProfilePhoto(mFacebookID)
            }, 3000);
        } else {
            alert("Please enter a valid resolution!")
        }
    } else {
        alert("Please enter a valid URL/ID")
    }
});

function parseId(url) {
    var mFB_ID;

    if (url.includes("id")) {
        var mUrl = new URL(url);
        var mSearchParams = new URLSearchParams(mUrl.search);
        mFB_ID = mSearchParams.get('id');
    } else {
        mFB_ID = url;
    }

    return mFB_ID;
}


function snatchProfilePhoto(id) {
    var mURLConstructed = BASE_URL + id + "/picture?width="+mPhotoWidth+"&height="+mPhotoHeight+"&redirect=1&access_token="+ACCESS_TOKEN;

    $(".result").attr("src", mURLConstructed)
    $(".result").css("max-height", "1000px");
}

$("#default_options").change(function() {
    var mResolution = $(this).val();
    $(".width").val(mResolution.split(":")[0]);
    $(".height").val(mResolution.split(":")[1]);
})