// twitter.js - Twitter timeline for Gruppled LockInfo
//
// Author: Takuo Kitame <kitame at gmail.com> 
// Copyright 2009 Takuo Kitame.
// http://github.com/takuo/
//
var twitterTimestamp;

function updateTwitter(){
	if (!twitterDIV) return;
	window.clearTimeout(document.getElementById("twitter_timestamp").timer);
	document.getElementById("twitter_timestamp").innerHTML = "...";
	twitterRefresherTemp();
}

function fetchTwitter (url, div, retryCount) {
	var xmlReq = new XMLHttpRequest();
	var countDIV = document.getElementById(div.counterid);
	var timeout = 7500;
	var timeout_func = function(){
                if (xmlReq.readyState == 0 || xmlReq.readyState == 4) return;
                if (retryCount < twitterRetriesMax && twitterRetryInterval) {
                        countDIV.innerHTML = ++retryCount + '/' + twitterRetriesMax + '...';
                        div.timer = window.setTimeout(fetchTwitter, twitterRetryInterval*1000 * 60, url, div, retryCount);
                } else if  ( retryCount >= twitterRetriesMax ) {
                         countDIV.innerHTML = 'Error';  
                } else {
                         countDIV.innerHTML = 'Something wrong';
                }
        };

	countDIV.innerHTML = '...';
	window.clearTimeout(div.timer);
	xmlReq.onreadystatechange = function(e) {
		if (xmlReq.readyState != 4) return;
		if (xmlReq.responseText.length > 0 && xmlReq.status == 200) {
			var twit = eval('(' + xmlReq.responseText + ')');
			updateTwitterDIV(div, twit);
		} else {
			// some errors
			counterDIV.innerHTML = 'Error: code:'+xmlReq.status;
		}
	};
	xmlReq.open("GET", url, true, twitter_username, twitter_password);
	xmlReq.send(null);
	setTimeout(timeout_func, timeout);
}

function updateTwitterDIV(div, twit)
{
	if (!div)
		div = this;
	if (!twit) {
		if (div.previous)
			twit = div.previous;
		else
			return false;
	}

	clearRelativeTimers(div);
	var counterDIV = document.getElementById(div.counterid);
	if(!twit.error && twit.length) {
		div.previous = twit;
		if(globalHide >= 0){
			twitterDIV.style.display = "block";
			div.style.display = "block";
		}
		removeClass(twitterDIV, "empty");
		removeClass(div, "empty");
		var relativeTimes = []; 
		var now = new Date();
		if (document.getElementById(div.id+"_tweets"))
		document.getElementById(div.id+"_tweets").parentNode.removeChild(document.getElementById(div.id+"_tweets"));
		var html = "<div id='" + div.id + "_tweets'>";
		var tmp = []
		for(var i=0; i<twit.length; i++) {
			var date = new Date(twit[i].created_at);
			if((now-date.getTime())/1000 > div.since * 60)
				continue;
			tmp.push(twit[i]);
		}
		twit = tmp;

		for(var i=0; i<twit.length && i < div.limit; i++) {
			var date = new Date(twit[i].created_at);
			var screen_name = twit[i]['sender_screen_name'] ?  twit[i]['sender_screen_name'] : twit[i].user.screen_name;
			html += "<div  class='sub"+ (i % 2 ? " alt" : "") + "'>";
			html += "<span class='sub1 tweet'>" + twit[i].text +"</span>";
			html += "<div style='text-align:right;' class='sub2 twinfo'><span class='sub2 who'>" + screen_name +" &ndash; "  + date.format(date.isSameDay() ? format_time : format_date_time_short) + "</span>";
			if(displayRelativeTimes){
				var key = div.id + "_time_" + twit[i].id;
				html += " (<span id='" + key +"'> </span>)";
				relativeTimes.push([key, date]);
			}
			html += "</div></div>";
		}
		div.lastChild.innerHTML = html + "</div>";
		for(i = 0; i < relativeTimes.length; i++){
			relativeTime(div, relativeTimes[i][0], relativeTimes[i][1], false, false, string_justNow);
		}
		if (twit.length > div.limit) {
			addLoadMoreBar(div);
		}
		counterDIV.innerHTML = twit.length;
		document.getElementById(counterDIV.id + "_h").innerHTML = twit.length;
		if(collapsed[div.id]){
			collapsed[div.id] = false;
			toggleSection([div, true]);
		}
		if(collapsed[twitterDIV.id]) {
			collapsed[twitterDIV.id] = false;
			toggleSection([twitterDIV, true]);
		}
		if ( twit.length == 0 ) {
			addClass(div, 'empty');
			div.style.display = 'none';
		}
	} else if(twit.error) {

	}
}

function twitterRefresherTemp(){
	window.clearTimeout(document.getElementById("twitter_timestamp").timer);
	window.clearTimeout(twitterDIV.timer);
	document.getElementById("twitter_timestamp").innerHTML = "...";
	
	fetchTwitter("http://twitter.com/statuses/mentions.json?count="+twitter_ment_nb, twMentionsDIV, 0);
	fetchTwitter("http://twitter.com/statuses/home_timeline.json?count="+twitter_tl_nb, twFriendDIV, 0);
	fetchTwitter("http://twitter.com/direct_messages.json?count="+twitter_dm_nb, twDirectDIV, 0);

	twitterTimestamp = new Date();
	relativeTime(twitterDIV, 'twitter_timestamp', twitterTimestamp, false, true, string_JustUpdated);
	if (twitterInterval){
		twitterDIV.timer = window.setTimeout(twitterRefresherTemp, 60 * 1000 * twitterInterval);
	}
}
