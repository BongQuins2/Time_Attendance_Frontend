var myApp = angular.module('LoginMainCtrl', ['LoginMainSvc','CookieSvc']);
myApp.controller('loginMainController', function loginMainController(LoginMainService, EmpService, CookieService, $location){
  var lm = this;
  lm.cookie_Obj = CookieService.readCookie();
  lm.cookiePassword = null;

  if(lm.cookie_Obj != null){
    lm.cookiePassword = lm.cookie_Obj['Password'];
  }

  if (lm.cookiePassword != null){
    lm.employeesData = employeesData;
    lm.loginMainData = loginMainData;
    lm.saveLoginMain = saveLoginMain;
    lm.editLoginMain = editLoginMain;
    lm.deleteLoginMain = deleteLoginMain;
    lm.insertLoginMain = insertLoginMain;

    employeesData();
    loginMainData();

    function employeesData(){
      EmpService.getEmployees().then(function(employee){
        lm.employee = employee;
        }, function(error){
          alert('Error ' + error);
        });
    }

    function loginMainData(){
      LoginMainService.getvAllUserLogin().then(function(viewlogininfo){
        lm.viewlogininfo = viewlogininfo;
        }, function(error){
          alert('Error ' + error);
        });
    }

    function insertLoginMain() {
        // lm.username=username;
        // checkCountUsername(lm.username);
        // lm.obj = {
        //   user_name : lm.username
        // };
        // lm.endpointcheck = 'login/countusername';
        // console.log('loginMainController insertLoginMain lm.username:'+lm.username);
        // LoginMainService.countUsername(lm.obj,lm.endpointcheck).then(function(cnt_user){
        //   lm.cnt_user = cnt_user;
        //   console.log('LoginMainService.countUsername cnt_user:'+ cnt_user);
        //   }, function(error){
        //     alert('Error ' + error);
        //   });
        //
        // console.log('insertLoginMain lm.username:'+lm.username);
        // console.log('insertLoginMain lm.cnt_user:'+lm.cnt_user);
        // if (lm.cnt_user == 0) {
          saveLoginMain();
        // }else{
        //   // alert("Username already exist!");
        //   loginMainData();
        //   employeesData();
        //
        //   lm.username = "";
        //   lm.password = "";
        // }
    }

    function editLoginMain(userId, password){
      console.log("initial: "+userId+" "+password)
      lm.obj = {
        userId   : userId,
        user_password : password
      };
      console.log("1st check: ")
      console.log(lm.obj)
      //saveLoginMain(userId);
      lm.endpointsave = 'login/update';
      LoginMainService.savedelLogin(lm.obj,lm.endpointsave).then(function(response){
        alert("User password has been reset/change!");
        loginMainData();
        employeesData();

        lm.username = "";
        lm.password = "";

      }, function(error){
          alert('LoginMainService.savedelLogin Error: ' + error);
      });

    }

    function saveLoginMain(){
      lm.obj = {
        username : lm.username,
        password : lm.password
      };

      lm.endpointsave = 'login/save';
      LoginMainService.savedelLogin(lm.obj,lm.endpointsave).then(function(response){
        alert("User Login Saved!");
        loginMainData();
        employeesData();

        lm.username = "";
        lm.password = "";

      }, function(error){
          alert('LoginMainService.savedelLogin Error: ' + error);
      });
      }

    function deleteLoginMain(userId){
      console.log("initial: "+userId)
      lm.obj = {
        userId    : userId
      };
      console.log("1st check: "+lm.obj)
      lm.endpointdelete = 'login/remove';
      LoginMainService.savedelLogin(lm.obj,lm.endpointdelete).then(function(response){
        alert("Login Deleted Successfully!");
        loginMainData();
        employeesData();

      }, function(error){
          alert('Error ' + error);
      });
    }
  }else{
    console.log('loginMainController Please login!');
    alert('Please login!');
    $location.path("/");
  }


});
