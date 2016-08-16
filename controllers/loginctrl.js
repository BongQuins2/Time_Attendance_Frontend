var myApp = angular.module('LoginCtrl', ['LoginSvc','CookieSvc']);
myApp.controller('LoginController', function LoginController(LoginService,CookieService, $scope, $location,$cookieStore, $window){
  var vm=$scope;

    renderButton();
    function renderButton(){
      // console.log('render');
      var gapi= $window.gapi;
      gapi.signin2.render('my-signin2',
          {
            'scope': 'profile email',
            'width': 240,
            'height': 50,
            'longtitle': true,
            'theme': 'dark',
            'onsuccess': onSuccess,
            'onfailure': onFailure
          }
        );
    }

    vm.onSuccess = onSuccess;
    function onSuccess(googleUser){
      console.log('onSuccess');
        vm.googleUser = googleUser;
        var profile = vm.googleUser.getBasicProfile();
        // console.log('Name: ' + profile.getName());
        // console.log('Email: ' + profile.getEmail());
        lc.emp_username = profile.getEmail();

        vm.readcookie_obj = CookieService.readCookie();

        if(vm.readcookie_obj!=null){
          vm.cookieName = vm.readcookie_obj['Username'];
          vm.cookiePassword = vm.readcookie_obj['Password'];

          if (vm.cookieName==null||vm.cookiePassword==null){
            CookieService.removeCookie();
            vm.writestatus = CookieService.writeCookie(1,vm.cookieName);
          }

          if (vm.writestatus == 1){
            lc.signin = true;
            console.log('Write cookie username successful');
          }else{
            console.log('Write cookie username error!');
          }
        }else{
          vm.writestatus = CookieService.writeCookie(1,lc.emp_username);
          lc.signin = true;
        }
    }

    function onFailure(error) {
        console.log('LoginController onFailure:'+error);
    }

    var lc = this;

    onLoad();
    function onLoad(){
      console.log('LoginController onLoad');
      lc.signin = false;
      lc.validatedsignedin = false;
      var cookieName_obj = CookieService.readCookie();

      if(cookieName_obj!=null){
        lc.cookieName = cookieName_obj['Username'];

        if(lc.cookieName != null){
          lc.signin = true;
          lc.cookiePassword = cookieName_obj['Password'];

          if(lc.cookiePassword != null){
            lc.validatedsignedin = true;
          }
        }
      }else{
        console.log('LoginController onLoad cookie is null.');
      }
    }

    vm.submitForm = submitForm;
    function submitForm(isValid,emp_password){
      lc.cookieName_obj = CookieService.readCookie();
      if(lc.cookieName_obj!=null){
        lc.signin = true;
      }else{
        lc.signin = false;
      }
      console.log('lc.signin:'+ lc.signin);
      if(isValid && lc.signin){
        lc.emp_password = emp_password;
        console.log('lc.emp_password:'+lc.emp_password);
        lc.Username = lc.cookieName_obj['Username'];
        LoginService.validateLogin(lc.Username, lc.emp_password).then(function(loginstatus){
           lc.loginstatus = loginstatus;
           switch(lc.loginstatus) {
               case 0:
               case 3:
                   alert('Invalid Username/Password!');
                   lc.emp_username = '';//clear username text box
                   lc.emp_password = '';//clear password text box

                   break;
               case 2:
                   alert('Login Successful!');
                   lc.writestatus = CookieService.writeCookie(2,lc.emp_password);
                   if (lc.writestatus == 1){
                     lc.validatedsignin = true;
                     console.log('Write cookie pw successful');
                     $location.path("/timein_out");
                   }else{
                     console.log('Write cookie pw error!');
                   }
                   break;
               default:
                   vm.validatedsignin = false;
                   alert('Unable to authenticate!');
           }
          //  vm.emp_username = '';//clear username text box
           lc.emp_password = '';//clear password text box
         }, function(error){
            console.log("LoginController.validateLogin Error" + JSON.stringify({error: error}));
        });
      }else{
        lc.emp_password = '';//clear password text box
        alert('Please sign in with google first. Thanks!');
      }
    }

    vm.signOut = signOut;
    function signOut(){
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function() {
          console.log('User signed out.');
      });

      var cookieStatus = CookieService.removeCookie();
      if (cookieStatus == 3){
        lc.emp_username = '';

        console.log('Cookies deleted.');
      }else{
        console.log('Error in deleting cookie!');
        console.log('deletecookieStatus:'+ cookieStatus);
      }
      lc.validatedsignin = false;
      $location.path("/");
    }
});
