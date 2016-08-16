var myApp = angular.module('TimeSvc', []);
myApp.service('TimeService',function TimeService(CookieService,HOST,$q,$http){
  var ts = this;
  ts.saveTime = saveTime;
  ts.getsystemDates = getsystemDates;

  function getsystemDates(){
    ts.dates = [];
    ts.date = new Date();
    ts.dateCYYYY = ts.date.getFullYear();
    ts.dateCMM = ('0' + (ts.date.getMonth() + 1)).slice(-2);
    ts.dateCDD = ('0' + ts.date.getDate()).slice(-2);
    ts.dateCMMDDYYYY = ts.dateCMM + '-' + ts.dateCDD + '-' + ts.dateCYYYY;
    ts.dates.push(ts.dateCMMDDYYYY);
      //getting previous date
      if(ts.dateCDD==1){
        if (ts.dateCMM != 1){
          ts.dateCMM = ts.dateCMM - 1;
          switch(ts.dateCMM){
              case 1:
              case 3:
              case 5:
              case 7:
              case 8:
              case 10:
              case 12:
                  ts.dateCDD = 31;
                  break;
              case 4:
              case 6:
              case 9:
              case 11:
                  ts.dateCDD = 30;
                  break;
              case 2:
                  //checking for leap year
                  if (ts.dateCYYYY/400){
                    ts.dateCDD = 29;
                  }
                  else if(ts.dateCYYYY/100){
                    ts.dateCDD = 28;
                  }
                  else if(ts.dateCYYYY/4){
                    ts.dateCDD = 29;
                  }
                  else{
                    result= false
                  }
                  break;
              default:
                  console.log('Error in getting Month!');
              }
        }else{
          ts.dateCYYYY = ts.dateCYYYY-1;
          ts.dateCMM = 12;
          ts.dateCDD= 31;
        }
    }else{
      ts.dateCDD=ts.dateCDD-1;
    }
    ts.dateCMMDDYYYY = ts.dateCMM + '-' + ts.dateCDD + '-' + ts.dateCYYYY;
    ts.dates.push(ts.dateCMMDDYYYY);
    return ts.dates;
  }

  function saveTime(empId,inDate){
    var defer = $q.defer();
      ts.empId = empId;
      ts.inDate = inDate;

      ts.dataObj = {
        'empId': ts.empId,
        'tt_date':ts.inDate
      }
      ts.endpoint = 'timetracker/save';
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
  function getCustomizedButtonName(empId,inDate){
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

        var endpoint = 'timetracker/findtimetracker';
        var URL = HOST + endpoint;
        // var URL = './json/empiddate.json';

        var defer = $q.defer();
        $http({
          method:'POST',
          url : URL,
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
