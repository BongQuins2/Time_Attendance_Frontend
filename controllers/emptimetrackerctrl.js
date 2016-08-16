var myApp = angular.module('EmpTimeTrackerCtrl', ['EmpTimeTrackerSvc','CookieSvc']);
myApp.controller('EmpTimetrackerController', function EmpTimetrackerController(CookieService, EmpService, EmpTimeTrackerService, $location,$scope){
  var etc = this;
  etc.cookie_Obj = CookieService.readCookie();
  etc.cookiePassword = null;

  if(etc.cookie_Obj != null){
    etc.cookiePassword = etc.cookie_Obj['Password'];
  }

  if (etc.cookiePassword != null){
    etc.timetrackers = [];
    // etc.empId = '';
    etc.tt_date = '';
    etc.time_in = '';
    etc.time_out = '';

      empTimetrackerData();

      function empTimetrackerData(){
        etc.cookiename = etc.cookie_Obj['Username'];
        console.log('EmpTimetrackerController.empTimetrackerData.getEmployeeId START:'+ etc.cookiename)
        etc.obj = {"emp_username" : etc.cookiename};

            EmpService.getEmployeeId(etc.obj).then(function(empId){
               etc.empId = empId;
               console.log('EmpTimetrackerController.getEmpIdbyUsername: ' + etc.empId);
               console.log('etc.empId:'+ etc.empId);

                 EmpTimeTrackerService.getUserTimetracker(etc.empId).then(function(timetrackers){
                     console.log('EmpTimetrackerController.getUserTimetracker');
                     etc.timetrackers = timetrackers;

                     console.log('timetrackers:');
                     console.log(timetrackers);

                     console.log('etc.tt_date:'+ etc.tt_date);
                     console.log('etc.time_in:'+ etc.time_in);
                     console.log('etc.time_out:'+etc.time_in);

                   }, function(error){
                     alert('EmpTimetrackerController.empTimetrackerData Error ' + error);
                   });
            }, function(error){
                alert('EmpTimetrackerController.getEmpIdbyUsername Error ' + error);
            });
        }
  }else{
      console.log('EmpTimetrackerController Please login!');
      alert('Please login!');
      $location.path("/");
  }
});
