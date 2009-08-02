var string_weather = "Météo";
var string_mail = "Mail(s)";
var string_calendar = "Calendrier";
var string_calls = "Appel(s) en absence";
var string_voicemail = "Messagerie vocale";
var string_sms = "SMS";

var string_noSubject = "(aucun sujet)";
var string_from = "De:";
var string_noResponse = "Pas de réponse";
var string_noCity = "Ville incorrecte";

var string_loadMore = "Mails suivants...";

// Time/date (see http://php.net/date for format syntax)
var format_time = "G:i";
var clock_format_time = "G:i";

// Format for date
var format_date = "F l j";

// Short format for date
var format_date_short = "j/n/y";

// Format for date and time
var format_date_time = format_date+" "+format_time;

// Short format for date and time
var format_date_time_short = format_date_short+" "+format_time;

var string_am = "am";
var string_pm = "pm";

// Don't forget the space after the prefix and before the suffix!
var string_begins_prefix = "Commence ";
var string_begins_suffix = "";
var string_began_prefix = "A commencé, ";
var string_began_suffix = "";
var string_ends_prefix = "Fini ";
var string_ends_suffix = "";

var future_prefix = "dans ";
var future_suffix = "";
var past_prefix = "il y a ";
var past_suffix = "";

var string_today = "aujourd'hui";
var string_yesterday = "hier";
var string_tomorrow = "demain";

var string_now = "à l'instant";
var string_justNow = "à l'instant";
var string_JustUpdated = "Mis à jour";

var string_birthday = "anniversaire";

var periods = [
	"seconde",
	"minute",
	"heur",
	"jour",
	"semaine",
	"mois",
	"année"
];

var periods_plural = [
	"secondes",
	"minutes",
	"heures",
	"jours",
	"semaines",
	"mois",
	"années"
];

var periods_short = [
	"s",
	"m",
	"h",
	"j",
	"s",
	"m",
	"a"
];

var shortMonths = [
	"Jan",
	"Fev",
	"Mar",
	"Avr",
	"Mai",
	"Juin",
	"Juil",
	"Aoû",
	"Sep",
	"Oct",
	"Nov",
	"Déc"
];

var longMonths = [
	"Janvier",
	"Février",
	"Mars",
	"Avril",
	"Mai",
	"Juin",
	"Juillet",
	"Août",
	"Septembre",
	"Octobre",
	"Novembre",
	"Décembre"
];

var shortDays = [
	"Dim",
	"Lun",
	"Mar",
	"Mer",
	"Jeu",
	"Ven",
	"Sam"
];

var longDays = [
	"Dimanche",
	"Lundi",
	"Mardi",
	"Mercredi",
	"Jeudi",
	"Vendredi",
	"Samedi"
];

var weatherText = [
	"Soleil",
	"Ensoleillé",
	"Quelques rayons de soleil",
	"Légèrement couvert",
	"Soleil & brume",
	"Très couvert",
	"Nuageux",
	"Temps maussade",
	"",
	"",
	"Brumeux",
	"Averses",
	"Averses",
	"Averses",
	"Orages",
	"Orages",
	"Orages",
	"Pluie",
	"Ciel agité",
	"Ciel agité",
	"Ciel agité",
	"Chute de neige",
	"Chute de neige",
	"Verglas",
	"Neige fondue",
	"Pluie verglaçante",
	"",
	"",
	"Pluie et neige mêlées",
	"Chaleur",
	"Froid",
	"Venteux",
	"Ciel dégagé",
	"Ciel dégagé",
	"Légèrement couvert",
	"Légèrement couvert",
	"Brumeux",
	"Très couvert",
	"Averses",
	"Averses",
	"Orages",
	"Orages",
	"Ciel agité",
	"Ciel agité"
];
