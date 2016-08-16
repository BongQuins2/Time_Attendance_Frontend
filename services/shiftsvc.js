var myApp = angular.module('ShiftSvc', []);
myApp.service('ShiftService', function ShiftService($q, $http, adminshift_obj,HOST){
  var tas = this;
  tas.getShift = getShift;
  tas.savedelShift = savedelShift;
  //tas.shifts = [];

  function getShift(){
    var defer = $q.defer();
      $http.get(adminshift_obj).then(function(response){
      defer.resolve(response.data);
    }, function(error){
      defer.reject('getShift error!' + error);
    });
    return defer.promise;
  }

  function savedelShift(obj, endpoint){
    console.log("obj value: "+obj);
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
