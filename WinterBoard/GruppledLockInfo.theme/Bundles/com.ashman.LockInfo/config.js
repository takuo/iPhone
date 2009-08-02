/*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
// GENERAL SETTINGS

// Your country code
// If it's not in the strings/ folder, please translate strings/en.js and send to gruppler@gmail.com
var language = "en";
// NOTE: to change time formats, look in strings/en.js (or whatever language file you're using)

// Arrange and/or disable (by commenting-out) sections:
// To enable a section, remove the "//" at the beginning of the line
var sections = [
//	"Clock",
	"Weather",
	"Mail",
	"Calendar",
	"Calls",
	"Voicemail",
	"SMS",
];

// If "Clock" is enabled in the "sections" list above, this shows the bigger custom clock
var useBigClock = true;

// Display arrows in headers?
var displayArrows = true;

// Draw a monthly calendar as a collapsable subsection of the custom clock
var showMonth = true;

// The day the week will start on; 0(Sun) to 6(Sat)
var startDay = 0;

/*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
// EXPAND/COLLAPSE SETTINGS

// Collapse or expand main sections by default; comment-out or set to false to expand...
// To collapse a section by default, remove the "//" at the beginning of the line
var defaultCollapsed = {
	"Clock":true,
	"Mail":true,
//	"Calendar":true,
	"Calls":true,
	"Voicemail":true,
	"SMS":true,
//	"Weather":true,
};

// Enable global collapse/expand by swiping right (or left, if globalHide is false)?
var globalCollapse = true;

// Enable global hide toggling by swiping left (or right, if globalCollapse is false)?
var globalHide = true;

// If globalHide is true and custom clock is enabled, hide the clock too?
var hideClock = false;

// Set to false for instant section collapse/expand, or true for webkit CSS animations
var enableAnimations = false;
var animationDuration = 450;	// Milliseconds

// Animate the global collapse/expand? (Requires enableAnimations to be true)
var animateGlobalCollapse = false;

// Collapse subsections in sections that are to be collapsed by default (listed above)?
var collapseChildren = true;

// Always expand the first subsection?	Note: this overrides collapseChildren;
// subsequent sections will be collapsed regardless of main section's default
var expandFirst = true;

// Revert to default collapse/expand settings when a section is empty?
var revertCollapsedOnEmpty = true;

// Hide empty sections?
var hideEmptySections = true;

/*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
// SECTION DISPLAY SETTINGS

// Display the "Load More" bar at the bottom of each section if the item limit was reached?
var displayLoadMore = true;

// If displayLoadMore is enabled, how many more should load each time the bar is pressed?
var loadIncrement = 5;

// Display each calendar as a separate section?
// Note: If true, there will be an extra subheader, even if there's only one calendar.
var separateCalendars = false;

// Display each day as a separate section?
// Note: If true, there will be an extra subheader, even if there's only one day with events.
var separateCalendarDays = true;

// Display events' times/dates in a separate column?
var separateCalendarTimes = true;

// Sort this calendar first if separateCalendars is true
var mainCalendar = "Calendar";

// Show count for only today' events?
var calendarCountToday = false;

// Limit the number of events to show
var calendarLimit = 10;

// Display each email account as a separate subsection?
// Note: If true, there will be an extra subheader, even if there's only one email account.
var separateMailAccounts = false;

// Limit the number of emails to show
var mailLimit = 5;

// Limit the number of missed calls to show
var callLimit = 5;

// Limit the number of voicemails to show
var voicemailLimit = 5;

// Limit the number of SMS messages to show
var smsLimit = 5;

/*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
// RELATIVE TIME SETTINGS

// Show relative times or absolute times?
var displayRelativeTimes = true;

// Show short periods or long periods?
// Ex.
// false -> "3 hours, 2 minutes"
// true -> "3h 2m"
var displayShortPeriods = true;

// How many periods to display if not rounded? (Excludes seconds unless time < 1 minute)
// Ex.
// relativeTimeLength = 1 -> "3h"
// relativeTimeLength = 2 -> "3h 2m"
var relativeTimeLength = 2;

// Limit the frequency of updates for relative time, and round seconds:
var relativeUpdateLimit = 15;	//Seconds

// Specify how time should be rounded.
//	1: Round up (ceiling)
//	0: Normal round
// -1: Round down (floor)
var roundPeriods = [
	1,	// seconds
	1,	// minutes
	0,	// hours
	-1, // days
	0,	// weeks
	0,	// months
	0,	// years
	0	// decades
];

/*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
// WEATHER SETTINGS

// Produced by Adam Watkins (http://www.stupidpupil.co.uk)
// Modified by Craig Laparo (gruppler@gmail.com)

// Locations, following the same format as "locale" above.  Add as many as you want, separated by commas.
// The first one in the list will be displayed on the weather header.
// Ex. "OCN|AU|VIC|MELBOURNE", "ASI|PH|MAKATI" e.g. 'Defiance, Ohio'|'Moscow, Russia'|'London, UK'
// Visit http://accuweather.com to find something that works
var locales = [
	"43004",
	"43201",
];

// Show the first city's current weather in the main header?
// Set this to false if you have multiple cities and don't want a rundundant header...
var mainHeaderWeather = true;

// Show the first city's name in the main header, or hide it?
var displayMainCityName = false;

// Show the other cities' names in their subheaders, or hide them?
var displayCityNames = true;

// Limit the number of days to display (also limited by the weather source; 7 seems to be the max)
var weatherDayLimit = 7;

// Set to 'false' if you'd prefer Farenheit
var isCelsius = true;

// Use 'Real Feel' temperatures where possible, taking into account Wind Chill, Humidity etc.
var useRealFeel = false;

// What should separate hi temperatures from low temperatures?
// use "<br>" to put them on separate lines, or something else like "|", for example.
var weatherTempSeparator = "<br>";

// Images must follow the same naming schema as the 'klear' set (borrowed from KWeather)
var iconSet = "tick"; //'klear'|'tick'
var iconExt = ".png"; //'.png'|'.gif'|etc.

// Display the refresh icon in the header? If not, you can still tap the update time to refresh.
var displayWeatherRefreshButton = true;

// To disable automatic refresh/retry, set to 0
var weatherUpdateInterval = 15;	//Minutes
var weatherRetryInterval = 0.5;	//Minutes

// If stop trying after this many consecutive failed attempts (set to 0 for infinite retries):
var weatherRetriesMax = 3;

// The (currently broken) 'Yahoo' which for the 'locale' requires a US zip or location code
// (e.g. UKXX0085 or CHXX0008) from http://weather.yahoo.com
var weatherSource = "Apple"; // "Yahoo" is broken for now, so use "Apple"

/*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
// SWIPE SETTINGS

// The MAXIMUM distance your finger can move to trigger a 'tap'
var tap_maxDistance = 3;

// The MINIMUM distance your finger must move to trigger a 'swipe'
var swipe_minDistance = 60;

// The MAXIMUM vertical distance your finger can move to trigger a 'swipe'
var swipe_maxY = 20;

/*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
// Do not change this...

if(language != "en"){
	var headID = document.getElementsByTagName("head")[0];
	var scriptNode = document.createElement('script');
	scriptNode.type = 'text/javascript';
	scriptNode.src = 'strings/'+language+'.js';
	headID.appendChild(scriptNode);
}

