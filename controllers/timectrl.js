var myApp = angular.module('TimeCtrl', ['TimeSvc','EmployeeSvc','CookieSvc']);
myApp.controller('TimeController',function TimeController(CookieService, EmpService, TimeService, $location, $scope){
  var tc = this;
  tc.cookie_Obj = CookieService.readCookie();

  if(tc.cookie_Obj != null){
      tc.cookieName = tc.cookie_Obj['Username'];
      console.log('tc.cookieName ='+tc.cookieName);
      tc.submit = submit;
      tc.datetime_obj = TimeService.getsystemDate();
      tc.date = tc.datetime_obj['Date'];
      tc.time = tc.datetime_obj['Time'];
      tc.emp_username_obj = {
        emp_username:tc.cookieName
      };
      tc.checkButtonName = checkButtonName;
      console.log('TimeController.emp_username_obj:');
      console.log(tc.emp_username_obj);

      tc.buttonName = 'Time In/Out';
      checkButtonName();
      // tc.checkButtonName = checkButtonName;
      function checkButtonName(){
        EmpService.getEmployeeId(tc.emp_username_obj).then(function(empId){
          tc.empId = empId;
          console.log('TimeController checkButtonName empId:'+ tc.empId + '; currentdate:'+ tc.date);
          // TimeService.getCustomizedButtonName(tc.empId,tc.selectedDate).then(function(timeStatus){
                TimeService.getCustomizedButtonName(tc.empId,tc.date).then(function(timeStatus){
                tc.timeStatus = timeStatus;
                console.log('timeStatus:');
                console.log(tc.timeStatus);
                if (tc.timeStatus==0){
                  tc.buttonName = "Time In";
                }else{
                  tc.buttonName = "Time Out";
                }
              },function(error){
                console.log('TimeController.checkButtonName Error ' + error);
              });
              console.log('Ctrl EmpService.getEmployeeId empId:'+tc.empId );
        },function(error){
          console.log('EmpService.getEmployeeId error!');
        });
      }

      function submit(){
        console.log('TimeController.getEmployeeId date:'+ tc.date);
        EmpService.getEmployeeId(tc.emp_username_obj).then(function(empId){
          tc.empId = empId;
          console.log('TimeController.getEmployeeId empId:'+ tc.empId);

          TimeService.saveTime(tc.empId,tc.date).then(function(status){
            tc.status = status;
            console.log('TimeController.saveTime tc.timetracker:');
            console.log(tc.status);
            switch(tc.status){
                case 1:
                    alert('Time in saved successfully!');
                    break;
                case 2:
                    alert('Time out saved successfully!');
                    break;
                default:
                    alert('Error in Saving time-in or time-out!');
            }
          }, function(error){
          alert('TimeController.saveTime Error ' + error);
          });

        }, function(error){
          alert('TimeController getEmployeeId Error ' + error);
        });
      }
  }else{
    console.log('TimeController Please login!');
    alert('Please login!');
    $location.path("/");
  }

});
