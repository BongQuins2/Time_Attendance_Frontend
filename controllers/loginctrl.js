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

        LoginService.validateLogin(lc.emp_username).then(function(loginstatus){
           lc.loginstatus = loginstatus;
           switch(lc.loginstatus) {
               case 0:
              //  case 3:
                  //  alert('Invalid Username/Password!');
                   alert('Invalid Username!');
                   lc.emp_username = '';//clear username text box
                  //  lc.emp_password = '';//clear password text box

                   break;
               case 1:
                  //  alert('Login Successful!');
                   console.log('Login Successful!');
                   lc.writestatus = CookieService.writeCookie(lc.emp_username );
                   lc.validatedsignin = true;
                  //  $location.path("/timein_out");
                   break;
               default:
                   vm.validatedsignin = false;
                   alert('Unable to authenticate!');
           }
         }, function(error){
            console.log("LoginController.validateLogin Error" + JSON.stringify({error: error}));
        });
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
      lc.cookieName_obj = CookieService.readCookie();

      if(lc.cookieName_obj!=null){
        lc.validatedsignedin = true;
      }else{
        console.log('LoginController onLoad cookie is null.');
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
