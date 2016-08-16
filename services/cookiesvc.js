var myApp = angular.module('CookieSvc', []);
myApp.service('CookieService', function CookieService($cookieStore){
  console.log('CookieService');
  var sc = this;
  sc.name = '';

  sc.writeCookie = writeCookie;
  function writeCookie(cookieindex,tempString){
    sc.cookieindex = cookieindex;
    sc.tempString = tempString;
    console.log('writeCookie cookieindex:' + cookieindex);
    console.log('writeCookie tempString:' + tempString);
    // console.log('CookieService.putCookie');
    if (sc.cookieindex ==1){
      $cookieStore.put("Name", sc.tempString);
      // console.log('writeCookie sc.name:' + sc.tempString);
    }else if(sc.cookieindex ==2){
      $cookieStore.put("Password", sc.tempString);
      // console.log('writeCookie sc.password:' + sc.tempString);
    }
    sc.wstatus = 1;
    return sc.wstatus;
  }

  sc.readCookie = readCookie;
  function readCookie(){
    console.log('CookieService.readCookie');
    sc.username = $cookieStore.get('Name');
    sc.password = $cookieStore.get('Password');

    if(sc.username!=null){
      console.log('cookiename:'+ sc.username);
      console.log('cookiepassword:'+ sc.password);
      var cookie_obj={
        "Username":sc.username,
        "Password":sc.password
      };
    }else{
      var cookie_obj = null;
    }

    return cookie_obj;
  }

  sc.removeCookie=removeCookie;
  function removeCookie(){
    console.log('CookieService.removeCookie');
    $cookieStore.remove('Name');
    $cookieStore.remove('Password');
    var dstatus =3;
    return dstatus;
  }

  status_obj={
    'writeCookie':writeCookie,
    'readCookie':readCookie,
    'removeCookie':removeCookie,
  };
  return status_obj;
});
