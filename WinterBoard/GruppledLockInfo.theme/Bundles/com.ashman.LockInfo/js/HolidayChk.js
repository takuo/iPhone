<!--
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/
//_/ CopyRight(C) K.Tsunoda(AddinBox) 2001 All Rights Reserved.
//_/ ( http://www.h3.dion.ne.jp/~sakatsu/index.htm )
//_/
//_/   この祝日判定コードは『Excel:kt関数アドイン』で使用している
//_/   ＶＢＡマクロを[JavaScript]に移植したものです。
//_/   この関数では、２００７年施行の改正祝日法(昭和の日)までを
//_/ 　サポートしています(９月の国民の休日を含む)。
//_/
//_/ (*1)このコードを引用するに当たっては、必ずこのコメントも
//_/ 一緒に引用する事とします。
//_/ (*2)他サイト上で本マクロを直接引用する事は、ご遠慮願います。
//_/ 【 http://www.h3.dion.ne.jp/~sakatsu/holiday_logic.htm 】
//_/ へのリンクによる紹介で対応して下さい。
//_/ (*3)[ktHolidayName]という関数名そのものは、各自の環境に
//_/ おける命名規則に沿って変更しても構いません。
//_/ 
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
// 2008/10/29 変数のvar指定が無く、広域変数扱いになっていたのを修正しました。

var MONDAY = 1;
var TUESDAY = 2;
var WEDNESDAY = 3;

// JavaScriptで扱える日付は1970/1/1〜のみ
//var cstImplementTheLawOfHoliday = new Date("1948/7/20");  // 祝日法施行
//var cstAkihitoKekkon = new Date("1959/4/10");              // 明仁親王の結婚の儀
var cstShowaTaiso = new Date("1989/2/24");                // 昭和天皇大喪の礼
var cstNorihitoKekkon = new Date("1993/6/9");            // 徳仁親王の結婚の儀
var cstSokuireiseiden = new Date("1990/11/12");          // 即位礼正殿の儀
var cstImplementHoliday = new Date("1973/4/12");        // 振替休日施行

// [prmDate]には "yyyy/m/d"形式の日付文字列を渡す
function ktHolidayName(prmDate)
{
  var MyDate = new Date(prmDate);
  var HolidayName = prvHolidayChk(MyDate);
  var YesterDay;
  var HolidayName_ret;

  if (HolidayName == "") {
      if (MyDate.getDay() == MONDAY) {
          // 月曜以外は振替休日判定不要
          // 5/6(火,水)の判定はprvHolidayChkで処理済
          // 5/6(月)はここで判定する
          if (MyDate.getTime() >= cstImplementHoliday.getTime()) {
              YesterDay = new Date(MyDate.getFullYear(),
                                     MyDate.getMonth(),(MyDate.getDate()-1));
              HolidayName = prvHolidayChk(YesterDay);
              if (HolidayName != "") {
                  HolidayName_ret = "振替休日";
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
  var MyMonth = MyDate.getMonth() + 1;    // MyMonth:1〜12
  var MyDay = MyDate.getDate();
  var Result = "";
  var NumberOfWeek;
  var MyAutumnEquinox;

// JavaScriptで扱える日付は1970/1/1〜のみで祝日法施行後なので下記は不要
// if (MyDate.getTime() < cstImplementTheLawOfHoliday.getTime()) {
// 　　return ""; // 祝日法施行(1948/7/20)以前
// } else;

  switch (MyMonth) {
// １月 //
  case 1:
      if (MyDay == 1) {
          Result = "元日";
      } else {
          if (MyYear >= 2000) {
              NumberOfWeek = Math.floor((MyDay - 1) / 7) + 1;
              if ((NumberOfWeek == 2) && (MyDate.getDay() == MONDAY)) {
                  Result = "成人の日";
              } else;
          } else {
              if (MyDay == 15) {
                  Result = "成人の日";
              } else;
          }
      }
      break;
// ２月 //
  case 2:
      if (MyDay == 11) {
          if (MyYear >= 1967) {
              Result = "建国記念の日";
          } else;
      } else {
          if (MyDate.getTime() == cstShowaTaiso.getTime()) {
              Result = "昭和天皇の大喪の礼";
          } else;
      }
      break;
// ３月 //
  case 3:
      if (MyDay == prvDayOfSpringEquinox(MyYear)) {  // 1948〜2150以外は[99]
          Result = "春分の日";                       // が返るので､必ず≠になる
      } else;
      break;
// ４月 //
  case 4:
      if (MyDay == 29) {
          if (MyYear >= 2007) {
              Result = "昭和の日";
          } else {
              if (MyYear >= 1989) {
                  Result = "みどりの日";
              } else {
                Result = "天皇誕生日";
              }
          }
      } else {
          // JavaScriptで扱える日付は1970/1/1〜のみなので下記は不要
          // if (MyDate.getTime() == cstAkihitoKekkon.getTime()) {
          // 　　Result = "皇太子明仁親王の結婚の儀";　　// (=1959/4/10)
          // } else;
      }
      break;
// ５月 //
  case 5:
      switch ( MyDay ) {
        case 3:  // ５月３日
          Result = "憲法記念日";
          break;
        case 4:  // ５月４日
          if (MyYear >= 2007) {
              Result = "みどりの日";
          } else {
              if (MyYear >= 1986) {
                  if (MyDate.getDay() > MONDAY) {
                  // 5/4が日曜日は『只の日曜』､月曜日は『憲法記念日の振替休日』(〜2006年)
                      Result = "国民の休日";
                  } else;
              } else;
          }
          break;
        case 5:  // ５月５日
          Result = "こどもの日";
          break;
        case 6:  // ５月６日
          if (MyYear >= 2007) {
              if ((MyDate.getDay() == TUESDAY) || (MyDate.getDay() == WEDNESDAY)) {
                  Result = "振替休日";    // [5/3,5/4が日曜]ケースのみ、ここで判定
              } else;
          } else;
          break;
      }
      break;
// ６月 //
  case 6:
      if (MyDate.getTime() == cstNorihitoKekkon.getTime()) {
          Result = "皇太子徳仁親王の結婚の儀";
      } else;
      break;
// ７月 //
  case 7:
      if (MyYear >= 2003) {
          NumberOfWeek = Math.floor((MyDay - 1) / 7) + 1;
          if ((NumberOfWeek == 3) && (MyDate.getDay() == MONDAY)) {
              Result = "海の日";
          } else;
      } else {
          if (MyYear >= 1996) {
              if (MyDay == 20) {
                  Result = "海の日";
              } else;
          } else;
      }
      break;
// ９月 //
  case 9:
      //第３月曜日(15〜21)と秋分日(22〜24)が重なる事はない
      MyAutumnEquinox = prvDayOfAutumnEquinox(MyYear);
      if (MyDay == MyAutumnEquinox) {    // 1948〜2150以外は[99]
          Result = "秋分の日";           // が返るので､必ず≠になる
      } else {
          if (MyYear >= 2003) {
              NumberOfWeek = Math.floor((MyDay - 1) / 7) + 1;
              if ((NumberOfWeek == 3) && (MyDate.getDay() == MONDAY)) {
                  Result = "敬老の日";
              } else {
                  if (MyDate.getDay() == TUESDAY) {
                      if (MyDay == (MyAutumnEquinox - 1)) {
                          Result = "国民の休日";
                      } else;
                  } else;
              }
          } else {
              if (MyYear >= 1966) {
                  if (MyDay == 15) {
                      Result = "敬老の日";
                  } else;
              } else;
          }
      }
      break;
// １０月 //
  case 10:
      if (MyYear >= 2000) {
          NumberOfWeek = Math.floor(( MyDay - 1) / 7) + 1;
          if ((NumberOfWeek == 2) && (MyDate.getDay() == MONDAY)) {
              Result = "体育の日";
          } else;
      } else {
          if (MyYear >= 1966) {
              if (MyDay == 10) {
                  Result = "体育の日";
              } else;
          } else;
      }
      break;
// １１月 //
  case 11:
      if (MyDay == 3) {
          Result = "文化の日";
      } else {
          if (MyDay == 23) {
              Result = "勤労感謝の日";
          } else {
              if (MyDate.getTime() == cstSokuireiseiden.getTime()) {
                  Result = "即位礼正殿の儀";
              } else;
          }
      }
      break;
// １２月 //
  case 12:
      if (MyDay == 23) {
          if (MyYear >= 1989) {
              Result = "天皇誕生日";
          } else;
      } else;
      break;
  }

  return Result;
}

//===================================================================
// 春分/秋分日の略算式は
// 『海上保安庁水路部 暦計算研究会編 新こよみ便利帳』
// で紹介されている式です。
function prvDayOfSpringEquinox(MyYear)
{
  var SpringEquinox_ret;

  if (MyYear <= 1947) {
      SpringEquinox_ret = 99;    //祝日法施行前
  } else {
      if (MyYear <= 1979) {
          // Math.floor 関数は[VBAのInt関数]に相当
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
                  SpringEquinox_ret = 99;    //2151年以降は略算式が無いので不明
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
      AutumnEquinox_ret = 99; //祝日法施行前
  } else {
      if (MyYear <= 1979) {
          // Math.floor 関数は[VBAのInt関数]に相当
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
                  AutumnEquinox_ret = 99;    //2151年以降は略算式が無いので不明
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
