//generate an 11 character youtube video ID.
//It might not be valid...
function getRandomVideoId() {
    var codeLength = 11;
    var possibles = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890-_";
    var code = "";
    for (var i = 0; i < codeLength; i++) {
        code += possibles.charAt(Math.floor(Math.random() * possibles.length));
    }
    return code;
}

var attempts = 0;
var maxAttempts = 100;

$(function() {
    var $attempts = $('#attempts');
    var $tryAgainBtn = $("#try-again");
    var $iframe = $("#yt");
    var $link = $("#out");

    function getNewVideo() {
        attempts++;

        if (attempts <= maxAttempts) {
            var ytId = getRandomVideoId();
            var testUrl = 'https://gdata.youtube.com/feeds/api/videos/' + ytId + '?v=2&alt=jsonc';
            $attempts.append("<div>#" + attempts + ": <a href='" + testUrl + "' target='_blank'>" + ytId + "</a> - <span id='a" + attempts + "' style='color: #CCC;'>Loading...</span>" + "</div>");
            $tryAgainBtn.attr("disabled", true);
            $link.html('').attr('href', '#');
            $iframe.attr('src', '');

            $.ajax({
                url: testUrl,
                timeout: 1000,
                error: function(jqxhr, textStatus, thrownError) {
                    $("#a" + attempts).text(jqxhr.responseJSON.error.message || "Invalid ID!").css('color', 'red');
                    getNewVideo();
                },
                success: function(data, textStatus, jqXhr) {
                    $tryAgainBtn.attr("disabled", false);
                    $("#a" + attempts).text("Valid ID!").css('color', 'green');
                    $link.html('Open video <b>' + ytId + '</b> on YouTube').attr('href', 'https://youtube.com/watch?v=' + ytId);
                    $iframe.attr('src', '//www.youtube.com/embed/' + ytId + '?rel=0&autoplay=1');
                }
            });
        } else {
            $tryAgainBtn.attr("disabled", false);
            $attempts.append("<div>Attempted " + maxAttempts + " videos... stopping.</div>");
        }

        $attempts[0].scrollTop = $attempts[0].scrollHeight;
    }

    getNewVideo();
    $tryAgainBtn.on("click", function() {
        attempts = 0;
        $attempts.empty();
        getNewVideo();
    });
});