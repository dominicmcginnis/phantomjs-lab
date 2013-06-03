//Expanding on the page loading test, this time we'll evaluate some script on the page as it comes in
//We need to load (require) the webpage module and then create it as an object
var page = require('webpage').create();
var page2 = require('webpage').create();
var fs = require('fs');

var outputFile = fs.workingDirectory + fs.separator + 'output' + fs.separator + 'FavoriteTweets.html';
var tweetsFile = fs.workingDirectory + fs.separator + 'resources' + fs.separator + 'StubHubFavoriteTweets.js';
var twitterFavsFrame = fs.workingDirectory + fs.separator + 'resources' + fs.separator + 'twitterFavoritesFrame.html';
var jqueryLib = fs.workingDirectory + fs.separator + 'lib' + fs.separator + 'jquery.1.6.1.min.js';

var buildTwitterFrame = function(twitterJson, formatTwitString, relative_time) {
    $(".tweet-follow").html($("#twitter-footer-src").html()).css({'display':'block','float':'left','margin-right':'20px'});
    var data = twitterJson;
    var htmlContent = "";
    for (var i = 0, j = data.length; i < j; i++) {
        htmlContent += '<div><div class="profile_icon">' + '<a href="http://twitter.com/' + data[i].user.screen_name + '" target="_blank"><img src="' + data[i].user.profile_image_url + '" width="42" height="42" alt="Twitter"></a></div><div class="profile_details"><div>' + '<span class="user"><a href="http://twitter.com/' + data[i].user.screen_name + '" target="_blank">' + data[i].user.name + '</a></span> ' + formatTwitString(data[i].text) + '</div>' + '<div id="web_intent" style="color:#2075c2;">' + '<a href="http://twitter.com/' + data[i].user.screen_name + '/statuses/' + data[i].id_str + '" target="_blank">' + relative_time(data[i].created_at) + '</a><span class="time">.</span>' + '<a href="http://twitter.com/intent/tweet?in_reply_to=' + data[i].id_str + '" target="_blank">' + 'reply</a><span class="time">.</span>' + '<a href="http://twitter.com/intent/retweet?tweet_id=' + data[i].id_str + '" target="_blank">' + 'retweet</a><span class="time">.</span>' + '<a href="http://twitter.com/intent/favorite?tweet_id=' + data[i].id_str + '" target="_blank">' + 'favorites</a>' + '</div></div></div>' + '<hr>'
    }
    $("#tweet").html(htmlContent);
    $("#tweet>div,#tweet>hr").each(function() {
       $("#tweet>div:gt(2),#tweet>hr:gt(2)").hide();
    });
}

var relative_time = function (time_value) {
    var values = time_value.split(" ");
    time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
    var parsed_date = Date.parse(time_value);
    var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
    var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
    delta = delta + (relative_to.getTimezoneOffset() * 60);

    var r = '';
    if (delta < 60) {
        r = 'a minute ago';
    } else if (delta < 120) {
        r = 'couple of minutes ago';
    } else if (delta < (45 * 60)) {
        r = (parseInt(delta / 60)).toString() + ' minutes ago';
    } else if (delta < (90 * 60)) {
        r = 'an hour ago';
    } else if (delta < (24 * 60 * 60)) {
        r = '' + (parseInt(delta / 3600)).toString() + ' hours ago';
    } else if (delta < (48 * 60 * 60)) {
        r = '1 day ago';
    } else {
        r = (parseInt(delta / 86400)).toString() + ' days ago';
    }

    return r;
}

var formatTwitString = function (str) {
    var text = str.replace(/(https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/, function (u) {

        var shortUrl = (u.length > 30) ? u.substr(0, 30) + '...' : u;
        return '<a href="' + u + '" title="Click to view this link"> target="_blank"' + shortUrl + '</a>';
    })
        .replace(/@([a-zA-Z0-9_]+)/g, '@<a href="http://twitter.com/$1" title="Click to view $1 on Twitter" target="_blank">$1</a>')
        .replace(/(?:^|\s)#([^\s\.\+:!]+)/g, function (a, u) {
        return ' <a href="http://twitter.com/search?q=' + encodeURIComponent(u) + '" title="Click to view this on Twitter" target="_blank">#' + u + '</a>';
    });
    return text;
}

page2.onConsoleMessage = function (msg){
    console.log(msg);     
};  

function buildTweets (tweets, buildTwitterFrame, formatTwitString, relative_time) {
    console.log("Building tweets");
    page2.open(twitterFavsFrame, function (status) {
        // Check for page load success
        if (status !== "success") {
            console.log("Could not open file: " + twitterFavsFrame);
        } else {
            console.log("Evaluating twitter frame");
            if(page2.injectJs(jqueryLib)) {
                page2.evaluate( function(tweets, buildTwitterFrame, formatTwitString, relative_time) {
                    console.log("Injected Jquery for usage");
                    buildTwitterFrame(tweets, formatTwitString, relative_time);                
                }, tweets, buildTwitterFrame, formatTwitString, relative_time);

                console.log("Writing final file");
                var file = fs.open(outputFile, "w");
                file.write(page2.content);
                file.close();
            }
        }
        phantom.exit();
    });
}

page.open(tweetsFile, function (status) {

    // Check for page load success
    if (status !== "success") {
        console.log("Could not open file: " + tweetsFile);
    } else {
        //Get the result from the request page and convert to a JSON object
        var jsonSource = page.plainText;
        console.log("Parsing JSON source");
        var resultObject = JSON.parse(jsonSource);

        buildTweets(resultObject, buildTwitterFrame, formatTwitString, relative_time);

    }
});
 

