// jse-date-w3cdtf.js
// JavaScript extention for W3C Date and Time Formats
// COPYRIGHT 2005 Kawasaki Yusuke <u-suke@kawa.net>
// SEEALSO http://www.w3.org/TR/NOTE-datetime

Date.prototype.setW3CDTF = function( dtf ) {
    var sp = dtf.split( /[^0-9]/ );
    if ( sp.length < 6 || sp.length > 8 ) return;

	if ( sp.length == 7 ) {
		if ( dtf.charAt( dtf.length-1 ) != "Z" ) return;
	}

    // to numeric
    for( var i=0; i<sp.length; i++ ) sp[i] = sp[i]-0;

    if ( sp[0] < 1970 ||		// year
	 sp[1] < 1 || sp[1] > 12 ||	// month
	 sp[2] < 1 || sp[2] > 31 ||	// day
	 sp[3] < 0 || sp[3] > 23 ||	// hour
	 sp[4] < 0 || sp[4] > 59 ||	// min
	 sp[5] < 0 || sp[5] > 60 ) {	// sec
	return; 			// invalid date
    }

    // get UTC milli seconds
    var msec = Date.UTC( sp[0], sp[1]-1, sp[2], sp[3], sp[4], sp[5] );

    // time zene offset
    if ( sp.length == 8 ) {
//	if ( dtf.indexOf("-") > 0 ) sp[6] *= -1;    // bug fix: 2006/03/06
	if ( dtf.indexOf("+") < 0 ) sp[6] *= -1;
	if ( sp[6] < -12 || sp[6] > 13 ) return;    // time zone offset hour
	if ( sp[7] < 0 || sp[7] > 59 ) return;	    // time zone offset min
	msec -= (sp[6]*60+sp[7]) * 60000;
    }

    // set by milli second;
    return this.setTime( msec );
}

Date.prototype.getW3CDTF = function() {
    var year = this.getFullYear();
    var mon  = this.getMonth()+1;
    var day  = this.getDate();
    var hour = this.getHours();
    var min  = this.getMinutes();
    var sec  = this.getSeconds();
    if ( mon  < 10 ) mon  = "0"+mon;
    if ( day  < 10 ) day  = "0"+day;
    if ( hour < 10 ) hour = "0"+hour;
    if ( min  < 10 ) min  = "0"+min;
    if ( sec  < 10 ) sec  = "0"+sec;

    var tzos = this.getTimezoneOffset();
    var tzhour = tzos / 60;
    var tzmin  = tzos % 60;
    var tzpm = ( tzhour > 0 ) ? "-" : "+";
    if ( tzhour < 0 ) tzhour *= -1;
    if ( tzhour < 10 ) tzhour = "0"+tzhour;
    if ( tzmin	< 10 ) tzmin  = "0"+tzmin;

    var dtf = year+"-"+mon+"-"+day+"T"+hour+":"+min+":"+sec+tzpm+tzhour+":"+tzmin;
    return dtf;
}
