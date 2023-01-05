var data = []
$(".search").click(function() {
    $("#result").html("")
    var squery_name = $("#file-name").val()
    var squery_type = $("#file-type").val()
    var squery_sort = $("#sort-by").val()
    var url = `https://filepursuit.p.rapidapi.com/?q=`+squery_name+`&type=`+squery_type+`&sort=`+squery_sort;
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": "GET",
        "headers": {
            "X-RapidAPI-Key": "d75d999194msh3d44beadad8616cp163090jsn5cb53ae5e285",
            "X-RapidAPI-Host": "filepursuit.p.rapidapi.com"
        }
    };

    $.ajax(settings).done(function (response) {
        for (var i = 0; i < response.files_found.length; i++) {
            data.push(response.files_found[i])
        }
        load_data()
    });
})

function load_data() {
    $("#result").append(`<p class="result-amount">Total `+data.length+` amount of data found</p>`)
    for(var i = 0;i<data.length;i++){
        $("#result").append(`<div class="result_card"><p>File ID : <span>`+data[i].file_id+`</span></p><p>File Name : <span>`+data[i].file_name+`</span></p><p>File Type : <span class="file-type">`+data[i].file_type+`</span></p><p>File Size : <span>`+data[i].file_size+`</span></p><p>File Host : <span>`+data[i].referrer_host+`</span></p><p>File Path : <span>`+data[i].readable_path+`</span></p><p>File Link : <a class="file-link" href="`+data[i].file_link+`">`+data[i].file_link+`</a></p><p>Upload Date : <span>`+data[i].date_added+`</span></p><p>Last Update : <span>`+data[i].time_ago+`</span></p></div>`)
    }
}