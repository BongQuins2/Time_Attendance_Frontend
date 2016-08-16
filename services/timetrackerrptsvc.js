var myApp = angular.module('TimeTrackerRptSvc',[]);
myApp.service('TTReportService', function TTReportService($q, $http, ttreport_obj, HOST){
  var ts = this;
  ts.getvOtherTTReport = getvOtherTTReport;
  ts.getvAllEmpTTReport = getvAllEmpTTReport;

  function getvAllEmpTTReport(){
    var defer = $q.defer();
      $http.get(ttreport_obj).then(function(response) {
        defer.resolve(response.data);
    }, function(error){
      defer.reject('getTimetracker error!' + error);
    });
    return defer.promise;
  }

  function getvOtherTTReport(obj) {
    console.log("getvOtherTTReport obj value: ");
    console.log(obj);
    ts.endpoint = 'timetracker/viewByEmployee';
    var deferred = $q.defer();
    $http({
      method:'GET',
      url : HOST + ts.endpoint,
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
