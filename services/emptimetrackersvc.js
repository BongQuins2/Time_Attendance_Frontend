var myApp = angular.module('EmpTimeTrackerSvc', []);
myApp.service('EmpTimeTrackerService',function EmpTimeTrackerService($q, $http, HOST){
  var ts = this;

  ts.timetrackers = [];
  ts.timetracker = {};
  ts.timetracker_obj = {};
  ts.getUserTimetracker = getUserTimetracker;

  function getUserTimetracker(empId){
    console.log('EmpService.getUserTimetracker='+ empId);

    var defer = $q.defer();
      var endpoint = 'user/timetracker';
      var URL = HOST + endpoint + '?emp_id=';
      $http.get(URL + empId).then(function(response) {
      // $http.get('./json/timetrackerlist.json').then(function(response) {

      ts.timetrackers = response.data;
      ts.timetracker_array_obj = [];
      for (i = 0; i < ts.timetrackers.length; i++){

          ts.timetracker = ts.timetrackers[i];

          ts.tt_date = ts.timetracker[0];
          ts.time_in = ts.timetracker[1];
          ts.time_out = ts.timetracker[2];

          ts.timetracker_obj = {
            "tt_date": ts.tt_date,
            "time_in": ts.time_in,
            "time_out": ts.time_out,
          }

          ts.timetracker_array_obj.push(ts.timetracker_obj);
          console.log('timetracker_array_obj');
          console.log(ts.timetracker_array_obj);
      }
      defer.resolve(ts.timetracker_array_obj);
      // defer.resolve(response.data);
    }, function(error){
      defer.reject('EmpService.getUserTimetracker error!' + error);
    });
    return defer.promise;
  }
});
