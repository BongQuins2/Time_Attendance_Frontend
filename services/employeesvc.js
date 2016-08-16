var myApp = angular.module('EmployeeSvc', []);
myApp.service('EmpService', function EmpService($q, $http, HOST){
  var ts = this;
  ts.getEmployees = getEmployees;
  ts.savedelEmployee = savedelEmployee;
  ts.getEmployeeId = getEmployeeId;

  function getEmployeeId(obj){
    // console.log("obj value: ");
    // console.log(obj);

    var endpoint = 'employee/getempid';
    var URL = HOST + endpoint;

    var deferred = $q.defer();
    $http({
        method:'GET',
        url : URL,
        params : obj
        }).success(function (data, status, headers, config) {
        //console.log(data);
        deferred.resolve(data);
        }).error(function (data, status, headers, config) {
        deferred.reject(status);
        });
      return deferred.promise;
  }

  function getEmployees(){
    var defer = $q.defer();
      var endpoint = 'employee/viewall';
      $http.get(HOST + endpoint).then(function(response) {
      defer.resolve(response.data);
    }, function(error){
      defer.reject('EmpService.getEmployees error!' + error);
    });
    return defer.promise;
  }

  function savedelEmployee(obj, endpoint){
    console.log("obj value: ");
    console.log(obj);
    //tas.shifts = getShift();
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
});
