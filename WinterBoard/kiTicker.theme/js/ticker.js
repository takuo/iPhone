//
// ticker.js
//
// Copyright 2009 (C) Takuo Kitame <kitame a gmail.com>
// http://github.com/takuo/iPhone.git/WinterBoard/kiTicker.theme/
//
//

function getElementStyle(elemID, IEStyleProp, CSSStyleProp){
	var elem;
	if(typeof(elemID) == "string"){
		elem = document.getElementById(elemID);
	}else{
		elem = elemID;
	}
	if(elem.currentStyle){
		return elem.currentStyle[IEStyleProp];
	}else if(window.getComputedStyle){
		var compStyle = window.getComputedStyle(elem, "");
		return compStyle.getPropertyValue(CSSStyleProp);
	}
}

//
// horizontal scroll, it eats many cpu load.
//
function hticker(msgs, len, time, id){
	var base = document.getElementById(id);
	var stylePosition = getElementStyle(base, "position", "position");
	if(stylePosition == "" || stylePosition == "static"){
		base.style.position = "relative";
	}
	var styleWidth = getElementStyle(base, "width", "width");
	if(styleWidth == "" || styleWidth == "auto"){
		base.style.width = "100%";
	}
	base.style.overflow = 'hidden';
	if (document.getElementById(id + '_msg'))
		base.removeChild(document.getElementById(id + '_msg'));
	var msg = document.createElement("span");
	msg.id = id + '_msg';
	base.appendChild(msg);
	msg.style.position = "relative";
	msg.style.left = base.offsetWidth + "px";
	msg.style.whiteSpace = "nowrap";
	var i = 0;
	msg.innerHTML = msgs[i];
	if (base.timer)
		clearInterval(base.timer);


	var move = function(){
		var cur = parseInt(msg.style.left);
		if(cur < -(msg.offsetWidth)){
			cur = base.offsetWidth + 1;
			msg.style.left = cur + "px";
			if(++i >= msgs.length) i = 0;
			msg.innerHTML = msgs[i];
		}
		if(cur > base.offsetWidth){
			msg.style.left = base.offsetWidth + "px";
		}else{
			msg.style.left = (cur - len) + "px";
		}
	};
	base.timer = setInterval(move, time);
}


//
// vertical and pause text , eats less cpu load.
//
//
function vticker(msgs, len, time, id){
	var base = document.getElementById(id);
	var stylePosition = getElementStyle(base, "position", "position");

	if(stylePosition == "" || stylePosition == "static"){
		base.style.position = "relative";
	}

	var styleWidth = getElementStyle(base, "width", "width");
	if(styleWidth == "" || styleWidth == "auto"){
		base.style.width = "100%";
	}
	base.style.height = "15px";
	base.style.overflow = 'hidden';

	if (document.getElementById(id + '_msg'))
		base.removeChild(document.getElementById(id + '_msg'));

	var msg = document.createElement("span");
	msg.id = id + '_msg';
	base.appendChild(msg);
	msg.style.position = "relative";
	msg.style.top = base.offsetHeight + "px";
	msg.style.whiteSpace = "nowrap";

	var i = 0;
	msg.innerHTML = msgs[i];

	if (base.timer)
		clearTimeout(base.timer);

	var move = function () {
		var cur = parseInt(msg.style.top);
		if(cur < -(msg.offsetHeight)){
			cur = base.offsetHeight + 1;
			msg.style.top = cur + "px";
			if(++i >= msgs.length) i = 0;
			msg.innerHTML = msgs[i];
		}
		if(cur > base.offsetHeight) {
			cur = base.offsetHeight;
		} else {
			if ( cur - len < 0 && cur > 0) cur = 0;
			else cur = cur - len;
		}
		msg.style.top = cur + "px";
		if (cur == 0) {
			base.timer = setTimeout(move, time); // pause
		} else {
			base.timer = setTimeout(move, 30);
		}
	};
	move();
}

//
// update ticker element.
//
function updateTicker(rss, id, interval, mode) {
	var str = "";
	var data = [];
	for( var i=0; i< rss.value.items.length && data.length <= 10; i++ ) {
		if (rss.value.items[i].title.indexOf("AD:") == 0) continue;
		var date = new Date();
		date.setW3CDTF(rss.value.items[i].pubDate);
		str = (date.getHours() < 10 ? "0" : "") + date.getHours() + ":" +
			(date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
		data.push(rss.value.items[i].title + " ("+ str + ")");
	}
	document.getElementById(id).innerHTML = ''; // clear message

	if (mode && mode == 1) {
		var ws = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
		hticker([data.join(ws+ws+ws)], 2, 60, id); // 2px scroll per 60msec.
	} else {
		vticker(data, 1, 7000, id); // 1px scroll, pause 7000msec.
	}
}

//
// call this function from HTML
// @url  : RSS URL
// @id   : Element ID
// @interval : update interval
// @mode : 1 = horizontal, other = vertical
//
function fetchRSS(url, id, interval, mode) {
	document.getElementById(id).innerHTML =  "Retrieving data...";
	var req = new XMLHttpRequest();
	req.onreadystatechange = function(e) {
		if (req.readyState != 4) return;
		if (req.responseText.length > 0 && req.status == 200) {
			var rss = eval('(' + req.responseText + ')');
			updateTicker(rss, id, interval, mode);
			window.setTimeout(fetchRSS, 60*1000*interval, url, id, interval, mode);
		} else {
			document.getElementById(id).innerHTML = "Error: HTTP/" +req.status;
		}
	};
      //}
	setTimeout(function () {
			if (req.readyState ==0 || req.readyState == 4) return;
			document.getElementById(id).innerHTML = "Timeout Error: will be retried in 1min.";
			req.abort();
			window.setTimeout(fetchRSS, 60*1000, url, id, interval, mode);
		}, 3000);
	req.open('GET', 'http://pipes.yahoo.com/yager/rss2json?_render=json&url='+encodeURIComponent(url), true);
	req.send(null);
}
