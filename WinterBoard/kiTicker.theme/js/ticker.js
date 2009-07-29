// jse-date-w3cdtf.js
// JavaScript extention for W3C Date and Time Formats
// COPYRIGHT 2005 Kawasaki Yusuke <u-suke@kawa.net>
// SEEALSO http://www.w3.org/TR/NOTE-datetime

Date.prototype.setW3CDTF = function( dtf ) {
    var sp = dtf.split( /[^0-9]/ );
    if ( sp.length < 6 || sp.length > 8 ) return;

	if ( sp.length == 7 ) {
		if ( dtf.charAt( dtf.length-1 ) != "Z" ) return;
	}

    // to numeric
    for( var i=0; i<sp.length; i++ ) sp[i] = sp[i]-0;

    if ( sp[0] < 1970 ||		// year
	 sp[1] < 1 || sp[1] > 12 ||	// month
	 sp[2] < 1 || sp[2] > 31 ||	// day
	 sp[3] < 0 || sp[3] > 23 ||	// hour
	 sp[4] < 0 || sp[4] > 59 ||	// min
	 sp[5] < 0 || sp[5] > 60 ) {	// sec
	return; 			// invalid date 
    }

    // get UTC milli seconds
    var msec = Date.UTC( sp[0], sp[1]-1, sp[2], sp[3], sp[4], sp[5] );

    // time zene offset
    if ( sp.length == 8 ) {
//	if ( dtf.indexOf("-") > 0 ) sp[6] *= -1;    // bug fix: 2006/03/06
	if ( dtf.indexOf("+") < 0 ) sp[6] *= -1;
	if ( sp[6] < -12 || sp[6] > 13 ) return;    // time zone offset hour
	if ( sp[7] < 0 || sp[7] > 59 ) return;	    // time zone offset min
	msec -= (sp[6]*60+sp[7]) * 60000;
    }

    // set by milli second;
    return this.setTime( msec );
}

Date.prototype.getW3CDTF = function() {
    var year = this.getFullYear();
    var mon  = this.getMonth()+1;
    var day  = this.getDate();
    var hour = this.getHours();
    var min  = this.getMinutes();
    var sec  = this.getSeconds();
    if ( mon  < 10 ) mon  = "0"+mon;
    if ( day  < 10 ) day  = "0"+day;
    if ( hour < 10 ) hour = "0"+hour;
    if ( min  < 10 ) min  = "0"+min;
    if ( sec  < 10 ) sec  = "0"+sec;

    var tzos = this.getTimezoneOffset();
    var tzhour = tzos / 60;
    var tzmin  = tzos % 60;
    var tzpm = ( tzhour > 0 ) ? "-" : "+";
    if ( tzhour < 0 ) tzhour *= -1;
    if ( tzhour < 10 ) tzhour = "0"+tzhour;
    if ( tzmin	< 10 ) tzmin  = "0"+tzmin;

    var dtf = year+"-"+mon+"-"+day+"T"+hour+":"+min+":"+sec+tzpm+tzhour+":"+tzmin;
    return dtf;
}
//
// ticker.js
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


function ticker(msgs, len, time, id){
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
  var move = function(){
    if(parseInt(msg.style.top) < -(msg.offsetHeight)){
      msg.style.top = (base.offsetHeight + 1) + "px";
      i++;
      if(i >= msgs.length) i = 0;
      msg.innerHTML = msgs[i];
    } 
    if(parseInt(msg.style.top) > base.offsetHeight){
      msg.style.top = base.offsetHeight + "px"; 
    }else{
      msg.style.top = (parseInt(msg.style.top) - len) + "px";
    }
    if (parseInt(msg.style.top) == 0) {
      base.timer = setTimeout(move, time * 1000);
    } else {
      base.timer = setTimeout(move, 30);
    }
  };
  move();
}

function fetchRSS(url, id, interval) {
  document.getElementById(id).innerHTML =  "データ取得中...";
  var req = new XMLHttpRequest();
  req.onreadystatechange = function(e) {
     if (req.readyState != 4) return;
     if (req.responseText.length > 0 && req.status == 200) {
	var rss = eval('(' + req.responseText + ')');
	updateTicker(rss, id, interval);
	window.setTimeout(fetchRSS, 60*1000*interval, url, id, interval);
     } else {
	document.getElementById(id).innerHTML = "Error: "+req.status;
     }
  };
  setTimeout(function () {
	if (req.readyState ==0 || req.readyState == 4) return;
	document.getElementById(id).innerHTML = "Timeout Error";
	req.abort();
	window.setTimeout(fetchRSS, 60*1000, url, id, interval);
  }, 3000);
  req.open('GET', 'http://pipes.yahoo.com/yager/rss2json?_render=json&url='+encodeURIComponent(url), true);
  req.send(null);
}

function updateTicker(rss, id, interval) {
  var cur = new Date();
  var str = ""; //(cur.getHours() < 10 ? "0" : "") + cur.getHours() + ":" +
   (cur.getMinutes() < 10 ? "0" : "") + cur.getMinutes();
  var data = []; //[ "News at "+str ];
  for( var i=0; i< rss.value.items.length && data.length <= 10; i++ ) {
    if (rss.value.items[i].title.indexOf("AD:") == 0) continue;
    var date = new Date();
    date.setW3CDTF(rss.value.items[i].pubDate);
    str = (date.getHours() < 10 ? "0" : "") + date.getHours() + ":" +
	  (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    data.push(rss.value.items[i].title + " ("+ str + ")");
  }
  document.getElementById(id).innerHTML = '';
  ticker(data, 1, 7, id);
}


