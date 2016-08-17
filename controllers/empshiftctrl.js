var myApp = angular.module('EmpShiftCtrl', ['EmpShiftSvc','CookieSvc']);
myApp.controller('EmpShiftController', function EmpShiftController(EmpShiftService, EmpService, ShiftService, CookieService, $location){
  var esc = this;
  esc.cookie_Obj = CookieService.readCookie();
  if(esc.cookie_Obj != null){
    esc.empShiftData = empShiftData;
    esc.employeesData = employeesData;
    esc.shiftData = shiftData;
    esc.saveEmpShift = saveEmpShift;
    esc.editEmpShift = editEmpShift;
    esc.deleteEmpShift = deleteEmpShift;

    empShiftData();
    employeesData();
    shiftData();

    function empShiftData(){
      EmpShiftService.getEmpShift().then(function(viewempshift){
        esc.viewempshift = viewempshift;
        }, function(error){
          alert('Error ' + error);
        });
    }

    function employeesData(){
      EmpService.getEmployees().then(function(employee){
        esc.employee = employee;
        }, function(error){
          alert('Error ' + error);
        });
    }

    function shiftData(){
      // TAShiftService.getShift().then(function(shift){
      ShiftService.getShift().then(function(shift){
          esc.shifts = shift;
      }, function(error){
          alert('Error ' + error);
      });
    }

    function saveEmpShift(empShiftId){
      console.log("emp Shift ID= "+empShiftId);
      if (empShiftId == 0) {
        esc.obj = {
          empId : esc.empId,
          shiftId : esc.shiftId
        };
        esc.endpointsave = '/save/empshift';
      } else {
        esc.endpointsave = '/update/empshift';
      }
      EmpShiftService.savedelEmpShift(esc.obj,esc.endpointsave).then(function(response){
        alert("Employee Shift Saved!");
        empShiftData();
        employeesData();
        shiftData();

        esc.empId = "";
        esc.shiftId = "";

      }, function(error){
          alert('Error ' + error);
      });
    }

    function editEmpShift(empShiftId, shiftId){
      console.log("initial: "+empShiftId+" "+shiftId)
      esc.obj = {
        empShiftId : empShiftId,
        shiftId    : shiftId
      };
      console.log("1st check: "+esc.obj)
      saveEmpShift(empShiftId);
    }

    function deleteEmpShift(empShiftId){
      console.log("initial: "+empShiftId)
      esc.obj = {
        empShiftId    : empShiftId
      };
      console.log("1st check: "+ esc.obj)
      esc.endpointdelete = '/remove/empshift';
      EmpShiftService.savedelEmpShift(esc.obj,esc.endpointdelete).then(function(response){
        alert("Employee Deleted Successfully!");
        empShiftData();
        employeesData();
        shiftData();
      }, function(error){
          alert('Error ' + error);
      });
    }
  }else{
    console.log('EmpController Please login!');
    alert('Please login!');
    $location.path("/");
  }
});
