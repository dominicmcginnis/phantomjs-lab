$('#tweet-container').scroll(function(){
    //console.log("SCROLLING");
    var tweetmainHeight=$('.tweet_main').height();
    var tweetcontainerHeight=$('#tweet-container').height();
    var tweetscrolltopHeight=$("#tweet-container").scrollTop();
    if(tweetmainHeight <= tweetcontainerHeight + tweetscrolltopHeight + 24) {
        $('#tweet>div:gt(2),#tweet>hr:gt(2)').show();
    }
});
