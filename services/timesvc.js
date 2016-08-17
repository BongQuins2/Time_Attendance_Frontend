var myApp = angular.module('TimeSvc', []);
myApp.service('TimeService',function TimeService(CookieService,HOST,$q,$http){
  var ts = this;
  ts.saveTime = saveTime;
  ts.getsystemDate = getsystemDate;

  function getsystemDate(){
    ts.date = new Date();
    ts.dateCYYYY = ts.date.getFullYear();
    ts.dateCMM = ('0' + (ts.date.getMonth() + 1)).slice(-2);
    ts.dateCDD = ('0' + ts.date.getDate()).slice(-2);
    ts.dateCMMDDYYYY = ts.dateCMM + '-' + ts.dateCDD + '-' + ts.dateCYYYY;
    ts.timeHH = ts.date.getHours();
    if(ts.timeHH<10){
      ts.timeHH = '0'+ ts.timeHH;
    }
    ts.timeMM = ts.date.getMinutes();
    if(ts.timeMM<10){
      ts.timeMM = '0'+ ts.timeMM;
    }

    // ts.timeSS = ts.date.getSeconds();
    if(ts.timeMM<12){
      ts.timeHHMM = ts.timeHH + ":" + ts.timeMM + " AM";
    }else{
      ts.timeHHMM = ts.timeHH + ":" + ts.timeMM + " PM";
    }

    ts.datetime_obj= {
      'Date':ts.dateCMMDDYYYY,
      'Time':ts.timeHHMM
    };
    console.log('ts.datetime_obj=');
    console.log(ts.datetime_obj);
    return ts.datetime_obj;

  }

  function saveTime(empId,inDate){
    var defer = $q.defer();
      ts.empId = empId;
      ts.inDate = inDate;

      ts.dataObj = {
        'empId': ts.empId,
        'tt_date':ts.inDate
      }
      ts.endpoint = '/save/timetracker';
      ts.URL = HOST + ts.endpoint;
    $http({
            method:'POST',
            url : ts.URL,
            params : ts.dataObj
          }).success(function(data, status, headers, config){
            defer.resolve(data);
          }).error(function (data, status, headers, config){
            defer.reject(status);
    });
    return defer.promise;
  }

  ts.getCustomizedButtonName = getCustomizedButtonName;
  // function getCustomizedButtonName(empId,inDate){
  function getCustomizedButtonName(empId, inDate){

    var defer = $q.defer();
      ts.empId = empId;
      ts.inDate = inDate;
      console.log('empId:'+empId+ ';inDate:'+inDate);

        console.log("obj value: ");
        obj = {
          empId:ts.empId,
          tt_date:ts.inDate
        }
        console.log(obj);

        ts.empId = empId;
        ts.inDate = inDate;

        ts.endpoint = '/timetracker/findtimetracker';
        ts.URL = HOST + ts.endpoint;
        // var URL = './json/empiddate.json';

        var defer = $q.defer();
        $http({
          method:'POST',
          url : ts.URL,
          params : obj
          }).success(function (data, status, headers, config) {
          console.log(data);
          defer.resolve(data);
          }).error(function (data, status, headers, config) {
          defer.reject(status);
          });
          return defer.promise;
    }
});
