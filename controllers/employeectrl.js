var myApp = angular.module('EmployeeCtrl', ['EmployeeSvc','CookieSvc']);
myApp.controller('EmpController', function EmpController(EmpService, CookieService, $location){
  var ec = this;
  ec.cookie_Obj = CookieService.readCookie();
  if(ec.cookie_Obj != null){
    ec.saveEmployee = saveEmployee;
    ec.editEmployee = editEmployee;
    ec.deleteEmployee = deleteEmployee;
    ec.getEmpId = getEmpId;

    employeesData();

    function getEmpId(emp_username){
      console.log("initial: "+emp_username);
      ec.obj = {
        emp_username : emp_username
      };
      // ec.endpointget = '/employee/getempid';
      // TAAdminService.getEmployeeId(ac.obj,ac.endpointget).then(function(empId){
      EmpService.getEmployeeId(ec.obj).then(function(empId){

        ec.empId = empId;
        }, function(error){
          alert('Error ' + error);
        });
    }

    function employeesData(){
      // TAAdminService.getEmployees().then(function(employee){
      EmpService.getEmployees().then(function(employee){
        ec.employee = employee;
        }, function(error){
          alert('Error ' + error);
        });
    }

    function editEmployee(empId, emp_username, emp_fullname, emp_level){
      console.log("initial: "+empId+" "+emp_username+" "+emp_fullname+" "+emp_level)
      ec.obj = {
        empId        : empId,
        emp_username : emp_username,
        emp_fullname : emp_fullname,
        emp_level    : emp_level
      };
      console.log("editEmployee 1st check: ec.obj:");
      console.log(ec.obj);
      saveEmployee(empId);
    }

    function deleteEmployee(empId){
      console.log("deleteEmployee initial: empId"+ empId);
      ec.obj = {
        empId    : empId
      };
      console.log("1st check: ec.obj:");
      console.log(ec.obj);
      ec.endpointdelete = '/remove/employee';
      // TAAdminService.savedelEmployee(ac.obj,ac.endpointdelete).then(function(response){
      EmpService.savedelEmployee(ec.obj,ec.endpointdelete).then(function(response){
        alert("Employee Deleted Successfully!");
        employeesData();
      }, function(error){
          alert('Error ' + error);
      });
    }

    function saveEmployee(empId){
      console.log("saveEmployee emp ID= " + empId);
      if (empId == 0) {
        ec.obj = {
          emp_username : ec.emp_username,
          emp_fullname : ec.emp_fullname,
          emp_level    : ec.emp_level
        };
        console.log('saveEmployee emp_username:'+ec.emp_username);
        console.log("saveEmployee ec insert value"+ ec.emp_username+" "+ec.emp_fullname+" "+ec.emp_level);
        console.log("obj insert value ec.obj:");
        console.log(ec.obj);
        ec.endpointsave = '/save/employee';
      } else {
        console.log("saveEmployee else pasok d2");
        console.log("2nd check: ec.obj:");
        console.log(ec.obj)
        ec.endpointsave = '/update/employee';
      }
      // TAAdminService.savedelEmployee(ac.obj,ac.endpointsave).then(function(response){
      EmpService.savedelEmployee(ec.obj,ec.endpointsave).then(function(response){

        alert("Employee Update Successful!");
        employeesData();

        ec.emp_username = "";
        ec.emp_fullname = "";
        ec.emp_level = "";

      }, function(error){
          alert('Error ' + error);
      });
    }
  }else{
    console.log('TimeController Please login!');
    alert('Please login!');
    $location.path("/");
  }
});
