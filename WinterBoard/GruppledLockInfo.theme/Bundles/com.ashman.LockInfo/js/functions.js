function relativeTime(sectionDIV, id, time, daysOnly, upperFirst, emptyString){
	var div = document.getElementById(id);
	if(!div || !sectionDIV){
		return false;
	}
	if(!time){
		var time = new Date();
	}
	addClass(div, "relativeTime");

	window.clearTimeout(div.timer);
	if(displayRelativeTimes){
		var string = time.relative(daysOnly);
		if(string){
			div.innerHTML = upperFirst ? string.upperFirst() : string;
		}else if(emptyString){
			div.innerHTML = emptyString;
		}
		div.timer = window.setTimeout(function(){relativeTime(sectionDIV, id, time, daysOnly, upperFirst);}, time.relative(daysOnly, true));
		if(!sectionDIV.relativeTimers){
			sectionDIV.relativeTimers = [div.timer];
		}else{
			sectionDIV.relativeTimers.push(div.timer);
		}
	}else{
		div.innerHTML = time.format(time.isSameDay() ? format_time : format_date_time_short);
	}
}

function clearRelativeTimers(sectionDIV){
	if(sectionDIV && sectionDIV.relativeTimers){
		for(var i = 0; i < sectionDIV.relativeTimers.length; i++){
			window.clearTimeout(sectionDIV.relativeTimers[i]);
		}
		sectionDIV.relativeTimers = [];
	}
}

function getSectionHeight(div){
	var h = 0;
	for(var i in div.lastChild.childNodes){
		h += div.lastChild.childNodes[i].clientHeight || 0;
	}
	return h;
}

function addLoadMoreBar(containerDIV){
	var div = document.createElement("DIV");
	div.className = "loadMore";
	div.innerHTML = string_loadMore;
	div.ontouchstart = function(event){
		event.stopPropagation();
	};
	div.onclick = function(){
		containerDIV.limit += loadIncrement;
		containerDIV.update();
	};
	containerDIV.lastChild.appendChild(div);
}

function catchSwipe(event, tapFunction, args){
	var args = args || null;
	if(event && event.touches && event.touches.length == 1){
		event.stopPropagation();
		var startX = event.touches[0].pageX;
		var startY = event.touches[0].pageY;
		var x = startX;
		var y = startY;

		document.ontouchend = function(){
			if(typeof(tapFunction) == "function" && Math.sqrt(Math.pow(startX - x, 2) + Math.pow(startY -y, 2)) <= tap_maxDistance){
				tapFunction(args);
			}
			document.ontouchend = undefined;
			document.ontouchmove = undefined;
		};

		document.ontouchmove = function(e){
			if(Math.abs(startY - e.touches[0].pageY) > swipe_maxY){
				x = e.touches[0].pageX;
				y = e.touches[0].pageY;
				document.ontouchend(e);
				return false;
			}else if(Math.abs(startX - x) >= swipe_minDistance){
				if(Math.abs(y - e.touches[0].pageY) <= swipe_maxY){
					if(globalHide && startX > x){
						toggleHide();
					}else if(globalCollapse && globalHide >= 0){
						toggleAllSections();
					}
				}
				x = e.touches[0].pageX;
				y = e.touches[0].pageY;
				document.ontouchend(e);
			}else{
				x = e.touches[0].pageX;
				y = e.touches[0].pageY;
			}
		};
	}else if(typeof(tapFunction) == "function"){
		tapFunction(args);
	}
}

function isCollapseable(div){
	return (div && div.firstChild && div.lastChild && div.lastChild.firstChild);
}

function isGlobalCollapsed(){
	if(!globalCollapse){
		return false;
	}

	for(var i = 0; i < sections.length; i++){
		var div = document.getElementById(sections[i]);
		if(isCollapseable(div) && div.style.display != "none" && !collapsed[sections[i]]){
			return false;
		}
	}
	return true;
}

function toggleSection(args){
	var div = args[0];
	var instant = args[1];
	if(typeof(div) == "string"){
		div = document.getElementById(div);
	}
	if(!isCollapseable(div)){
		return false;
	}

	if(instant || !enableAnimations){
		div.lastChild.firstChild.style.webkitTransition = "";
	}else{
		div.lastChild.firstChild.style.webkitTransition = "all "+animationDuration+"ms ease-in-out";
	}

	if(collapsed[div.id] && !hasClass(div, "empty")){
		if(enableAnimations){
			div.lastChild.firstChild.style.marginTop = "0px";
		}else{
			div.lastChild.style.display = "block";
		}
		div.firstChild.className = div.firstChild.className.replace("collapsed", "expanded");
	}else{
		if(div.update && div.previous && div.limit != div.defaultLimit){
			div.limit = div.defaultLimit;
			div.update();
		}
		if(enableAnimations){
			div.lastChild.firstChild.style.marginTop = (-getSectionHeight(div))+"px";
		}else{
			div.lastChild.style.display = "none";
		}
		div.firstChild.className = div.firstChild.className.replace("expanded", "collapsed");
	}
	collapsed[div.id] = !collapsed[div.id];
}

function toggleAllSections(){
	if(!globalCollapse){
		return false;
	}

	var c = !isGlobalCollapsed();

	for(var i = 0; i < sections.length; i++){
		if(c){
			lastCollapsed[sections[i]] = Boolean(collapsed[sections[i]]);
		}
		collapsed[sections[i]] = c ? false : !lastCollapsed[sections[i]];
		toggleSection([sections[i], !animateGlobalCollapse]);
	}
}

function toggleHide(){
	if(!globalHide){
		return false;
	}

	for(var i = 0; i < sections.length; i++){
		if(!hideClock && sections[i] == "Clock"){
			continue;
		}
		var div = document.getElementById(sections[i]);
		div.style.display = (globalHide > 0 || hasClass(div, "empty") && hideEmptySections) ? "none" : "";
	}
	globalHide *= -1;
}

function revertCollapsed(id, subsectionPrefix){
	if(!revertCollapsedOnEmpty){
		return false;
	}

	collapsed[id] = defaultCollapsed[id];

	if(subsectionPrefix){
		for(var id in collapsed){
			if(id.indexOf(subsectionPrefix) == 0){
				delete collapsed[id];
			}
		}
	}
}

function subsectionCollapsed(id, parentID, isFirst){
	if(typeof(collapsed[id]) == "undefined"){
		collapsed[id] = expandFirst && !isFirst || !expandFirst && collapseChildren && defaultCollapsed[parentID];
	}
}

function updateTime(){
	window.clearTimeout(clockTimer);
	var now = new Date();
	document.getElementById("time").innerHTML = now.format(clock_format_time);
	clockTimer = window.setTimeout(updateTime, 1000 - (now.getTime() % 1000));
}

function updateClock(){
	var now = new Date();
	document.getElementById("date").innerHTML = now.format(format_date);

	if(showMonth){
		var today = now.getDate();

		var beginDate = new Date().zeroTime();
		beginDate.setDate(1);

		var endDate = new Date(beginDate);
		endDate.setMonth(beginDate.getMonth() + 1);

		var current = new Date(beginDate);

		current.setDate(current.getDate() + (startDay - beginDate.getDay()) - (startDay - beginDate.getDay() > 0 ? 7 : 0));

		var t = document.createElement("TABLE");
		t.id = "Month";
		t.align = "center";
		var tb = document.createElement("TBODY");
		var header = document.createElement("TR");
		for(var i = 0; i < 7; i++){
			var cell = document.createElement("TH");
			cell.width = "14%";
			cell.innerHTML = shortDays[(i + startDay) % 7];
			header.appendChild(cell);
		}
		tb.appendChild(header);
		while(current < endDate){
			var row = document.createElement("TR");
			for(var i = 0; i < 7; i++){
				var cell = document.createElement("TD");
				var date = current.getDate();
				cell.className = beginDate.getMonth() == current.getMonth() ? (today == date ? "today" : "thisMonth") : "otherMonth";
				var ymd = current.getFullYear() + "/" + (current.getMonth()+1) + "/" + date;
				var holy = ktHolidayName(ymd);

				if ( (cell.className == "otherMonth") &&
				     (current.getDay() == 0 || holy != "") )
					cell.className = "otherSun";
				else if(current.getDay() == 0 || holy != "") {
						if (cell.className == "today")
								cell.className = "sun-today";
						else
								cell.className = "sun";
				}
				else if(current.getDay() == 6 && cell.className == "otherMonth")
					cell.className = "otherSat";
				else if(current.getDay() == 6) {
						if (cell.className == "today")
								cell.className = "sat-today";
						else
								cell.className = "sat";
				}
				cell.innerHTML = date;
				current.setDate(date + 1);
				row.appendChild(cell);
			}
			tb.appendChild(row);
		}
		t.appendChild(tb);
		monthDIV.innerHTML = "";
		monthDIV.appendChild(t);
	}

	updateTime();
	window.clearTimeout(dayTimer);
	dayTimer = window.setTimeout(updateClock, new Date(now.getTime() + 86400000).zeroTime().getTime() - now.getTime());

	clockDIV.potentialHeight = clockDIV.offsetHeight;

	if(collapsed["Clock"] && showMonth){
		collapsed["Clock"] = false;
		toggleSection([clockDIV, true]);
	}
}

function hasClass(element, className){
	return element.className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'));
}

function addClass(element, className){
	if(!this.hasClass(element, className)){
		element.className += " " + className;
	}
}

function removeClass(element, className){
	if(hasClass(element, className)){
		var reg = new RegExp('(\\s|^)'+className+'(\\s|$)');
		element.className = element.className.replace(reg, ' ');
	}
}

