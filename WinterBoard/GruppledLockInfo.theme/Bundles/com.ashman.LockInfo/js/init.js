var collapsed = {};
var lastCollapsed = {};
var lockinfoDIV = document.getElementById("lockinfo");
var clockDIV;
var monthDIV;
var weatherDIV;
var mailDIV;
var calendarDIV;
var callsDIV;
var voicemailDIV;
var smsDIV;
var clockTimer;
var dayTimer;

var twitterDIV;
var twFriendDIV;
var twMentionsDIV;
var twDirectDIV;

for(var id in defaultCollapsed){
	collapsed[id] = defaultCollapsed[id];
}

document.getElementById("background").ontouchstart = catchSwipe;

window.onload = function(){
	setTimeout(function(){
		for(var i = 0; i < sections.length; i++){
			switch(sections[i]){
				case "Clock":
					var now = new Date();
					clockDIV = document.createElement("DIV");
					clockDIV.id = "Clock";
					clockDIV.className = useBigClock ? "big container" : "container";
					var clockHeader = document.createElement("DIV");
					clockHeader.className = "header expanded";
					var container = document.createElement("DIV");
					container.className = "container";
					clockHeader.innerHTML = "<span id='date'></span> <span id='time'></span>";
					clockDIV.appendChild(clockHeader);
					if(showMonth){
						clockDIV.ontouchstart = function(event){catchSwipe(event, toggleSection, [this]);};
						clockHeader.innerHTML = "<div class='arrow'></div>" + clockHeader.innerHTML;
						monthDIV = document.createElement("DIV");
						monthDIV.className = "sub container";
						container.appendChild(monthDIV);
					}else{
						clockDIV.ontouchstart = catchSwipe;
					}
					clockDIV.appendChild(container);
					lockinfoDIV.appendChild(clockDIV);
					updateClock();
				break;
			case "Twitter":
				var refresh = "<span id='twitter_timestamp'" + (displayTwitterRefreshButton ? " class='refresh'" : "")+ " ontouchstart='event.stopPropagation();' onclick='twitterRetries=0;twitterRefresherTemp();'></span>";
				twitterDIV = document.createElement("DIV");
				twitterDIV.id = "Twitter";
				twitterDIV.className = "empty container";
				twitterDIV.style.display = hideEmptySections ? "none" : "block";

				// header
				var html = "<div class='header twitter expanded' ontouchstart='catchSwipe(event, toggleSection, [this.parentNode]);'>" +
				"<div class='arrow'></div>" + refresh + "<img src='images/t.png'/> " + string_twitter + " - <img src='images/sms.png'/><span id='twFriendCount_h'>0</span> <img src='images/at.png'/><span id='twMentionsCount_h'>0</span> <img src='images/mailh.png'/><span id='twDirectCount_h'>0</span>" + "</div><div class='container'></div>";
				twitterDIV.innerHTML = html ;
var addcont = document.createDocumentFragment();

				// timeline sub header
				twFriendDIV = document.createElement("DIV");
				twFriendDIV.className = "container";
				twFriendDIV.id = "twFriend";
				twFriendDIV.counterid = "twFriendCount";
				twFriendDIV.since = twitter_tl_since;
				twFriendDIV.lastid = -1;
				twFriendDIV.contentsNode = "twFriend_content";
				twFriendDIV.limit = twFriendDIV.defaultLimit = twitter_tl_limit;
				twFriendDIV.update = updateTwitterDIV;
				twFriendDIV.ontouchstart = function(event) { catchSwipe(event, toggleSection, [this]);};
				twFriendDIV.style.display = "none"; // default
				html =	"<div class='sub1 header expanded' ontouchstart='catchSwipe(event, toggleSection, [this.parentNode]);'><div class='arrow'></div>" + string_twitter_timeline + "(<span id='twFriendCount'>0</span>)</div><div id='twFriend_content' class='container timeline'></div></div>";
				twFriendDIV.innerHTML = html;
				addcont.appendChild(twFriendDIV);
				if(collapsed[twFriendDIV.id]) {
					collapsed[twFriendDIV.id] = false;
					toggleSection([twFriendDIV.id, true]);
				}

				// mentions sub header
				twMentionsDIV = document.createElement("DIV");
				twMentionsDIV.className = "container";
				twMentionsDIV.id = "twMentions";
				twMentionsDIV.counterid = "twMentionsCount";
				twMentionsDIV.since = twitter_ment_since;
				twMentionsDIV.lastid = -1;
				twMentionsDIV.contentsNode = "twMentions_content";
				twMentionsDIV.limit = twMentionsDIV.defaultLimit = twitter_ment_limit;
				twMentionsDIV.update = updateTwitterDIV;
				twMentionsDIV.ontouchstart = function(event) { catchSwipe(event, toggleSection, [this]);};
				twMentionsDIV.style.display = "none"; // default
				html =	"<div class='sub1 header expanded' ontouchstart='catchSwipe(event, toggleSection, [this.parentNode]);'><div class='arrow'></div>" + string_twitter_mentions + "(<span id='twMentionsCount'>0</span>)</div><div id='twMentions_content' class='container mentions'></div></div>";
				twMentionsDIV.innerHTML = html;
				addcont.appendChild(twMentionsDIV);

				// direct message
				twDirectDIV = document.createElement("DIV");
				twDirectDIV.className = "container";
				twDirectDIV.id = "twDirect";
				twDirectDIV.counterid = "twDirectCount";
				twDirectDIV.since = twitter_dm_since;
				twDirectDIV.lastid = -1;
				twDirectDIV.contentsNode = "twDirect_content";
				twDirectDIV.limit = twDirectDIV.defaultLimit = twitter_dm_limit;
				twDirectDIV.update = updateTwitterDIV;
				twDirectDIV.ontouchstart = function(event) { catchSwipe(event, toggleSection, [this]);};
				twDirectDIV.style.display = "none"; // default

				html =  "<div class='sub1 header expanded' ontouchstart='catchSwipe(event, toggleSection, [this.parentNode]);'><div class='arrow'></div>" + string_twitter_direct + "(<span id='twDirectCount'>0</span>)</div><div id='twDirect_content' class='container direct'></div></div>";
				twDirectDIV.innerHTML = html;
				addcont.appendChild(twDirectDIV);

				twitterDIV.lastChild.appendChild(addcont);
				if(collapsed[twMentionsDIV.id]) {
					collapsed[twMentionsDIV.id] = false;
					toggleSection([twMentionsDIV.id, true]);
				}
				if(collapsed[twDirectDIV.id]) {
					collapsed[twDirectDIV.id] = false;
					toggleSection([twDirectDIV.id, true]);
				}
				lockinfoDIV.appendChild(twitterDIV);
				if(collapsed["Twitter"]){
					collapsed["Twitter"] = false;
					toggleSection([twitterDIV, true]);
				}
				break;
				case "Weather":
					weatherDIV = document.createElement("DIV");
					weatherDIV.id = "Weather";
					if(locales.length == 1 && mainHeaderWeather){
						weatherDIV.className = "empty container";
						weatherDIV.ontouchstart = function(event){catchSwipe(event, toggleSection, [this]);};
						var headerTouch = '';
					}else{
						var headerTouch = " ontouchstart='catchSwipe(event, toggleSection, [this.parentNode]);'";
					}
					var refresh = "<span id='weather_timestamp'" + (displayWeatherRefreshButton ?  " class='refresh'" : '')+" ontouchstart='event.stopPropagation();' onclick='weatherRetries=0;weatherRefresherTemp();'></span>";
					var html;
					if(mainHeaderWeather){
						html = "<div id='forecast_header' class='header weather expanded'"+headerTouch+"><div class='arrow'></div>"+refresh+"<img id='weather_icon' class='icon' src=\"Icon Sets/"+iconSet+"/dunno"+iconExt+"\"/><span id='weather_city' class='city'>"+string_weather+(displayMainCityName ? " &ndash; "+locales[0] : '')+"</span><span id='weather_temp' class='temp'></span><span id='weather_desc' class='desc'></span></div><div class='container'"+(locales.length == 1 && mainHeaderWeather ? " style='display:none;'" : '')+">";
					}else{
						html = "<div id='forecast_header' class='header expanded'"+headerTouch+"><div class='arrow'></div><span id='weather_title'>"+string_weather+" ("+refresh+")</span></div><div class='container'"+(locales.length == 1 && mainHeaderWeather ? " style='display:none;'" : '')+">";
					}
					for(var j = 0; j < locales.length; j++){
						if(locales.length > 1 || !mainHeaderWeather){
							html += "<div id='weather_"+j+"' ontouchstart='catchSwipe(event, toggleSection, [this]);' class='empty container'><div id='forecast_"+j+"_header' class='sub1 header weather expanded'><div class='arrow'></div><img id='weather_"+j+"_icon' class='icon' src=\"Icon Sets/"+iconSet+"/dunno"+iconExt+"\"/><span id='weather_"+j+"_city' class='city'>"+locales[j]+"</span><span id='weather_"+j+"_temp' class='temp'></span><span id='weather_"+j+"_desc' class='desc'></span></div><div class='container'>";
						}
						html += "<div id='weather_"+j+"_forecast' class='sub container forecast' style='display:none;'></div>";
						if(locales.length > 1){
							html += "</div></div>";
						}
					}
					weatherDIV.innerHTML = html + "</div>";
					lockinfoDIV.appendChild(weatherDIV);
					if(collapsed["Weather"]){
						collapsed["Weather"] = false;
						toggleSection([weatherDIV, true]);
					}
				break;
				case "Mail":
					mailDIV = document.createElement("DIV");
					mailDIV.limit = mailDIV.defaultLimit = mailLimit;
					mailDIV.id = "Mail";
					mailDIV.className = "empty container";
					mailDIV.style.display = hideEmptySections ? "none" : "block";
					mailDIV.update = updateMail;
					mailDIV.innerHTML = "<div class='header expanded' ontouchstart='catchSwipe(event, toggleSection, [this.parentNode]);'><div class='arrow'></div><img src='images/mailh.png'/> "+string_mail+" (<span id='mailCount'>0</span>)</div><div class='container'><div class='container'></div></div>";
					lockinfoDIV.appendChild(mailDIV);
				break;
				case "Calendar":
					calendarDIV = document.createElement("DIV");
					calendarDIV.limit = calendarDIV.defaultLimit = calendarLimit;
					calendarDIV.id = "Calendar";
					calendarDIV.className = "empty container";
					calendarDIV.style.display = hideEmptySections ? "none" : "block";
					calendarDIV.update = updateCalendar;
					calendarDIV.innerHTML = "<div class='header expanded' ontouchstart='catchSwipe(event, toggleSection, [this.parentNode]);'><div class='arrow'></div><img src='images/calendarh.png'/> "+string_calendar+" (<span id='calendarCount'>0</span>)</div><div class='container'><div class='container'></div></div>";
					lockinfoDIV.appendChild(calendarDIV);
				break;
				case "Calls":
					callsDIV = document.createElement("DIV");
					callsDIV.limit = callsDIV.defaultLimit = callLimit;
					callsDIV.id = "Calls";
					callsDIV.className = "empty container";
					callsDIV.ontouchstart = function(event){catchSwipe(event, toggleSection, [this]);};
					callsDIV.style.display = hideEmptySections ? "none" : "block";
					callsDIV.update = updateCalls;
					callsDIV.innerHTML = "<div class='header expanded'><div class='arrow'></div><img src='images/callsh.png'/> "+string_calls+" (<span id='callCount'>0</span>)</div><div class='container'><div class='container'></div></div>";
					lockinfoDIV.appendChild(callsDIV);
				break;
				case "Voicemail":
					voicemailDIV = document.createElement("DIV");
					voicemailDIV.limit = voicemailDIV.defaultLimit = voicemailLimit;
					voicemailDIV.id = "Voicemail";
					voicemailDIV.className = "empty container";
					voicemailDIV.ontouchstart = function(event){catchSwipe(event, toggleSection, [this]);};
					voicemailDIV.style.display = hideEmptySections ? "none" : "block";
					voicemailDIV.update = updateVoicemail;
					voicemailDIV.innerHTML = "<div class='header expanded'><div class='arrow'></div><img src='images/voicemailh.png'/> "+string_voicemail+" (<span id='voicemailCount'>0</span>)</div><div class='container'><div class='container'></div></div>";
					lockinfoDIV.appendChild(voicemailDIV);
				break;
				case "SMS":
					smsDIV = document.createElement("DIV");
					smsDIV.limit = smsDIV.defaultLimit = smsLimit;
					smsDIV.id = "SMS";
					smsDIV.className = "empty container";
					smsDIV.style.display = hideEmptySections ? "none" : "block";
					smsDIV.update = updateSMS;
					smsDIV.innerHTML = "<div class='header expanded' ontouchstart='catchSwipe(event, toggleSection, [this.parentNode]);'><div class='arrow'></div><img src='images/smsh.png'/> "+string_sms+" (<span id='smsCount'>0</span>)</div><div class='container'><div class='container'></div></div>";
					lockinfoDIV.appendChild(smsDIV);
				break;
			}
		}
	}, 50);
	setTimeout(updateWeather, 100);
	setTimeout(updateTwitter, 100);
}

if(!displayArrows){
	document.styleSheets[0].insertRule(".arrow{display:none !important;}", 0);
}

