var tweetContent = $('#tweetContent').html();
var tweetContentArr = tweetContent.split('<div><div class="profile_icon">');

var index = 1;

$(document).ready(function() {
	$("#tweet").html('');
	loadNextTweets();	
});

function loadNextTweets() {
	var content = $("#tweet").html();
	var i = 1;
	while(i <= 5 && index <= 20) {
		content += '<div><div class="profile_icon">' + tweetContentArr[index];
		index++;
		i++;
	}
	if(content.length) {
	    $("#tweet").html(content.replace("-->", ""));//.trim("-->");
	}
} 

$('#tweet-container').scroll(function() {
	loadNextTweets();
});

var setTweetContent = function(str) {
	tweetContent = str;
}