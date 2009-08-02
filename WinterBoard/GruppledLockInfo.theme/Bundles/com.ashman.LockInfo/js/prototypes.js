String.prototype.upperFirst = function(){
	return this[0] ? this[0].toUpperCase()+this.substr(1).toLowerCase() : "";
}

relativeUpdateLimit = Math.max(1, relativeUpdateLimit);

Date.prototype.relative = function(daysOnly, returnNextChange){
	var now = new Date();
	var oneDay = 86400000;
	var time = "";
	if(daysOnly){
		difference = (now.zeroTime().getTime() - this.zeroTime().getTime());
		difference /= oneDay;
		var interval = oneDay;
		var lengths = [60/relativeUpdateLimit, 60, 24, 7, 4.35, 12];
		for(var i = 3; Math.abs(difference) >= lengths[i] && i < lengths.length; i++){
			difference /= lengths[i];
		}
	}else{
		difference = (now.getTime() - this.getTime());
		difference /= relativeUpdateLimit*1000;
		var interval = relativeUpdateLimit*1000;
		var i = 0;
		lengths = [1, 60, 3600, 86400, 604800, 2630880, 31536000];
		var time = [];
		var d = difference = Math.round(Math.abs(difference));
		var l = relativeTimeLength;
		for(var i = periods.length - 1; i >= 0 && l > 0; i--){
			if(d >= lengths[i] / relativeUpdateLimit){
				var t = relativeUpdateLimit * d / lengths[i];
				t = l == 1 && !roundPeriods[i] ? Math.round(t) : (roundPeriods[i] > 0 && now < this ? Math.ceil(t) : Math.floor(t));
				time.push(t + (displayShortPeriods ? periods_short[i] : " " + (t == 1 ? periods[i] : periods_plural[i])));
				d -= t * lengths[i] / relativeUpdateLimit;
				l -= 1 + (i == 1);
			}else if(l < relativeTimeLength){
				l--;
			}
		}
		time = time.join(displayShortPeriods ? " " : ", ");
	}

	if(now > this){
		var prefix = past_prefix;
		var suffix = past_suffix;
	}else if(now < this){
		var prefix = future_prefix;
		var suffix = future_suffix;
	}

	if(returnNextChange){
		if(this < now){
			return (interval - (now.getTime() % interval)) + (this.getTime() % interval);
		}else{
			return (this.getTime() - now.getTime()) % interval;
		}
	}

	if(daysOnly){
		difference = Math.abs(!roundPeriods[i] ? Math.round(difference) : (roundPeriods[i] < 0 ? Math.ceil(difference) : Math.floor(difference)));
		if(i == 0){
			difference *= relativeUpdateLimit;
		}
		time = difference + " " + (difference == 1 ? periods[i] : periods_plural[i]);
	}

	if(!difference || !time){
		if(daysOnly){
			return string_today;
		}else{
			return "";
		}
	}
	if(daysOnly && i == 3 && difference == 1){
		return now < this ? string_tomorrow : string_yesterday;
	}else{
		return prefix+time+suffix;
	}
};

Date.prototype.format = function(format) {
	var returnStr = '';
	var replace = Date.replaceChars;
	for(var i = 0; i < format.length; i++) {
		var curChar = format.charAt(i);
		if(replace[curChar]){
			returnStr += replace[curChar].call(this);
		}else{
			returnStr += curChar;
		}
	}
	return returnStr;
};

Date.prototype.zeroTime = function(){
	var d = new Date(this);
	d.setMilliseconds(0);
	d.setSeconds(0);
	d.setMinutes(0);
	d.setHours(0);
	return d;
};

Date.prototype.isSameDay = function(date2){
	if(!date2){
		var date2 = new Date();
	}
	return !(this.getDate() != date2.getDate() ||
		this.getMonth() != date2.getMonth() ||
		this.getFullYear() != date2.getFullYear());
};

Date.replaceChars = {	
	// Day
	d: function() { return(this.getDate() < 10 ? '0' : '')+this.getDate(); },
	D: function() { return shortDays[this.getDay()]; },
	j: function() { return this.getDate(); },
	l: function() { return longDays[this.getDay()]; },
	N: function() { return this.getDay()+1; },
	S: function() { return(this.getDate() % 10 == 1 && this.getDate() != 11 ? 'st' :(this.getDate() % 10 == 2 && this.getDate() != 12 ? 'nd' :(this.getDate() % 10 == 3 && this.getDate() != 13 ? 'rd' : 'th'))); },
	w: function() { return this.getDay(); },
	// Week
	// Month
	F: function() { return longMonths[this.getMonth()]; },
	m: function() { return(this.getMonth() < 11 ? '0' : '') +(this.getMonth()+1); },
	M: function() { return shortMonths[this.getMonth()]; },
	n: function() { return this.getMonth()+1; },
	// Year
	o: function() { return "Not Supported"; },
	Y: function() { return this.getFullYear(); },
	y: function() { return(''+this.getFullYear()).substr(2); },
	// Time
	a: function() { return this.getHours() < 12 ? string_am : string_pm; },
	b: function() { return this.getHours() < 12 ? string_am[0] : string_pm[0]; },
	A: function() { return this.getHours() < 12 ? string_am.toUpperCase() : string_pm.toUpperCase(); },
	g: function() { return this.getHours() == 0 ? 12 :(this.getHours() > 12 ? this.getHours() - 12 : this.getHours()); },
	G: function() { return this.getHours(); },
	h: function() { return this.getHours() == 0 ? 12 : ((this.getHours() < 10) ||  (this.getHours() > 12 && this.getHours() < 22) ? '0' : '') + (this.getHours() < 13 ? this.getHours() : this.getHours() - 12); },
	H: function() { return(this.getHours() < 10 ? '0' : '')+this.getHours(); },
	i: function() { return(this.getMinutes() < 10 ? '0' : '')+this.getMinutes(); },
	s: function() { return(this.getSeconds() < 10 ? '0' : '')+this.getSeconds(); },
	// Timezone
	I: function() { return "Not Supported"; },
	O: function() { return(this.getTimezoneOffset() < 0 ? '-' : '+') +(this.getTimezoneOffset() / 60 < 10 ? '0' : '') +(this.getTimezoneOffset() / 60)+'00'; },
	Z: function() { return this.getTimezoneOffset() * 60; },
	// Full Date/Time
	r: function() { return this.toString(); },
	U: function() { return this.getTime() / 1000; }
};

