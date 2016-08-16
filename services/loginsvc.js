var myApp = angular.module('LoginSvc', []);
myApp.service('LoginService', function LoginService($q, $http, HOST){
  console.log('LoginService');

  var ls = this;
  ls.emp_password = '';

  ls.validateLogin = validateLogin;
  function validateLogin(emp_username, emp_password){
      var defer = $q.defer();
      console.log('LoginService.validateLogin');
      console.log('emp_username:'+emp_username);
      console.log('emp_password:'+emp_password);
      ls.emp_username = emp_username;
      ls.emp_password = emp_password;

      // console.log('ls.emp_username:'+ ls.emp_username);
      // console.log('ls.emp_password:'+ ls.emp_password);

      dataObj = {
        "user_name":ls.emp_username,
        "user_password":ls.user_password
      };

      var URL = HOST + 'checkusernamepassword';
      var login = '?user_name=' + ls.emp_username + '&user_password=' + ls.emp_password;
      $http.post(URL + login, dataObj)
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
