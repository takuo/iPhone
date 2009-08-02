// Modified from weatherParser.js from Leopard. Apologies to all offended.
// I'm hoping that no-one objects since it's Apple hardware and so forth.

/*
Copyright ＿ 2005, Apple Computer, Inc.  All rights reserved.
NOTE:  Use of this source code is subject to the terms of the Software
License Agreement for Mac OS X, which accompanies the code.  Your use
of this source code signifies your agreement to such license terms and
conditions.  Except as expressly granted in the Software License Agreement
for Mac OS X, no other copyright, patent, or other intellectual property
license or right is granted, either expressly or by implication, by Apple.
*/

var MiniIcons = //Fix Up for weatherParser.js but also enables standardisation of sorts
[
	"sunny", 				// 1  Sunny
	"cloudy1",				// 2  Mostly Sunny
	"cloudy2",				// 3  Partly Sunny
	"cloudy3",				// 4  Intermittent Clouds
	"cloudy4",				// 5  Hazy Sunshione
	"cloudy5",				// 6  Mostly Cloudy
	"cloudy5",				// 7  Cloudy(am/pm)
	"overcast",				// 8  Dreary(am/pm)
	"dunno",				// 9  retired
	"dunno",				// 10 retired
	"fog",					// 11 fog(am/pm)
	"shower1",				// 12 showers(am/pm)
	"shower3",				// 13 Mostly Cloudy with Showers
	"shower2",				// 14 Partly Sunny with Showers
	"tstorm3",				// 15 Thunderstorms(am/pm)
	"tstorm2",				// 16 Mostly Cloudy with Thunder Showers
	"tstorm1",				// 17 Partly Sunnty with Thunder Showers
	"light_rain",			// 18 Rain(am/pm)
	"cloudy5",				// 19 Flurries(am/pm)
	"cloudy4",				// 20 Mostly Cloudy with Flurries
	"cloudy2",				// 21 Partly Sunny with Flurries
	"snow5",				// 22 Snow(am/pm)
	"snow3",				// 23 Mostly Cloudy with Snow
	"hail",					// 24 Ice(am/pm)
	"sleet",				// 25 Sleet(am/pm)
	"hail",					// 26 Freezing Rain(am/pm)
	"dunno",				// 27 retired
	"dunno",				// 28 retired
	"sleet",				// 29 Rain and Snow Mixed(am/pm)
	"sunny",				// 30 Hot(am/pm)
	"sunny",				// 31 Cold(am/pm)
	"mist",					// 32 Windy(am/pm)
	// Night only Icons;
	"sunny_night",			// 33 Clear
	"cloudy1_night",		// 34 Mostly Clear
	"cloudy2_night",		// 35 Partly Cloudy
	"cloudy3_night",		// 36 Intermittent Clouds
	"cloudy4_night",		// 37 Hazy
	"cloudy5",				// 38 Mostly Cloudy
	"shower2_night",		// 39 Partly Cloudy with Showers
	"shower3_night",		// 40 Mostly Cloudy with Showers
	"tstorm1_night",		// 41 Partly Cloudy with Thunder Showers
	"tstorm2_night",		// 42 Mostly Cloudy with Thunder Showers
	"cloudy4_night",		// 43 Mostly Cloudy with Flurries
	"cloudy4_night"			// 44 Mostly Cloudy with Flurries
];

function getURLForSmallIcon(code){
	var src = '';
	if(code){
		src = miniIconTable[code];
		if(src === undefined){
			src = '';
		}
	}
	return src;
}

function findChild(element, nodeName){
	var child;

	for(child = element.firstChild; child != null; child = child.nextSibling){
		if(child.nodeName == nodeName)
			return child;
	}

	return null;
}

function trimWhiteSpace(string){
	return string.replace(/^\s*/, '').replace(/\s*$/, '');
}

// returns an anonymous object like so
// object
//		id:				id passed from caller
//		error:			Boolean false for success
//		errorString:	failure string
//		hi:				Fahrenheit
//		lo:				Fahrenheit
//		temp:			Fahrenheit
//		realFeel:		Farenheit
//		icon:			accuweather icon code
//		description:	accuweather description
//		city:			City(first caps)
//		time:			time 24 hours(nn:nn)
//		sunset:			time 24 hours(nn:nn)
//		sunrise:		time 24 hours(nn:nn)

function fetchWeatherData(callback, zip, id){
	var url = 'http://apple.accuweather.com/adcbin/apple/Apple_Weather_Data.asp?zipcode=';
	//var url = 'http://wu.apple.com/adcbin/apple/Apple_Weather_Data.asp?zipcode=';
	if(typeof(netscape) == "object") netscape.security.PrivilegeManager.enablePrivilege('UniversalBrowserRead');

	var xml_request = new XMLHttpRequest();
	xml_request.onload = function(e){xml_loaded(e, xml_request, callback, id);}
	xml_request.overrideMimeType("text/xml");
	xml_request.open("GET", url+zip, true);
	xml_request.setRequestHeader("Cache-Control", "no-cache");
	xml_request.setRequestHeader("wx", "385");
	xml_request.send(null);

	return xml_request;
}

function constructError(string, id){
	return{id:id, error:true, errorString:string};
}

// parses string of the form nn:nn
function parseTimeString(string){
	var obj = null;
	try{
		var array = string.match(/\d{1,2}/g);
		obj ={hour:parseInt(array[0], 10), minute:parseInt(array[1],10)};
	}
	catch(ex){
		// ignore
	}

	return obj;
}

function parseDayCode(dayCode){
	return trimWhiteSpace(dayCode).substr(0, 3).toUpperCase();
}

function xml_loaded(event, request, callback, id){
	if(!request.responseXML){
		callback({id:id, error:true, errorString:"XML request failed. no responseXML"}); //Could be any number of things..
	}else{
		var obj = {id:id, error:false, errorString:null}; 
		var adc_Database = findChild(request.responseXML, "adc_Database");
		if(adc_Database == null){
			callback(constructError("no <adc_Database>", id));
			return;
		}

		var CurrentConditions = findChild(adc_Database, "CurrentConditions");
		if(CurrentConditions == null){
			callback(constructError("no <CurrentConditions>", id));
			return;
		}

		var tag = findChild(CurrentConditions, "Time");
		if(tag != null){
			obj.time = parseTimeString(tag.firstChild.data);
		}else{
			obj.time = null;
		}

		tag = findChild(CurrentConditions, "City");
		if(tag == null){
			callback(constructError("no <City>", id));
			return;
		}
		obj.city =  trimWhiteSpace(tag.firstChild.data.toString()).toLowerCase();

		tag = findChild(CurrentConditions, "Temperature");
		if(tag == null){
			callback(constructError("no <Temperature>", id));
			return;
		}
		obj.temp = parseInt(tag.firstChild.data);

		tag = findChild(CurrentConditions, "RealFeel");
		if(tag == null){
			callback(constructError("no <RealFeel>", id));
			return;
		}
		obj.realFeel = parseInt(tag.firstChild.data);

		tag = findChild(CurrentConditions, "WeatherText");
		if(tag == null){
			obj.description = null;
		}else{
			obj.description = trimWhiteSpace(tag.firstChild.data);
		}

		tag = findChild(CurrentConditions, "WeatherIcon");
		if(tag == null){
			callback(constructError("no <WeatherIcon>", id));
			return;
		}
		obj.icon = parseInt(tag.firstChild.data, 10);
		obj.icon -= 1; //Accuweather starts at 1

		obj.sunset = null;
		obj.sunrise = null;
		var Planets = findChild(adc_Database, "Planets");
		if(Planets != null){
			tag = findChild(Planets, "Sun");
			if(tag != null){
				var rise = tag.getAttribute("rise");
				var set = tag.getAttribute("set");

				if(rise != null && set != null){
					obj.sunset = parseTimeString(set);
					obj.sunrise = parseTimeString(rise);
				}
			}
		}

		obj.forecast = new Array;
		var Forecast = findChild(adc_Database, "Forecast");
		if(Forecast == null){
			callback(constructError("no <Forecast>", id));
			return;
		}

		// assume the days are in order, 1st entry is today
		var j = 0;
		var firstTime = true;

		for(child = Forecast.firstChild; child && j < weatherDayLimit; child = child.nextSibling){
			if(child.nodeName == 'day'){
				if(firstTime){ // today
					obj.hi = 0;
					tag = findChild(child, 'High_Temperature');
					if(tag != null){
						obj.hi = parseInt(tag.firstChild.data);
					}

					obj.lo = 0;
					tag = findChild(child, 'Low_Temperature');
					if(tag != null){
						obj.lo = parseInt(tag.firstChild.data);
					}
					firstTime = false;
				}

				var foreobj ={daycode:null, hi:0, lo:0, icon:-1};

				tag = findChild(child, 'DayCode');
				if(tag != null){
					foreobj.daycode = trimWhiteSpace(tag.firstChild.data.toString()).substring(1,3);
				}

				tag = findChild(child, 'High_Temperature');
				if(tag != null){
					foreobj.hi = parseInt(tag.firstChild.data);
				}

				tag = findChild(child, 'Low_Temperature');
				if(tag != null){
					foreobj.lo = parseInt(tag.firstChild.data);
				}

				tag = findChild(child, 'WeatherIcon');
				if(tag != null){
					foreobj.icon = parseInt(tag.firstChild.data, 10);
					foreobj.ouricon = MiniIcons[foreobj.icon-1];
				}

				tag = findChild(child, "DayCode");
				if(tag != null){
					foreobj.daycode = parseDayCode(tag.firstChild.data);
				}else{
					foreobj.daycode = null;
				}

				obj.forecast[j++] = foreobj;
			}
		}
		callback(obj);
	}
}

// returns an anonymous object like so
// object
//		error: 	Boolean false for success
//		errorString: failure string
//		cities:	array(alphabetical by name)
//			object
//				name: city name
//				zip: postal code
//				state: city state
//		refine: boolean - true if the search is too generic
function validateWeatherLocation(location, callback, id){
	var url = 'http://apple.accuweather.com/adcbin/apple/Apple_find_city.asp?location=';
	//var url = 'http://wu.apple.com/adcbin/apple/Apple_find_city.asp?location=';
	if(typeof(netscape) == "object") netscape.security.PrivilegeManager.enablePrivilege('UniversalBrowserRead');

	var xml_request = new XMLHttpRequest();
	xml_request.onload = function(e){xml_validateloaded(e, xml_request, callback, id);}
	xml_request.overrideMimeType("text/xml");
	xml_request.open("GET", url+location, true);
	xml_request.setRequestHeader("Cache-Control", "no-cache");
	xml_request.send(null);
}

function xml_validateloaded(event, request, callback, id){
	if(request.responseXML){
		var obj ={id:id, error:false, errorString:null, cities:new Array, refine:false};
		var adc_Database = findChild(request.responseXML, "adc_Database");
		if(adc_Database == null){callback(constructError("no <adc_Database>")); return;}

		var CityList = findChild(adc_Database, "CityList");
		if(CityList == null){
			callback(constructError("no <CityList>"));
			return;
		}

		if(CityList.getAttribute('extra_cities') == '1'){
			obj.refine = true;
		}

		for(child = CityList.firstChild; child != null; child = child.nextSibling){
			if(child.nodeName == "location"){
				var city = child.getAttribute("city");
				var state = child.getAttribute("state");
				var zip = child.getAttribute("postal");

				if(city && state && zip){
					obj.cities.push({name:city, state:state, zip:zip});
				}
			}
		}

		callback(obj);
	}
	else{
		callback({id:id, error:true, errorString:string_noResponse});
	}
}

function createGoToURL(location){
	return 'http://apple.accuweather.com/adcbin/apple/Apple_weather.asp?location=' + escape(location);
}
