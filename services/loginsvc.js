var myApp = angular.module('LoginSvc', []);
myApp.service('LoginService', function LoginService($q, $http, HOST){
  console.log('LoginService');

  var ls = this;
  ls.emp_password = '';
  ls.validateLogin = validateLogin;
  function validateLogin(emp_username){
      var defer = $q.defer();
      console.log('LoginService.validateLogin');
      console.log('emp_username:'+emp_username);
      ls.emp_username = emp_username;

      dataObj = {
        "user_name":ls.emp_username
      };

      ls.URL = HOST + '/login/countusername';
      ls.login = '?user_name=' + ls.emp_username;
      // $http.post(ls.URL + ls.login, dataObj)
      $http.get(ls.URL + ls.login, dataObj)
        .success(function(data, status, headers, config){
            defer.resolve(data);
            console.log('LoginService.validateLogin post success:' + data);
        })
        .error(function(data, status, headers, config) {
            defer.reject('error!' + status);
            console.log( "LoginService validateLogin post ailure message: " + JSON.stringify({data: data}));
        });
      return defer.promise;
  }
});
