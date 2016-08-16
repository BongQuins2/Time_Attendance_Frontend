var myApp = angular.module('EmpShiftSvc', []);
myApp.service('EmpShiftService', function EmpShiftService($q, $http, empshift_obj,HOST){
  var ess = this;
  ess.getEmpShift = getEmpShift;
  ess.savedelEmpShift = savedelEmpShift;
  // ess.deleteEmpShift = deleteEmpShift;

  function getEmpShift(){
    var defer = $q.defer();
      $http.get(empshift_obj).then(function(response){
      defer.resolve(response.data);
    }, function(error){
      defer.reject('getEmpShift error!' + error);
    });
    return defer.promise;
  }

  function savedelEmpShift(obj, endpoint){
    console.log("obj value: "+ obj);
    var deferred = $q.defer();
    console.log('obj:');
    console.log(obj);
    console.log('endpoint:'+ endpoint);

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
