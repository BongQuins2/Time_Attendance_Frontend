var myApp = angular.module('TimeTrackerRptCtrl',['TimeTrackerRptSvc','CookieSvc']);
myApp.controller('TTReportController', function TTReportController(TTReportService, EmpService, CookieService, $location, $scope){
  var tt = this;

  tt.cookie_Obj = CookieService.readCookie();
  tt.cookiePassword = null;
  if(tt.cookie_Obj != null){
    tt.cookiePassword = tt.cookie_Obj['Password'];
  }

  if (tt.cookiePassword != null){
    //tt.timetracker = {};
    tt.ttReportViewAll = ttReportViewAll;
    tt.ttReportViewByEmployee = ttReportViewByEmployee;
    tt.generateTTReport = generateTTReport;
    tt.printDiv = printDiv;
    //tt.objReport = { 1: 'View All Employees', 2: 'View By Employee' };

    ttReportViewAll();

    function ttReportViewAll(){
      TTReportService.getvAllEmpTTReport().then(function(viewtimetracker){
        tt.viewtimetrackers = viewtimetracker;
        }, function(error){
          alert('Error ' + error);
        });
    }

    function generateTTReport(emp_username){
      tt.obj = {
        emp_username    : emp_username
      };

      console.log('generateTTReport emp_username:' + emp_username);
      console.log('generateTTReport tt.obj:');
      console.log(tt.obj);
      if ((emp_username == null)  || (emp_username == "")){
        ttReportViewAll();
      } else{
        ttReportViewByEmployee(emp_username);
      }
      tt.empusername = "";
    }

    function ttReportViewByEmployee(emp_username){
      console.log("initial: "+emp_username)
      tt.obj = {
        emp_username    : emp_username
      };
      console.log("1st check: tt.obj:");
      console.log(tt.obj);
      // tt.endpointget = '/employee/getempid';
      // TAAdminService.getEmployeeId(tt.obj,tt.endpointget).then(function(empId){
      EmpService.getEmployeeId(tt.obj).then(function(empId){
      tt.empId = empId;
      //empId has value
      console.log("2nd check: tt.empId");
      console.log(tt.empId);
      tt.obj = {
        empId    : empId
      };
      console.log("3rd check: tt.obj:");
      console.log(tt.obj);
      // tt.endpointget = '/timetracker/viewByEmployee';
      TTReportService.getvOtherTTReport(tt.obj).then(function(viewtimetracker){
        tt.viewtimetrackers = viewtimetracker;


        }, function(error){
          alert(' TTReportController TTReportService.getvOtherTTReport Error: ' + error);
        });
      }, function(error){
        alert('TTReportController EmpService.getEmployeeId Error: ' + error);
      });
    }

    function printDiv(divName) {
      var printContents = document.getElementById(divName).innerHTML;
      var popupWin = window.open('', '_blank', 'width=300,height=300');
      popupWin.document.open();
      popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
      popupWin.document.close();
    }
  }else{
    console.log('TTReportController Please login!');
    alert('Please login!');
    $location.path("/");
  }
});
