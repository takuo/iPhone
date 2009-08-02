mainCalendar = "Calendar One";

var cal = {"events":[
    {"calendar":"Calendar One","start":(new Date()).zeroTime().getTime(), "end":(new Date()).zeroTime().getTime()+24*3600000,"summary":"FOOBAR", "allDay":1},
    {"calendar":"Calendar One","start":(new Date()).zeroTime().getTime(), "end":(new Date()).zeroTime().getTime()+48*3600000,"summary":"FOOBAR2", "allDay":1},
    {"calendar":"Calendar One","start":(new Date()).getTime(), "end":(new Date()).getTime()+10000,"summary":"FoOoO", "allDay":0},
    {"calendar":"Calendar One","start":(new Date()).getTime(), "end":(new Date()).getTime()+90000,"summary":"BaAaR", "allDay":0},
    {"calendar":"Calendar One","start":(new Date()).zeroTime(), "end":(new Date()).zeroTime().getTime()+24*3600000,"summary":"My Birthday!", "allDay":1},
    {"calendar":"Calendar One","end":(new Date()).getTime()+76*3654000,"summary":"IT Email Server Migration","start":(new Date()).getTime()-94634000,"allDay":0},
    {"calendar":"Calendar Two","location":"CRDC Computer Science","summary":"Community System Security Architecture fjdsk fjk jk fjskla jflk jsfkl jsak","start":(new Date()).getTime() + 60*60*1000 ,"end":(new Date()).getTime() + 2*60*60*1000,"allDay":0},
    {"calendar":"Calendar One","location":"1.866.753.8247 #963 739 9511","summary":"Career track discussion","start":(new Date()).getTime() + 24*60*60*1000,"end":(new Date()).getTime() + 48*60*60*1000,"allDay":1},
    {"calendar":"Calendar Two","location":"CRDC Mathematics","summary":"Discuss Tier 2 and Tier 3 / Support & Engineering Services ","start":(new Date()).getTime() + 4*60*60*1000,"end":(new Date()).getTime() + 4.5*60*60*1000,"allDay":0},
    {"calendar":"Calendar Two","end":(new Date()).getTime() + 24*60*60*1000,"summary":"25%","start":(new Date()).getTime() + 25*60*60*1000,"allDay":0}
]};

var mail = {"messages":[
    {"account":"GMail", "subject":"foo","sender":"bar","received":(new Date()).getTime()},
    {"account":"GMail", "subject":"","sender":"baz","received":(new Date()).getTime()-120000},
    {"account":"Ashman", "subject":"bar","sender":"baz","received":(new Date()).getTime()-60000}
]};

var sms = {"messages":[
    {"text":"foo fjdks jlkf jdsalkfj dlksj kfj dslakj fkl sjakj fldksja fjdsafjdsjafkljds laf ldsf jsdalfjdls afj ldsaj fl","sender":"bar"}
]};

var calls = {
    "calls":[
        {"caller":"foo", "date":(new Date()).getTime()},
        {"caller":"bar", "date":(new Date()).getTime() - 60000}
    ],
    "voicemail":[
        {"caller":"foo", "date":(new Date()).getTime(), "duration":10},
        {"caller":"bar", "date":(new Date()).getTime() - 60000}
    ]
};

document.body.style.background = "gray";
window.setTimeout(function(){updatePhone(calls);updateCalendar(cal);updateMail(mail);updateSMS(sms);}, 1000);

