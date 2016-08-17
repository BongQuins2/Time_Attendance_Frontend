var myApp = angular.module('LoginMainSvc', []);
myApp.service('LoginMainService', function LoginMainService($q, $http, loginmain_obj, HOST){
var lms = this;

lms.getvAllUserLogin = getvAllUserLogin;
// lms.savedelLogin = savedelLogin;
lms.saveLogin = saveLogin;
lms.deleteLogin = deleteLogin;
lms.updateLogin = updateLogin;
// lms.countUsername = countUsername;

  function getvAllUserLogin(){
    var defer = $q.defer();
      $http.get(loginmain_obj).then(function(response) {
        defer.resolve(response.data);
    }, function(error){
      defer.reject('getLoginMain error!' + error);
    });
    return defer.promise;
  }

  // function countUsername(obj, endpoint){
  //   console.log("countUsername obj value::");
  //   console.log(obj);
  //   console.log('endpoint:'+endpoint);
  //   var deferred = $q.defer();
  //   $http({
  //     method: 'GET',
  //     url : HOST + endpoint,
  //     params : obj
  //
  //   }).success(function (data, status, headers, config) {
  //       console.log('data:'+ data);
  //       deferred.resolve(data);
  //     }).error(function (data, status, headers, config) {
  //       deferred.reject(status);
  //     });
  //   return deferred.promise;
  // }

  // function savedelLogin(obj, endpoint){
  //   console.log("obj value: obj:");
  //   console.log(obj);
  //   //tas.shifts = getShift();
  //   var deferred = $q.defer();
  //   $http({
  //     method:'POST',
  //     url : HOST + endpoint,
  //     params : obj
  //   }).success(function (data, status, headers, config) {
  //       //console.log(data);
  //       deferred.resolve(data);
  //     }).error(function (data, status, headers, config) {
  //       deferred.reject(status);
  //     });
  //   return deferred.promise;
  // }

  function saveLogin(obj){
    console.log("obj value: obj:");
    console.log(obj);
    lms.endpoint = '/save/login'
    var deferred = $q.defer();
    $http({
      method:'POST',
      url : HOST + lms.endpoint,
      params : obj
    }).success(function (data, status, headers, config) {
        //console.log(data);
        deferred.resolve(data);
      }).error(function (data, status, headers, config) {
        deferred.reject(status);
      });
    return deferred.promise;
  }

  function deleteLogin(obj){
    console.log("obj value: obj:");
    console.log(obj);
    endpoint = '/remove/login';
    var deferred = $q.defer();
    $http({
      method:'POST',
      url : HOST + endpoint,
      params : obj
    }).success(function (data, status, headers, config) {
        //console.log(data);
        deferred.resolve(data);
      }).error(function (data, status, headers, config) {
        deferred.reject(status);
      });
    return deferred.promise;
  }

  function updateLogin(obj){
    console.log("obj value: obj:");
    console.log(obj);
    lms.endpoint = '/update/login'
    var deferred = $q.defer();
    $http({
      method:'POST',
      url : HOST + lms.endpoint,
      params : obj
    }).success(function (data, status, headers, config) {
        //console.log(data);
        deferred.resolve(data);
      }).error(function (data, status, headers, config) {
        deferred.reject(status);
      });
    return deferred.promise;
  }

});
