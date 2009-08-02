var callbacks = new Object();
callbacks['com.ashman.lockinfo.CalendarPlugin'] = updateCalendar;
callbacks['com.ashman.lockinfo.PhonePlugin'] = updatePhone;
callbacks['com.ashman.lockinfo.MailPlugin'] = updateMail;
callbacks['com.ashman.lockinfo.SMSPlugin'] = updateSMS;
var id_regex = new RegExp("[\\s'\"@.\*]", "g");

function updateView(bundleIdentifier, data){
	if(bundleIdentifier){
		var callback = callbacks[bundleIdentifier];
		if(callback){
			return !!callback(data);
		}
	}

	return false;
}

function updatePhone(phone){
	var success = false;
	if(phone.calls){
		if(phone.calls.length){
			success = updateCalls(phone.calls);
			removeClass(callsDIV, "empty");
		}else if(callsDIV){
			addClass(callsDIV, "empty");
			if(hideEmptySections){
				callsDIV.style.display = "none";
				revertCollapsed(callsDIV.id);
			}else{
				callsDIV.lastChild.innerHTML = "";
				document.getElementById("callCount").innerHTML = "0";
			}
			success = !phone.voicemail;
		}
	}

	if(phone.voicemail){
		if(phone.voicemail.length){
			success = updateVoicemail(phone.voicemail);
			removeClass(voicemailDIV, "empty");
		}else if(voicemailDIV){
			addClass(voicemailDIV, "empty");
			if(hideEmptySections){
				voicemailDIV.style.display = "none";
				revertCollapsed(voicemailDIV.id);
			}else{
				voicemailDIV.lastChild.innerHTML = "";
				document.getElementById("voicemailCount").innerHTML = "0";
			}
			success = true;
		}
	}
	return success;
}

function updateCalls(calls){
	if(!callsDIV){
		return false;
	}

	if(!calls){
		if(callsDIV.previous){
			calls = callsDIV.previous;
		}else{
			return false;
		}
	}
	var html = "";
	clearRelativeTimers(callsDIV);
	if(callsDIV && calls.length){
		callsDIV.previous = calls;
		if(globalHide >= 0){
			callsDIV.style.display = "block";
		}
		var relativeTimes = [];
		html += "<div>";
		for(i = 0; i < calls.length && i < callsDIV.limit; i++){
			var date = new Date(calls[i].date*1);
			html += "<div class='sub"+(i % 2 ? " alt" : '')+"'><span class='sub1'>"+calls[i].caller+"</span>";
			html += "<span class='sub2'> &ndash; "+date.format(date.isSameDay() ? format_time : format_date_time_short);
			if(displayRelativeTimes){
				html += " (<span id='calls_"+i+"'></span>)";
				relativeTimes.push(["calls_"+i, date]);
			}
			html += "</span></div>";
		}
		callsDIV.lastChild.innerHTML = html + "</div>";
		if(displayLoadMore && calls.length > callsDIV.limit){
			addLoadMoreBar(callsDIV);
		}
		for(i = 0; i < relativeTimes.length; i++){
			relativeTime(callsDIV, relativeTimes[i][0], relativeTimes[i][1], false, false, string_justNow.upperFirst());
		}
		if(collapsed[callsDIV.id]){
			collapsed[callsDIV.id] = false;
			toggleSection([callsDIV, true]);
		}
		document.getElementById("callCount").innerHTML = calls.length;
	}
	return true;
}

function updateVoicemail(vm){
	if(!voicemailDIV){
		return false;
	}

	if(!vm){
		if(voicemailDIV.previous){
			vm = voicemailDIV.previous;
		}else{
			return false;
		}
	}
	var html = "";
	clearRelativeTimers(voicemailDIV);
	if(voicemailDIV && vm.length){
		voicemailDIV.previous = vm;
		if(globalHide >= 0){
			voicemailDIV.style.display = "block";
		}
		var relativeTimes = [];
		html += "<div>";
		for(i = 0; i < vm.length && i < voicemailDIV.limit; i++){
			var date = new Date(vm[i].date*1);
			html += "<div class='sub"+(i % 2 ? " alt" : '')+"'><span class='sub1'>"+vm[i].caller+"</span>";
			html += "<span class='sub2'> &ndash; "+date.format(date.isSameDay() ? format_time : format_date_time_short);
			if(displayRelativeTimes){
				html += " (<span id='vm_"+i+"'></span>)";
				relativeTimes.push(["vm_"+i, date]);
			}
			html += "</span></div>";
		}
		voicemailDIV.lastChild.innerHTML = html + "</div>";
		if(displayLoadMore && vm.length > voicemailDIV.limit){
			addLoadMoreBar(voicemailDIV);
		}
		for(i = 0; i < relativeTimes.length; i++){
			relativeTime(voicemailDIV, relativeTimes[i][0], relativeTimes[i][1], false, false, string_justNow.upperFirst());
		}
		if(collapsed[voicemailDIV.id]){
			collapsed[voicemailDIV.id] = false;
			toggleSection([voicemailDIV, true]);
		}
		document.getElementById("voicemailCount").innerHTML = vm.length;
	}
	return true;
}

function updateSMS(sms){
	if(!smsDIV){
		return false;
	}

	if(!sms){
		if(smsDIV.previous){
			sms = smsDIV.previous;
		}else{
			return false;
		}
	}
	var html = "";
	var ids = {};
	var msgs = sms.messages;
	if(smsDIV && msgs.length){
		smsDIV.previous = sms;
		if(globalHide >= 0){
			smsDIV.style.display = "block";
		}
		for(i = 0; i < msgs.length && i < smsDIV.limit; i++){
			var smsID = "sms_"+i;
			ids[smsID] = true;
			subsectionCollapsed(smsID, "SMS", !i);
			if(i > 0){
				html += "</div>";
			}
			html += "<div id='"+smsID+"' class='sms_"+msgs[i].sender.replace(id_regex, "_")+"' ontouchstart='catchSwipe(event, toggleSection, [this]);' class='container'><div class='sub1 header expanded'><div class='arrow'></div><span>"+msgs[i].sender+"</span></div><div class='container'>";
			html += "<div class='sub sub1'>"+msgs[i].text+"</div></div>";
		}
		smsDIV.lastChild.innerHTML = html + "</div>";
		if(displayLoadMore && msgs.length > smsDIV.limit){
			addLoadMoreBar(smsDIV);
		}
		if(collapsed[smsDIV.id]){
			collapsed[smsDIV.id] = false;
			toggleSection([smsDIV, true]);
		}
		for(var id in collapsed){
			if(id.indexOf("sms_") == 0 && collapsed[id] && ids[id]){
				collapsed[id] = false;
				toggleSection([id, true]);
			}
		}
		document.getElementById("smsCount").innerHTML = msgs.length;
		removeClass(smsDIV, "empty");
	}else{
		addClass(smsDIV, "empty");
		if(hideEmptySections){
			smsDIV.style.display = "none";
			revertCollapsed(smsDIV.id, "sms_");
		}else{
			smsDIV.lastChild.innerHTML = "";
			document.getElementById("smsCount").innerHTML = "0";
		}
	}
	return true;
}

function updateMail(mail){
	if(!mailDIV){
		return false;
	}

	if(!mail){
		if(mailDIV.previous){
			mail = mailDIV.previous;
		}else{
			return false;
		}
	}
	var msgs = mail.messages;
	clearRelativeTimers(mailDIV);
	if(mailDIV && msgs.length){
		mailDIV.previous = mail;
		msgs.sort(function(a, b){
			return (separateMailAccounts && a.account != b.account) ?
				(a.account < b.account ? -1 : 1)
				: b.received*1 - a.received*1;
		});
		if(globalHide >= 0){
			mailDIV.style.display = "block";
		}
		var currentAccount;
		var accountCount = 0;
		var html = separateMailAccounts ? "" : "<div ontouchstart='catchSwipe(event, toggleSection, [this.parentNode.parentNode]);' class='container'>";
		var relativeTimes = [];
		var alt = '';
		var ids = {};
		for(i = 0; i < msgs.length && i < mailDIV.limit; i++){
			if(separateMailAccounts && msgs[i].account != currentAccount){
				var mailID = "mail_"+msgs[i].account.replace(id_regex, "_");
				ids[mailID] = true;
				subsectionCollapsed(mailID, "Mail", !i);
				if(currentAccount){
					html += "</div></div></div>";
				}
				alt = '';
				if(accountCount){
					html = html.replace(currentAccount+"_Count", accountCount);
				}
				currentAccount = msgs[i].account;
				accountCount = 0;
				html += "<div id=\""+mailID+"\" ontouchstart='catchSwipe(event, toggleSection, [this]);' class='container'><div class='sub1 header expanded'><div class='arrow'></div><span>"+currentAccount+" (<b>"+currentAccount+"_Count</b>)</span></div><div class='container'><div class='container'>";
			}

			var date = new Date(msgs[i].received*1);
			html += "<div class='sub"+alt+" mail_"+msgs[i].account.replace(id_regex, "_")+"'><span class='sub1'>"+(msgs[i].subject || string_noSubject)+"</span><br/>";
			html += "<span class='sub2'>"+string_from+"</span> <span class='sub1'>"+msgs[i].sender+"</span><span class='sub2'> &ndash; "+date.format(date.isSameDay() ? format_time : format_date_time_short);
			if(displayRelativeTimes){
				html += " (<span id='mail_time_"+i+"'> </span>)";
				relativeTimes.push(["mail_time_"+i, date]);
			}
			html += "</span></div>";

			accountCount++;
			alt = alt ? '' : " alt";
		}

		if(separateMailAccounts && accountCount > 0){
			html = html.replace(currentAccount+"_Count", accountCount) + "</div></div>";
		}
		mailDIV.lastChild.innerHTML = html + "</div>";
		if(displayLoadMore && msgs.length > mailDIV.limit){
			addLoadMoreBar(mailDIV);
		}
		for(i = 0; i < relativeTimes.length; i++){
			relativeTime(mailDIV, relativeTimes[i][0], relativeTimes[i][1], false, false, string_justNow.upperFirst());
		}
		if(collapsed[mailDIV.id]){
			collapsed[mailDIV.id] = false;
			toggleSection([mailDIV, true]);
		}
		for(var id in collapsed){
			if(id.indexOf("mail_") == 0 && collapsed[id] && ids[id]){
				collapsed[id] = false;
				toggleSection([id, true]);
			}
		}
		document.getElementById("mailCount").innerHTML = msgs.length;
		removeClass(mailDIV, "empty");
	}else{
		addClass(mailDIV, "empty");
		if(hideEmptySections){
			mailDIV.style.display = "none";
			revertCollapsed(mailDIV.id, "mail_");
		}else{
			mailDIV.lastChild.innerHTML = "";
			document.getElementById("mailCount").innerHTML = "0";
		}
	}
	return true;
}

function updateCalendar(calendar){
	if(!calendarDIV){
		return false;
	}

	if(!calendar || !calendar.events){
		if(calendarDIV.previous){
			calendar = calendarDIV.previous;
		}else{
			return false;
		}
	}
	var events = [];
	var now = new Date();
	for(var i = 0; i < calendar.events.length; i++){
		if(calendar.events[i].end > now){
			events[events.length] = calendar.events[i];
		}
	}

	clearRelativeTimers(calendarDIV);

	if(calendarDIV && events.length){
		if(separateCalendars){
			events.sort(function(a, b){
				if((a.calendar == mainCalendar || b.calendar == mainCalendar) && a.calendar != b.calendar){
					return a.calendar == mainCalendar ? -1 : 1;
				}else{
					return a.calendar != b.calendar ? (a.calendar < b.calendar ? -1 : 1) : a.start != b.start ? a.start - b.start : a.end - b.end;
				}
			});
		}else{
			events.sort(function(a, b){
				return a.start != b.start ? a.start - b.start : a.end - b.end;
			});
		}

		window.clearTimeout(window.cal_refresh);
		calendarDIV.previous = calendar;
		var timeout = (new Date(now.getTime() + 86400000)).zeroTime().getTime() - now.getTime();
		if(globalHide >= 0){
			calendarDIV.style.display = "block";
		}
		var currentCal;
		var currentDate;
		var html = "";
		var relativeTimes = [];
		var day = 0;
		var alt = '';
		var ids = {};
		var headerCount = 0;
		var eventCounts = {};
		var today = new Date().format("Y-n-j");
		if(separateCalendars){
			eventCounts[mainCalendar] = {total:0, days:{}};
			eventCounts[mainCalendar].days[today] = 0;
		}else{
			eventCounts[today] = 0;
		}

		for(var i = 0; i < events.length; i++){
			var d = new Date(events[i].start).format("Y-n-j");
			if(separateCalendars){
				if(!eventCounts[events[i].calendar]){
					eventCounts[events[i].calendar] = {total:1, days:{}};
					eventCounts[events[i].calendar].days[today] = 0;
				}else{
					eventCounts[events[i].calendar].total++;
				}

				if(!eventCounts[events[i].calendar].days[d]){
					eventCounts[events[i].calendar].days[d] = 1;
				}else{
					eventCounts[events[i].calendar].days[d]++;
				}
			}else{
				if(!eventCounts[d]){
					eventCounts[d] = 1;
				}else{
					eventCounts[d]++;
				}
			}
		}
		headerCount = separateCalendars ? (calendarCountToday ? eventCounts[mainCalendar].days[today] : eventCounts[mainCalendar].total) : calendarCountToday ? eventCounts[today] : events.length;

		for(var i = 0; i < events.length && i < calendarDIV.limit; i++){
			var start = new Date(events[i].start);
			var end = new Date(events[i].end);
			if(separateCalendars && currentCal != events[i].calendar){
				var calID = "cal_"+events[i].calendar.replace(id_regex, "_");
				ids[calID] = true;
				subsectionCollapsed(calID, "Calendar", !i);
				currentCal = events[i].calendar;
				currentDate = null;
				alt = '';
				day = 0;
				html += "<div id=\""+calID+"\" class='container'><div class='cal sub1 header expanded' ontouchstart='catchSwipe(event, toggleSection, [this.parentNode]);'><div class='arrow'></div><span>"+currentCal+" (<b>"+eventCounts[currentCal].total+"</b>)</span></div><div class='container'><div class='container'>";
			}
			if(separateCalendarDays && (!currentDate || !currentDate.isSameDay(start))){
				var dayID = "cal_"+(separateCalendars ? events[i].calendar.replace(id_regex, "_")+"_" : '')+"day_"+day;
				ids[dayID] = true;
				subsectionCollapsed(dayID, "Calendar", !currentDate);
				currentDate = start;
				day++;
				alt = '';
				var d = start.format("Y-n-j");
				html += "<div id=\""+dayID+"\" ontouchstart='catchSwipe(event, toggleSection, [this]);' class='container'><div class='sub"+(separateCalendars?2:1)+" header expanded'><div class='arrow'></div><span><b>"+start.format(format_date)+"</b> (<span class='capitalize'>"+start.relative(true)+"</span>) (<b>"+(separateCalendars ? eventCounts[currentCal].days[d] : eventCounts[d])+"</b>)</span></div><div class='container'><div class='container'>";
			}
			var regexp = new RegExp("birthday|"+string_birthday, "i");
			html += "<div class='sub"+alt+" cal_"+events[i].calendar.replace(id_regex, "_")+(events[i].summary.match(regexp) ? " birthday" : "")+(events[i].allDay ? " allDay" : "")+"'>";

			var titleText = "<span class='sub1'>"+events[i].summary+"</span>";
			var locationText = events[i].location ? "<span class='sub2'> @ "+events[i].location+"</span>" : "";
			if(!events[i].allDay || events[i].start + 86400000 < events[i].end){
				var format = separateCalendarDays && end.isSameDay(start) ? format_time : (events[i].allDay ? format_date_short : format_date_time_short);
				var startText = start.format(format);
				var endText = end.format(format);
				if(displayRelativeTimes && (start.isSameDay(now) || start < now)){
					if(start > now){
						var relativeText = "<span class='relativeTime sub2'>("+string_begins_prefix+"<span id=\""+dayID+"_"+i+"\"></span>"+string_begins_suffix+")</span>";
						relativeTimes.push([dayID+"_"+i, start, events[i].allDay, events[i].allDay, string_now]);
						var timeout2 = start.getTime() - now.getTime();
						if(timeout2 < timeout){
							timeout = timeout2;
						}
					}else if(events[i].allDay && start.isSameDay(currentDate)){
						var relativeText = "<span class='relativeTime sub2'> ("+string_ends_prefix+"<span id=\""+dayID+"_"+i+"\"></span>"+string_ends_suffix+")</span>";
						relativeTimes.push([dayID+"_"+i, end, true, false, '']);
					}else{
						var relativeText = "<span class='relativeTime sub2'>("+string_began_prefix+"<span id=\""+dayID+"_"+i+"_start\"></span>"+string_began_suffix+" | "+string_ends_prefix+"<span id=\""+dayID+"_"+i+"_end\"></span>"+string_ends_suffix+")</span>";
						relativeTimes.push([dayID+"_"+i+"_start", start, events[i].allDay, false, string_justNow]);
						relativeTimes.push([dayID+"_"+i+"_end", end, events[i].allDay, false, string_now]);

						var timeout2 = end.getTime() - now.getTime();
						if(timeout2 < timeout){
							timeout = timeout2;
						}
					}
				}else{
					var relativeText = '';
				}
			}else{
				var startText = separateCalendarDays ? '' : start.format(format_date_short);
				var endText = '';
				var relativeText = '';
			}
			
			if(separateCalendarTimes){
				if(relativeText){
					relativeText = " " + relativeText;
				}
				if(endText){
					endText = "<br/>" + endText;
				}
				html += (startText ? "<div class='time sub1' style='white-space:nowrap;display:table-cell;padding-right:5px;'>"+startText+endText+"</div>" : '')+"<div style='display:table-cell;'>"+titleText+locationText+relativeText+"</div>";
			}else{
				if(relativeText){
					relativeText = " " + relativeText;
				}
				if(startText){
					startText = "<br/><span class='time sub"+(displayRelativeTimes ? 1 : 2)+"'>" + startText + (endText ? " &ndash; " + endText : '') + "</span>";
				}
				html += titleText+locationText+startText+relativeText;
			}

			alt = alt ? '' : " alt";
			html += "</div>";
			if(events[i+1] && separateCalendars && separateCalendarDays && currentCal != events[i+1].calendar){
				html += "</div></div></div></div></div></div>";
			}else if(events[i+1] && (separateCalendarDays && !currentDate.isSameDay(new Date(events[i+1].start)) || separateCalendars && currentCal != events[i+1].calendar && !separateCalendarDays)){
				html += "</div></div></div>";
			}
		}
		if(separateCalendarDays || separateCalendars){
			html += "</div></div></div>";
		}
		if(separateCalendarDays && separateCalendars){
			html += "</div></div></div>";
		}
		calendarDIV.lastChild.innerHTML = html;
		if(displayLoadMore && events.length > calendarDIV.limit){
			addLoadMoreBar(calendarDIV);
		}
		document.getElementById("calendarCount").innerHTML = headerCount;
		for(i = 0; i < relativeTimes.length; i++){
			relativeTime(calendarDIV, relativeTimes[i][0], relativeTimes[i][1], relativeTimes[i][2], relativeTimes[i][3], relativeTimes[i][4], relativeTimes[i][5]);
		}
		if(collapsed[calendarDIV.id]){
			collapsed[calendarDIV.id] = false;
			toggleSection([calendarDIV, true]);
		}
		for(var id in collapsed){
			if(id.indexOf("cal_") == 0 && collapsed[id] && ids[id]){
				collapsed[id] = false;
				toggleSection([id, true]);
			}
		}
		window.cal_refresh = window.setTimeout(updateCalendar, timeout);
		removeClass(calendarDIV, "empty");
	}else{
		addClass(calendarDIV, "empty");
		if(hideEmptySections){
			calendarDIV.style.display = "none";
			revertCollapsed(calendarDIV.id, "cal_");
		}else{
			calendarDIV.lastChild.innerHTML = "";
			document.getElementById("calendarCount").innerHTML = "0";
		}
	}
	return true;
}

