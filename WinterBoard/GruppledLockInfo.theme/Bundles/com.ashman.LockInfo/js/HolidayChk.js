<!--
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/
//_/ CopyRight(C) K.Tsunoda(AddinBox) 2001 All Rights Reserved.
//_/ ( http://www.h3.dion.ne.jp/~sakatsu/index.htm )
//_/
//_/   ‚±‚Ìj“ú”»’èƒR[ƒh‚ÍwExcel:ktŠÖ”ƒAƒhƒCƒ“x‚Åg—p‚µ‚Ä‚¢‚é
//_/   ‚u‚a‚`ƒ}ƒNƒ‚ğ[JavaScript]‚ÉˆÚA‚µ‚½‚à‚Ì‚Å‚·B
//_/   ‚±‚ÌŠÖ”‚Å‚ÍA‚Q‚O‚O‚V”N{s‚Ì‰ü³j“ú–@(º˜a‚Ì“ú)‚Ü‚Å‚ğ
//_/ @ƒTƒ|[ƒg‚µ‚Ä‚¢‚Ü‚·(‚XŒ‚Ì‘–¯‚Ì‹x“ú‚ğŠÜ‚Ş)B
//_/
//_/ (*1)‚±‚ÌƒR[ƒh‚ğˆø—p‚·‚é‚É“–‚½‚Á‚Ä‚ÍA•K‚¸‚±‚ÌƒRƒƒ“ƒg‚à
//_/ ˆê‚Éˆø—p‚·‚é–‚Æ‚µ‚Ü‚·B
//_/ (*2)‘¼ƒTƒCƒgã‚Å–{ƒ}ƒNƒ‚ğ’¼Úˆø—p‚·‚é–‚ÍA‚²‰“—¶Šè‚¢‚Ü‚·B
//_/ y http://www.h3.dion.ne.jp/~sakatsu/holiday_logic.htm z
//_/ ‚Ö‚ÌƒŠƒ“ƒN‚É‚æ‚éĞ‰î‚Å‘Î‰‚µ‚Ä‰º‚³‚¢B
//_/ (*3)[ktHolidayName]‚Æ‚¢‚¤ŠÖ”–¼‚»‚Ì‚à‚Ì‚ÍAŠe©‚ÌŠÂ‹«‚É
//_/ ‚¨‚¯‚é–½–¼‹K‘¥‚É‰ˆ‚Á‚Ä•ÏX‚µ‚Ä‚à\‚¢‚Ü‚¹‚ñB
//_/ 
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
// 2008/10/29 •Ï”‚Ìvarw’è‚ª–³‚­ALˆæ•Ï”ˆµ‚¢‚É‚È‚Á‚Ä‚¢‚½‚Ì‚ğC³‚µ‚Ü‚µ‚½B

var MONDAY = 1;
var TUESDAY = 2;
var WEDNESDAY = 3;

// JavaScript‚Åˆµ‚¦‚é“ú•t‚Í1970/1/1`‚Ì‚İ
//var cstImplementTheLawOfHoliday = new Date("1948/7/20");  // j“ú–@{s
//var cstAkihitoKekkon = new Date("1959/4/10");              // –¾me‰¤‚ÌŒ‹¥‚Ì‹V
var cstShowaTaiso = new Date("1989/2/24");                // º˜a“Vc‘å‘r‚Ì—ç
var cstNorihitoKekkon = new Date("1993/6/9");            // “¿me‰¤‚ÌŒ‹¥‚Ì‹V
var cstSokuireiseiden = new Date("1990/11/12");          // ‘¦ˆÊ—ç³“a‚Ì‹V
var cstImplementHoliday = new Date("1973/4/12");        // U‘Ö‹x“ú{s

// [prmDate]‚É‚Í "yyyy/m/d"Œ`®‚Ì“ú•t•¶š—ñ‚ğ“n‚·
function ktHolidayName(prmDate)
{
  var MyDate = new Date(prmDate);
  var HolidayName = prvHolidayChk(MyDate);
  var YesterDay;
  var HolidayName_ret;

  if (HolidayName == "") {
      if (MyDate.getDay() == MONDAY) {
          // Œ—jˆÈŠO‚ÍU‘Ö‹x“ú”»’è•s—v
          // 5/6(‰Î,…)‚Ì”»’è‚ÍprvHolidayChk‚Åˆ—Ï
          // 5/6(Œ)‚Í‚±‚±‚Å”»’è‚·‚é
          if (MyDate.getTime() >= cstImplementHoliday.getTime()) {
              YesterDay = new Date(MyDate.getFullYear(),
                                     MyDate.getMonth(),(MyDate.getDate()-1));
              HolidayName = prvHolidayChk(YesterDay);
              if (HolidayName != "") {
                  HolidayName_ret = "U‘Ö‹x“ú";
              } else {
                  HolidayName_ret = "";
              }
          } else {
              HolidayName_ret = "";
          }
      } else {
          HolidayName_ret = "";
      }
  } else {
      HolidayName_ret = HolidayName;
  }

  return HolidayName_ret;
}

//===============================================================

function prvHolidayChk(MyDate)
{
  var MyYear = MyDate.getFullYear();
  var MyMonth = MyDate.getMonth() + 1;    // MyMonth:1`12
  var MyDay = MyDate.getDate();
  var Result = "";
  var NumberOfWeek;
  var MyAutumnEquinox;

// JavaScript‚Åˆµ‚¦‚é“ú•t‚Í1970/1/1`‚Ì‚İ‚Åj“ú–@{sŒã‚È‚Ì‚Å‰º‹L‚Í•s—v
// if (MyDate.getTime() < cstImplementTheLawOfHoliday.getTime()) {
// @@return ""; // j“ú–@{s(1948/7/20)ˆÈ‘O
// } else;

  switch (MyMonth) {
// ‚PŒ //
  case 1:
      if (MyDay == 1) {
          Result = "Œ³“ú";
      } else {
          if (MyYear >= 2000) {
              NumberOfWeek = Math.floor((MyDay - 1) / 7) + 1;
              if ((NumberOfWeek == 2) && (MyDate.getDay() == MONDAY)) {
                  Result = "¬l‚Ì“ú";
              } else;
          } else {
              if (MyDay == 15) {
                  Result = "¬l‚Ì“ú";
              } else;
          }
      }
      break;
// ‚QŒ //
  case 2:
      if (MyDay == 11) {
          if (MyYear >= 1967) {
              Result = "Œš‘‹L”O‚Ì“ú";
          } else;
      } else {
          if (MyDate.getTime() == cstShowaTaiso.getTime()) {
              Result = "º˜a“Vc‚Ì‘å‘r‚Ì—ç";
          } else;
      }
      break;
// ‚RŒ //
  case 3:
      if (MyDay == prvDayOfSpringEquinox(MyYear)) {  // 1948`2150ˆÈŠO‚Í[99]
          Result = "t•ª‚Ì“ú";                       // ‚ª•Ô‚é‚Ì‚Å¤•K‚¸‚‚É‚È‚é
      } else;
      break;
// ‚SŒ //
  case 4:
      if (MyDay == 29) {
          if (MyYear >= 2007) {
              Result = "º˜a‚Ì“ú";
          } else {
              if (MyYear >= 1989) {
                  Result = "‚İ‚Ç‚è‚Ì“ú";
              } else {
                Result = "“Vc’a¶“ú";
              }
          }
      } else {
          // JavaScript‚Åˆµ‚¦‚é“ú•t‚Í1970/1/1`‚Ì‚İ‚È‚Ì‚Å‰º‹L‚Í•s—v
          // if (MyDate.getTime() == cstAkihitoKekkon.getTime()) {
          // @@Result = "c‘¾q–¾me‰¤‚ÌŒ‹¥‚Ì‹V";@@// (=1959/4/10)
          // } else;
      }
      break;
// ‚TŒ //
  case 5:
      switch ( MyDay ) {
        case 3:  // ‚TŒ‚R“ú
          Result = "Œ›–@‹L”O“ú";
          break;
        case 4:  // ‚TŒ‚S“ú
          if (MyYear >= 2007) {
              Result = "‚İ‚Ç‚è‚Ì“ú";
          } else {
              if (MyYear >= 1986) {
                  if (MyDate.getDay() > MONDAY) {
                  // 5/4‚ª“ú—j“ú‚Íw‘ü‚Ì“ú—jx¤Œ—j“ú‚ÍwŒ›–@‹L”O“ú‚ÌU‘Ö‹x“úx(`2006”N)
                      Result = "‘–¯‚Ì‹x“ú";
                  } else;
              } else;
          }
          break;
        case 5:  // ‚TŒ‚T“ú
          Result = "‚±‚Ç‚à‚Ì“ú";
          break;
        case 6:  // ‚TŒ‚U“ú
          if (MyYear >= 2007) {
              if ((MyDate.getDay() == TUESDAY) || (MyDate.getDay() == WEDNESDAY)) {
                  Result = "U‘Ö‹x“ú";    // [5/3,5/4‚ª“ú—j]ƒP[ƒX‚Ì‚İA‚±‚±‚Å”»’è
              } else;
          } else;
          break;
      }
      break;
// ‚UŒ //
  case 6:
      if (MyDate.getTime() == cstNorihitoKekkon.getTime()) {
          Result = "c‘¾q“¿me‰¤‚ÌŒ‹¥‚Ì‹V";
      } else;
      break;
// ‚VŒ //
  case 7:
      if (MyYear >= 2003) {
          NumberOfWeek = Math.floor((MyDay - 1) / 7) + 1;
          if ((NumberOfWeek == 3) && (MyDate.getDay() == MONDAY)) {
              Result = "ŠC‚Ì“ú";
          } else;
      } else {
          if (MyYear >= 1996) {
              if (MyDay == 20) {
                  Result = "ŠC‚Ì“ú";
              } else;
          } else;
      }
      break;
// ‚XŒ //
  case 9:
      //‘æ‚RŒ—j“ú(15`21)‚ÆH•ª“ú(22`24)‚ªd‚È‚é–‚Í‚È‚¢
      MyAutumnEquinox = prvDayOfAutumnEquinox(MyYear);
      if (MyDay == MyAutumnEquinox) {    // 1948`2150ˆÈŠO‚Í[99]
          Result = "H•ª‚Ì“ú";           // ‚ª•Ô‚é‚Ì‚Å¤•K‚¸‚‚É‚È‚é
      } else {
          if (MyYear >= 2003) {
              NumberOfWeek = Math.floor((MyDay - 1) / 7) + 1;
              if ((NumberOfWeek == 3) && (MyDate.getDay() == MONDAY)) {
                  Result = "Œh˜V‚Ì“ú";
              } else {
                  if (MyDate.getDay() == TUESDAY) {
                      if (MyDay == (MyAutumnEquinox - 1)) {
                          Result = "‘–¯‚Ì‹x“ú";
                      } else;
                  } else;
              }
          } else {
              if (MyYear >= 1966) {
                  if (MyDay == 15) {
                      Result = "Œh˜V‚Ì“ú";
                  } else;
              } else;
          }
      }
      break;
// ‚P‚OŒ //
  case 10:
      if (MyYear >= 2000) {
          NumberOfWeek = Math.floor(( MyDay - 1) / 7) + 1;
          if ((NumberOfWeek == 2) && (MyDate.getDay() == MONDAY)) {
              Result = "‘Ìˆç‚Ì“ú";
          } else;
      } else {
          if (MyYear >= 1966) {
              if (MyDay == 10) {
                  Result = "‘Ìˆç‚Ì“ú";
              } else;
          } else;
      }
      break;
// ‚P‚PŒ //
  case 11:
      if (MyDay == 3) {
          Result = "•¶‰»‚Ì“ú";
      } else {
          if (MyDay == 23) {
              Result = "‹Î˜JŠ´Ó‚Ì“ú";
          } else {
              if (MyDate.getTime() == cstSokuireiseiden.getTime()) {
                  Result = "‘¦ˆÊ—ç³“a‚Ì‹V";
              } else;
          }
      }
      break;
// ‚P‚QŒ //
  case 12:
      if (MyDay == 23) {
          if (MyYear >= 1989) {
              Result = "“Vc’a¶“ú";
          } else;
      } else;
      break;
  }

  return Result;
}

//===================================================================
// t•ª/H•ª“ú‚Ì—ªZ®‚Í
// wŠCã•ÛˆÀ’¡…˜H•” —ïŒvZŒ¤‹†‰ï•Ò V‚±‚æ‚İ•Ö—˜’ x
// ‚ÅĞ‰î‚³‚ê‚Ä‚¢‚é®‚Å‚·B
function prvDayOfSpringEquinox(MyYear)
{
  var SpringEquinox_ret;

  if (MyYear <= 1947) {
      SpringEquinox_ret = 99;    //j“ú–@{s‘O
  } else {
      if (MyYear <= 1979) {
          // Math.floor ŠÖ”‚Í[VBA‚ÌIntŠÖ”]‚É‘Š“–
          SpringEquinox_ret = Math.floor(20.8357 + 
            (0.242194 * (MyYear - 1980)) - Math.floor((MyYear - 1980) / 4));
      } else {
          if (MyYear <= 2099) {
              SpringEquinox_ret = Math.floor(20.8431 + 
                (0.242194 * (MyYear - 1980)) - Math.floor((MyYear - 1980) / 4));
          } else {
              if (MyYear <= 2150) {
                  SpringEquinox_ret = Math.floor(21.851 + 
                    (0.242194 * (MyYear - 1980)) - Math.floor((MyYear - 1980) / 4));
              } else {
                  SpringEquinox_ret = 99;    //2151”NˆÈ~‚Í—ªZ®‚ª–³‚¢‚Ì‚Å•s–¾
              }
          }
      }
  }
  return SpringEquinox_ret;
}

//=====================================================================
function prvDayOfAutumnEquinox(MyYear)
{
  var AutumnEquinox_ret;

  if (MyYear <= 1947) {
      AutumnEquinox_ret = 99; //j“ú–@{s‘O
  } else {
      if (MyYear <= 1979) {
          // Math.floor ŠÖ”‚Í[VBA‚ÌIntŠÖ”]‚É‘Š“–
          AutumnEquinox_ret = Math.floor(23.2588 + 
            (0.242194 * (MyYear - 1980)) - Math.floor((MyYear - 1980) / 4));
      } else {
          if (MyYear <= 2099) {
              AutumnEquinox_ret = Math.floor(23.2488 + 
                (0.242194 * (MyYear - 1980)) - Math.floor((MyYear - 1980) / 4));
          } else {
              if (MyYear <= 2150) {
                  AutumnEquinox_ret = Math.floor(24.2488 + 
                    (0.242194 * (MyYear - 1980)) - Math.floor((MyYear - 1980) / 4));
              } else {
                  AutumnEquinox_ret = 99;    //2151”NˆÈ~‚Í—ªZ®‚ª–³‚¢‚Ì‚Å•s–¾
              }
          }
      }
  }
  return AutumnEquinox_ret;
}

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/ CopyRight(C) K.Tsunoda(AddinBox) 2001 All Rights Reserved.
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

//-->
