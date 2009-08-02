var string_weather = "天気";
var string_mail = "メール";
var string_calendar = "予定";
var string_calls = "不在着信";
var string_voicemail = "ボイスメール";
var string_sms = "SMS";
var string_twitter = "Twitter";
var string_twitter_timeline = "タイムライン";
var string_twitter_mentions = "返信";
var string_twitter_direct = "ダイレクト";
var string_city_names = { "yokohama":"横浜" };

var string_noSubject = "(無題)";
var string_from = "差出人:";
var string_noResponse = "応答なし";
var string_noCity = "不正な市";

var string_loadMore = "さらに読む";

// Time/date (see http://php.net/date for format syntax)
var format_time = "g:ia";
var clock_format_time = "H:i:s";

// Format for date
var format_date = "Fj日 l";

// Short format for date
var format_date_short = "y/j/n";

// Format for date and time
var format_date_time = format_date+" "+format_time;

// Short format for date and time
var format_date_time_short = format_date_short+" "+format_time;

var string_am = "am";
var string_pm = "pm";

// Don't forget the space after the prefix and before the suffix!
var string_begins_prefix = "開始まで";
var string_begins_suffix = "";
var string_began_prefix = "";
var string_began_suffix = "に開始";
var string_ends_prefix = "";
var string_ends_suffix = "で終了";

var future_prefix = "あと";
var future_suffix = "";
var past_prefix = "";
var past_suffix = "前";

var string_today = "今日";
var string_yesterday = "昨日";
var string_tomorrow = "明日";

var string_now = "現在";
var string_justNow = "たった今";
var string_JustUpdated = "更新済み";


var string_birthday = "誕生日";

var periods = [
	"秒",
	"分",
	"時間",
	"日",
	"週",
	"月",
	"年"
];

var periods_plural = periods;
/* [
	"seconds",
	"minutes",
	"hours",
	"days",
	"weeks",
	"months",
	"years"
];*/

var periods_short = periods;
/*[
	"s",
	"m",
	"h",
	"d",
	"w",
	"m",
	"y"
];*/

var shortMonths = [
	"1月",
	"2月",
	"3月",
	"4月",
	"5月",
	"6月",
	"7月",
	"8月",
	"9月",
	"10月",
	"11月",
	"12月"
];

var longMonths = shortMonths;
/* [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"7月",
	"August",
	"September",
	"October",
	"November",
	"December"
]; */

var shortDays = [
	"<span class='sun'>日</span>",
	"月",
	"火",
	"水",
	"木",
	"金",
	"<span class='sat'>土</span>"
];

var longDays = [
	"<span class='sun'>日曜日</span>",
	"月曜日",
	"火曜日",
	"水曜日",
	"木曜日",
	"金曜日",
	"<span class='sat'>土曜日</span>"
];

var weatherText = [
	"快晴",
	"晴れ",
	"一部晴れ",
	"一部曇り",
	"Hazy Sunshine",
	"ほとんど曇り",
	"曇り",
	"どんより雲",
	"",
	"",
	"霧",
	"小雨",
	"小雨",
	"小雨",
	"雷雨",
	"雷雨",
	"雷雨",
	"雨",
	"小雪",
	"小雪",
	"小雪",
	"雪",
	"雪",
	"氷",
	"みぞれ",
	"みぞれ",
	"",
	"",
	"Wintry Mix",
	"Hot",
	"Cold",
	"強風",

	"晴れ",
	"ほとんど晴れ",
	"一部曇り",
	"一部曇り",
	"煙霧",
	"ほとんど曇り",
	"小雨",
	"小雨",
	"雷雨",
	"雷雨",
	"小雪",
	"小雪"
];

