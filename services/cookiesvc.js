var myApp = angular.module('CookieSvc', []);
myApp.service('CookieService', function CookieService($cookieStore){
  console.log('CookieService');
  var sc = this;
  sc.name = '';

  sc.writeCookie = writeCookie;
  function writeCookie(emp_username){
     sc.emp_username = emp_username;
     $cookieStore.put("Name", sc.emp_username );
    sc.wstatus = 1;
    return sc.wstatus;
  }

  sc.readCookie = readCookie;
  function readCookie(){
    console.log('CookieService.readCookie');
    sc.username = $cookieStore.get('Name');
    // sc.password = $cookieStore.get('Password');

    if(sc.username!=null){
      console.log('cookiename:'+ sc.username);
      var cookie_obj={
        "Username":sc.username
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
