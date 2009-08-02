var postals = {length:0};
var xmlReq = new XMLHttpRequest();
var launchReq = new XMLHttpRequest();
var headID = document.getElementsByTagName("head")[0];
var scriptNode = document.createElement('script');
var weatherRetries = 0;
var lastWeatherUpdate;
var dayCodes = {
	"SUN":0,
	"MON":1,
	"TUE":2,
	"WED":3,
	"THU":4,
	"FRI":5,
	"SAT":6
};
scriptNode.type = 'text/javascript';
scriptNode.src = 'weatherSources/'+weatherSource+'.js';
headID.appendChild(scriptNode);

function updateWeather(){
	window.clearTimeout(document.getElementById("weather_timestamp").timer);
	document.getElementById("weather_timestamp").innerHTML = "...";
	if(locales && locales.length){
		for(var i = 0; i < locales.length; i++){
			validateWeatherLocation(escape(locales[i]).replace(/^%u/g, "%"), setPostal, i);
		}
	}
}

function convertTemp(num){
	if(isCelsius){
		return Math.round((num - 32) * 5 / 9);
	}else{
		return num;
	}
}

function setPostal(obj){
	if(!obj.error){
		if(obj.cities.length > 0){
			postals[obj.id] = escape(obj.cities[0].zip).replace(/^%u/g, "%");
			postals.length++;
			weatherDIV.className = "";
			if(postals.length == locales.length){
				weatherRefresherTemp();
			}
		}else{
			if(lastWeatherUpdate){
				relativeTime(weatherDIV, "weather_timestamp", lastWeatherUpdate, false, true, string_JustUpdated);
			}else{
				document.getElementById("weather_timestamp").innerHTML = "";
			}
			document.getElementById("weather_"+obj.id+"_icon").src = "Icon Sets/"+iconSet+"/dunno"+iconExt;
			document.getElementById("weather_"+obj.id+"_desc").innerHTML = "&ndash; "+string_noCity;
			collapsed["weather_"+obj.id] = false;
			toggleSection(["weather_"+obj.id, true]);
			if(obj.id == 0){
				document.getElementById("weather_icon").src = "Icon Sets/"+iconSet+"/dunno"+iconExt;
				document.getElementById("weather_desc").innerHTML = "&ndash; "+string_noCity;
			}
			if(collapsed["Weather"]){
				collapsed["Weather"] = false;
				toggleSection([weatherDIV, true]);
			}
		}
	}else{
		window.clearTimeout(weatherDIV.timer);
		if(lastWeatherUpdate){
			relativeTime(weatherDIV, "weather_timestamp", lastWeatherUpdate, false, true, string_JustUpdated);
		}else{
			document.getElementById("weather_timestamp").innerHTML = "";
		}
		docum
		document.getElementById("weather_"+obj.id+"_icon").src = "Icon Sets/"+iconSet+"/dunno"+iconExt;
		document.getElementById("weather_"+obj.id+"_desc").innerHTML = "&ndash; "+obj.errorString;
		toggleSection(["weather_"+obj.id+"_forecast", true]);
		if(obj.id == 0){
			document.getElementById("weather_icon").src = "Icon Sets/"+iconSet+"/dunno"+iconExt;
			document.getElementById("weather_desc").innerHTML = "&ndash; "+obj.errorString;
		}
		if(collapsed["Weather"]){
			collapsed["Weather"] = false;
			toggleSection([weatherDIV, true]);
		}
	}
}

function dealWithWeather(obj){
	window.clearTimeout(weatherDIV.timer);
	if(!obj.error){
		weatherRetries = 0;
		lastWeatherUpdate = new Date();
		var city = (string_city_names[obj.city] ? string_city_names[obj.city] : obj.city ) +': ';
		var desc = " &ndash; "+weatherText[obj.icon];
		if(useRealFeel){
			tempValue = convertTemp(obj.realFeel);
		}else{
			tempValue = convertTemp(obj.temp)
		}
		var temp = tempValue+"&deg;";
		var icon = "Icon Sets/"+iconSet+"/"+MiniIcons[obj.icon]+iconExt;

		if(locales.length > 1 || !mainHeaderWeather){
			removeClass(document.getElementById("weather_"+obj.id), "empty");
			document.getElementById("weather_"+obj.id+"_city").innerHTML = displayCityNames ? city : '';
			document.getElementById("weather_"+obj.id+"_desc").innerHTML = desc;
			document.getElementById("weather_"+obj.id+"_temp").innerHTML = temp;
			document.getElementById("weather_"+obj.id+"_icon").src = icon;
		}
		if(obj.id == 0){
			relativeTime(weatherDIV, "weather_timestamp", lastWeatherUpdate, false, true, string_JustUpdated);
			if(mainHeaderWeather){
				document.getElementById("weather_city").innerHTML = displayMainCityName ? city : '';
				document.getElementById("weather_desc").innerHTML = desc;
				document.getElementById("weather_temp").innerHTML = temp;
				document.getElementById("weather_icon").src = icon;
			}
		}

		var c = Math.min(obj.forecast.length, weatherDayLimit);
		var html = "<table><tbody><tr>";
		for(var i = 0; i < c; i++){
			html += "<td width='"+Math.round(100/c)+"%'>";
			html += "<span class='sub1'>"+shortDays[dayCodes[obj.forecast[i].daycode]]+"</span><br>";
			html += "<img src=\"Icon Sets/"+iconSet+"/"+MiniIcons[obj.forecast[i].icon]+iconExt+"\"/><br>";
			html += "<span class='sub1'>"+convertTemp(obj.forecast[i].hi)+"&deg;"+weatherTempSeparator+"</span><span class='sub2'>"+convertTemp(obj.forecast[i].lo)+"&deg;</span>";
			html += "</td>";
		}
		html += "</tr></tbody></table>";
		var forecastDIV = document.getElementById("weather_"+obj.id+"_forecast");
		forecastDIV.innerHTML = html;
		forecastDIV.style.display = weatherDIV.lastChild.style.display = "block";
		collapsed["weather_"+obj.id+"_forecast"] = !collapsed["weather_"+obj.id+"_forecast"];
		toggleSection([forecastDIV, true]);

		if(postals.length == locales.length && !collapsed["Weather"]){
			collapsed["Weather"] = true;
			toggleSection([weatherDIV, true]);
		}
		if(locales.length > 1){
			subsectionCollapsed("weather_"+obj.id, "Weather", !obj.id);
			if(collapsed["weather_"+obj.id]){
				collapsed["weather_"+obj.id] = false;
				toggleSection(["weather_"+obj.id, true]);
			}
		}
		if(collapsed["Weather"]){
			collapsed["Weather"] = false;
			toggleSection([weatherDIV, true]);
		}
		if(weatherUpdateInterval){
			weatherDIV.timer = window.setTimeout(weatherRefresherTemp, 60000*weatherUpdateInterval);
		}
	}else if(weatherRetryInterval && (!weatherRetriesMax || weatherRetries <= weatherRetriesMax)){
		relativeTime(weatherDIV, "weather_timestamp", lastWeatherUpdate, false, true, string_JustUpdated);
		weatherDIV.timer = window.setTimeout(weatherRefresherTemp, 60000*weatherRetryInterval);
	}else{
		relativeTime(weatherDIV, "weather_timestamp", lastWeatherUpdate, false, true, string_JustUpdated);
	}
}

function weatherRefresherTemp(){
	if(postals.length != locales.length){
		updateWeather()
		return;
	}
	window.clearTimeout(document.getElementById("weather_timestamp").timer);
	if(weatherRetriesMax && weatherRetries){
		document.getElementById("weather_timestamp").innerHTML = weatherRetries+'/'+weatherRetriesMax+"...";
	}else{
		document.getElementById("weather_timestamp").innerHTML = "...";
	}
	weatherRetries++;
	for(var i = 0; i < postals.length; i++){
		fetchWeatherData(dealWithWeather, postals[i], i);
	}
}

