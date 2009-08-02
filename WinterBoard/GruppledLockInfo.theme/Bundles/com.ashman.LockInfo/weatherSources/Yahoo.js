var MiniIcons =
[
	"tstorm3",		//0 	tornado
	"tstorm3",		//1 	tropical storm
	"tstorm3",		//2 	hurricane
	"tstorm3",		//3 	severe thunderstorms
	"tstorm2",		//4 	thunderstorms
	"sleet",		//5 	mixed rain and snow
	"sleet",		//6 	mixed rain and sleet
	"sleet",		//7 	mixed snow and sleet
	"sleet",		//8 	freezing drizzle
	"light_rain",	//9 	drizzle
	"sleet",		//10 	freezing rain
	"shower2",		//11 	showers
	"shower2",		//12 	showers
	"snow1",		//13 	snow flurries
	"snow2",		//14 	light snow showers
	"snow4",		//15 	blowing snow
	"snow4",		//16 	snow
	"hail", 		//17 	hail
	"sleet",		//18 	sleet
	"mist",	    	//19 	dust
	"fog",	    	//20 	foggy
	"fog",	    	//21 	haze
	"fog",	    	//22 	smoky
	"cloudy1",		//23 	blustery
	"cloudy1",		//24 	windy
	"overcast",		//25 	cold
	"cloudy1",		//26 	cloudy
	"cloudy4_night",//27 	mostly cloudy (night)
	"cloudy4",		//28 	mostly cloudy (day)
	"cloudy2_night",//29 	partly cloudy (night)
	"cloudy2",		//30 	partly cloudy (day)
	"sunny_night",	//31 	clear (night)
	"sunny",		//32 	sunny
	"mist_night",	//33 	fair (night)
	"mist", 		//34 	fair (day)
	"hail",	    	//35 	mixed rain and hail
	"sunny",		//36 	hot
	"tstorm1",		//37 	isolated thunderstorms
	"tstorm2",		//38 	scattered thunderstorms
	"tstorm2",		//39 	scattered thunderstorms
	"tstorm2",		//40 	scattered showers
	"snow5",		//41 	heavy snow
	"snow3",		//42 	scattered snow showers
	"snow5",		//43 	heavy snow
	"cloudy1",		//44 	partly cloudy
	"storm1",		//45 	thundershowers
	"snow2",		//46 	snow showers
	"tstorm1",		//47 	isolated thundershowers
	"dunno" 		//3200 	not available
]

function constructError(string){
	return {error:true, errorString:string};
}

function findChild(element, nodeName){
	var child;

	for(child = element.firstChild; child != null; child = child.nextSibling){
		if(child.nodeName == nodeName)
			return child;
	}

	return null;
}


function fetchWeatherData(callback, zip){
    if(typeof(netscape) == "object") netscape.security.PrivilegeManager.enablePrivilege('UniversalBrowserRead');
	url="http://weather.yahooapis.com/forecastrss?u=f&p=" //u=Farenheit, because accuWeather sucks
	var xml_request = new XMLHttpRequest();
	xml_request.onload = function(e){xml_loaded(e, xml_request, callback);};
	xml_request.overrideMimeType("text/xml");
	xml_request.open("GET", url+zip);
	xml_request.setRequestHeader("Cache-Control", "no-cache");
	xml_request.send(null);	

	return xml_request;
}

function xml_loaded(event, request, callback){
	if(request.responseXML){
	 	var obj = {error:false, errorString:null};
		var effectiveRoot = findChild(findChild(request.responseXML, "rss"), "channel");
		obj.city = findChild(effectiveRoot, "yweather:location").getAttribute("city");
		obj.realFeel = findChild(effectiveRoot, "yweather:wind").getAttribute("chill");//Only accounts for windChill
		
		conditionTag = findChild(findChild(effectiveRoot, "item"), "yweather:condition");
		obj.temp = conditionTag.getAttribute("temp");
		obj.icon = conditionTag.getAttribute("code");
		obj.description = conditionTag.getAttribute("text"); 
		callback(obj); 
	}else{
		callback({error:true, errorString:"XML request failed. no responseXML"});
	}
}

function validateWeatherLocation(location, callback){
	var obj = {error:false, errorString:null, cities: new Array};
	obj.cities.push({zip: location});
	callback(obj);
}

