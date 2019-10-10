var prevToken = "";
var nextToken = "";

function fetchVideos(pageToken) {
    $("#videos").html(""); 
    console.log("LOADED PAGE")
    let apiKey = "AIzaSyBEKRpwMNShKz2oDybICkSvW2ChBd1BOHY";
    let term = $("#searchTerm").val();
    let url = "https://www.googleapis.com/youtube/v3/search";

    $.ajax({
        url: url,
        data: {
            part: "snippet",
            q: term,
            key: apiKey,
            maxResults: 10,
            pageToken: pageToken,
        },
        method: "GET",
        dataType: "json",
        success: function(responseJSON) {
            console.log(responseJSON);
            responseJSON.items.forEach((el) => {
                let youtubeUrl = "https://www.youtube.com/watch?v=" + el.id.videoId;
                $("#videos").append(`<li> 
                                        <div>
                                            <h3><a href=${youtubeUrl} target="_blank">${el.snippet.title}</a></h3>
                                            <a href=${youtubeUrl} target="_blank"><img src="${el.snippet.thumbnails.medium.url}" /></a>
                                        </div>
                                    </li>
                                    <hr>`
                                );
            });
            let nextPageButton = $("<button type='submit' class='nextButton'>Next Page</button>");
            let prevPageButton = $("<button type='submit' class='prevButton'>Previous Page</button>");

            if(pageToken != "") {
                prevToken = responseJSON.prevPageToken;
                $("#videos").append(prevPageButton, nextPageButton);
            } else {
                prevToken = "";
                $("#videos").append(nextPageButton);
            }
            nextToken = responseJSON.nextPageToken;
        },
        error: function(err) {
            console.log(err);
        }
    });
}

$("#videosForm").on("submit", function(e) {
    e.preventDefault();

    if ($("#searchTerm").val() == "") {
        $("#videos").html("");
        console.log("ERROR: no search term");
    } else {
        fetchVideos("");
    }
});

$("ul").on("click", ".nextButton", (e) => {
    e.preventDefault();
    fetchVideos(nextToken);
    return;
});

$("ul").on("click", ".prevButton", (e) => {
    e.preventDefault();
    fetchVideos(prevToken);
    return;
});