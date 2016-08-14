var myApp = angular.module('myApplication', ['ngRoute','ngCookies']);
myApp.constant('admintimetracker_obj','./json/timetrackerlist.json');
myApp.constant('loginmain_obj','http://localhost:8080/login/viewall');
myApp.constant('adminshift_obj','http://localhost:8080/shift/viewall');
myApp.constant('employees_obj','http://localhost:8080/employee/viewall');
myApp.constant('empshift_obj','http://localhost:8080/empshift/viewall');
myApp.constant('ttreport_obj','http://localhost:8080/timetracker/viewall');
myApp.constant('HOST', 'http://localhost:8080/')
// configure our routes

myApp.config(function($routeProvider) {
  $routeProvider

    // route for the login page
    .when('/', {
      templateUrl : 'pages/login.html',
      controller  : 'LoginController',
      controllerAs: 'loginCtrl'
    })
    // route for the home page
    .when('/timein_out', {
      templateUrl : 'pages/timein_out.html',
      controller  : 'TimeController',
      controllerAs: 'timeCtrl'
    })

    // route for the timetracker user page
    .when('/timetracker', {
      templateUrl : 'pages/timetracker.html',
      controller  : 'EmpTimetrackerController',
      controllerAs: 'emptimetrackerCtrl'
    })
    // route for the timetracker admin page
    .when('/ttreport', {
      templateUrl : 'pages/ttreport.html',
      controller  : 'TTReportController',
      controllerAs: 'ttReportCtrl'
    })
    // route for the shift admin page
    .when('/shift', {
      templateUrl : 'pages/shift.html',
      controller  : 'ShiftController',
      controllerAs: 'shiftCtrl'
    })
    // route for the employees maintenance admin page
    .when('/employees', {
      templateUrl : 'pages/employees.html',
      controller  : 'EmpController',
      controllerAs: 'adminempCtrl'
    })
    .when('/empshift', {
      templateUrl : 'pages/empshift.html',
      controller  : 'EmpShiftController',
      controllerAs: 'empshiftCtrl'
    })
    .when('/loginMain', {
      templateUrl : 'pages/loginmain.html',
      controller  : 'loginMainController',
      controllerAs: 'loginMainCtrl'
    })
    .otherwise({redirectTo: '/'});
});

myApp.service('CookieService', function CookieService($cookieStore){
  console.log('CookieService');
  var sc = this;
  sc.name = '';

  sc.writeCookie = writeCookie;
  function writeCookie(cookieindex,tempString){
    sc.cookieindex = cookieindex;
    sc.tempString = tempString;
    console.log('writeCookie cookieindex:' + cookieindex);
    console.log('writeCookie tempString:' + tempString);
    // console.log('CookieService.putCookie');
    if (sc.cookieindex ==1){
      $cookieStore.put("Name", sc.tempString);
      // console.log('writeCookie sc.name:' + sc.tempString);
    }else if(sc.cookieindex ==2){
      $cookieStore.put("Password", sc.tempString);
      // console.log('writeCookie sc.password:' + sc.tempString);
    }
    sc.wstatus = 1;
    return sc.wstatus;
  }

  sc.readCookie = readCookie;
  function readCookie(){
    console.log('CookieService.readCookie');
    sc.username = $cookieStore.get('Name');
    sc.password = $cookieStore.get('Password');

    if(sc.username!=null){
      console.log('cookiename:'+ sc.username);
      console.log('cookiepassword:'+ sc.password);
      var cookie_obj={
        "Username":sc.username,
        "Password":sc.password
      };
    }else{
      var cookie_obj = null;
    }

    return cookie_obj;
  }

  sc.removeCookie=removeCookie;
  function removeCookie(){
    console.log('CookieService.removeCookie');
    $cookieStore.remove('Name');
    $cookieStore.remove('Password');
    var dstatus =3;
    return dstatus;
  }

  status_obj={
    'writeCookie':writeCookie,
    'readCookie':readCookie,
    'removeCookie':removeCookie,
  };
  return status_obj;
});

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

myApp.service('EmpService', function EmpService($q, $http, HOST){
  var ts = this;
  ts.getEmployees = getEmployees;
  ts.savedelEmployee = savedelEmployee;
  ts.getEmployeeId = getEmployeeId;

  function getEmployeeId(obj){
    // console.log("obj value: ");
    // console.log(obj);

    var endpoint = 'employee/getempid';
    var URL = HOST + endpoint;

    var deferred = $q.defer();
    $http({
        method:'GET',
        url : URL,
        params : obj
        }).success(function (data, status, headers, config) {
        //console.log(data);
        deferred.resolve(data);
        }).error(function (data, status, headers, config) {
        deferred.reject(status);
        });
      return deferred.promise;
  }

  function getEmployees(){
    var defer = $q.defer();
      var endpoint = 'employee/viewall';
      $http.get(HOST + endpoint).then(function(response) {
      defer.resolve(response.data);
    }, function(error){
      defer.reject('EmpService.getEmployees error!' + error);
    });
    return defer.promise;
  }

  function savedelEmployee(obj, endpoint){
    console.log("obj value: ");
    console.log(obj);
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

myApp.service('EmpShiftService', function EmpShiftService($q, $http, empshift_obj,HOST){
  var ess = this;
  ess.getEmpShift = getEmpShift;
  ess.savedelEmpShift = savedelEmpShift;
  // ess.deleteEmpShift = deleteEmpShift;

  function getEmpShift(){
    var defer = $q.defer();
      $http.get(empshift_obj).then(function(response){
      defer.resolve(response.data);
    }, function(error){
      defer.reject('getEmpShift error!' + error);
    });
    return defer.promise;
  }

  function savedelEmpShift(obj, endpoint){
    console.log("obj value: "+ obj);
    var deferred = $q.defer();
    console.log('obj:');
    console.log(obj);
    console.log('endpoint:'+ endpoint);

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

myApp.service('LoginService', function LoginService($q, $http, HOST){
  console.log('LoginService');

  var ls = this;
  ls.emp_password = '';

  ls.validateLogin = validateLogin;
  function validateLogin(emp_username, emp_password){
      var defer = $q.defer();
      console.log('LoginService.validateLogin');
      console.log('emp_username:'+emp_username);
      console.log('emp_password:'+emp_password);
      ls.emp_username = emp_username;
      ls.emp_password = emp_password;

      // console.log('ls.emp_username:'+ ls.emp_username);
      // console.log('ls.emp_password:'+ ls.emp_password);

      dataObj = {
        "user_name":ls.emp_username,
        "user_password":ls.user_password
      };

      var URL = HOST + 'checkusernamepassword';
      var login = '?user_name=' + ls.emp_username + '&user_password=' + ls.emp_password;
      $http.post(URL + login, dataObj)
        .success(function(data, status, headers, config){
            defer.resolve(data);
            console.log('LoginService.validateLogin post success:' + data);
        })
        .error(function(data, status, headers, config) {
            defer.reject('error!' + status);
            console.log( "LoginService validateLogin post ailure message: " + JSON.stringify({data: data}));
        });
      return defer.promise;
  }
});

myApp.controller('ShiftController', function ShiftController(ShiftService, CookieService, $scope, $location){
// myApp.controller('ShiftController', function ShiftController(TAShiftService, $scope){
  var sc = this;
  sc.cookie_Obj = CookieService.readCookie();
  sc.cookiePassword = null;
  if(sc.cookie_Obj != null){
    sc.cookiePassword = sc.cookie_Obj['Password'];
  }

  if (sc.cookiePassword != null){
    sc.shiftData = shiftData;
    sc.editShift = editShift;
    sc.deleteShift = deleteShift;
    sc.saveShift = saveShift;

    //this function will display all shift
    shiftData();

    // console.log("first value"+ sc.obj);

    function shiftData(){
      // TAShiftService.getShift().then(function(shift){
      ShiftService.getShift().then(function(shift){

          sc.shifts = shift;
      }, function(error){
          alert('Error ' + error);
      });
    }

    function editShift(shiftId, shift_start, shift_end, shift_break, shift_name){
      console.log("initial: "+shiftId+" "+shift_start+" "+shift_end)
      sc.obj = {
        shiftId    : shiftId,
        shift_start : shift_start,
        shift_end   : shift_end,
        shift_break : shift_break,
        shift_name  : shift_name
      };
      console.log("1st check: sc.obj:");
      console.log(sc.obj);
      saveShift(shiftId);
    }

    function deleteShift(shiftId){
      console.log("initial: "+shiftId)
      sc.obj = {
        shiftId    : shiftId
      };
      console.log("1st check: sc.obj:");
      console.log(sc.obj);
      sc.endpointdelete = 'shift/remove';
      ShiftService.savedelShift(sc.obj,sc.endpointdelete).then(function(response){
        alert("Shift Deleted Successfully!");
        shiftData();
      }, function(error){
          alert('Error ' + error);
      });
    }

    function saveShift(shiftId){
      console.log("shift ID= "+shiftId);
      if (shiftId == 0) {
        sc.obj = {
          shift_start : sc.shift_start,
          shift_end   : sc.shift_end,
          shift_break : sc.shift_break,
          shift_name  : sc.shift_name
        };
        console.log("insert value sc.obj:");
        console.log(sc.obj);
        sc.endpointsave = 'shift/save';
      } else {
        console.log("pasok d2");
        console.log("2nd check: sc.obj:");
        console.log(sc.obj);
        sc.endpointsave = 'shift/update';
      }
      ShiftService.savedelShift(sc.obj,sc.endpointsave).then(function(response){

        alert("Shift Saved Successfuly!");
        shiftData();

        sc.shift_start = "";
        sc.shift_end = "";
        sc.shift_break = "";
        sc.shift_name = "";

      }, function(error){
          alert('Error ' + error);
      });
    }
  }else{
      console.log('ShiftController Please login!');
      alert('Please login!');
      $location.path("/");
  }
});

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

myApp.controller('TimeController',function TimeController(CookieService, EmpService, TimeService, $location, $scope){
  var tc = this;
  tc.cookie_Obj = CookieService.readCookie();
  tc.cookiePassword = null;

  if(tc.cookie_Obj != null){
    tc.cookiePassword = tc.cookie_Obj['Password'];
  }

  if (tc.cookiePassword != null){
      tc.cookieName = tc.cookie_Obj['Username'];
      tc.submit = submit;
      tc.dates = TimeService.getsystemDates();

      tc.emp_username_obj = {
        emp_username:tc.cookieName
      };
      tc.checkButtonName = checkButtonName;
      console.log('TimeController.emp_username_obj:');
      console.log(tc.emp_username_obj);

      EmpService.getEmployeeId(tc.emp_username_obj).then(function(empId){
        tc.empId = empId;
        console.log('empId:'+tc.empId );
      },function(error){
        console.log('EmpService.getEmployeeId error!');
      });

      tc.buttonName = 'Time In/Out';
      // checkButtonName();
      // tc.checkButtonName = checkButtonName;
      function checkButtonName(){
          console.log('checkButtonName empId:'+ tc.empId + '; selectedDate:'+ tc.selectedDate);
          TimeService.getCustomizedButtonName(tc.empId,tc.selectedDate).then(function(timeStatus){
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
      }

      function submit(selectedDate){
        console.log('TimeController.getEmployeeId date:'+ tc.selectedDate);
        tc.selectedDate = selectedDate;
        EmpService.getEmployeeId(tc.emp_username_obj).then(function(empId){
          tc.empId = empId;
          console.log('TimeController.getEmployeeId empId:'+ tc.empId);

          TimeService.saveTime(tc.empId,tc.selectedDate).then(function(status){
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
// myApp.controller('AdminempController', function AdminempController(TAAdminService){
myApp.controller('EmpController', function EmpController(EmpService, CookieService, $location){
  var ec = this;
  ec.cookie_Obj = CookieService.readCookie();
  ec.cookiePassword = null;
  if(ec.cookie_Obj != null){
    ec.cookiePassword = ec.cookie_Obj['Password'];
  }

  if (ec.cookiePassword != null){
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
      ec.endpointdelete = 'employee/remove';
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
        ec.endpointsave = 'employee/save';
      } else {
        console.log("saveEmployee else pasok d2");
        console.log("2nd check: ec.obj:");
        console.log(ec.obj)
        ec.endpointsave = 'employee/update';
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

// myApp.controller('EmpShiftController', function EmpShiftController(EmpShiftService, TAAdminService, TAShiftService){
myApp.controller('EmpShiftController', function EmpShiftController(EmpShiftService, EmpService, ShiftService, CookieService, $location){
  var esc = this;
  esc.cookie_Obj = CookieService.readCookie();
  esc.cookiePassword = null;
  if(esc.cookie_Obj != null){
    esc.cookiePassword = esc.cookie_Obj['Password'];
  }

  if (esc.cookiePassword != null){
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
        esc.endpointsave = 'empshift/save';
      } else {
        esc.endpointsave = 'empshift/update';
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
      esc.endpointdelete = 'empshift/remove';
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

myApp.controller('TTReportController', function TTReportController(TTReportService, EmpService, CookieService, $location){
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


myApp.controller('LoginController', function LoginController(LoginService,CookieService, $scope, $location,$cookieStore, $window){
  var vm=$scope;

    renderButton();
    function renderButton(){
      // console.log('render');
      var gapi= $window.gapi;
      gapi.signin2.render('my-signin2',
          {
            'scope': 'profile email',
            'width': 240,
            'height': 50,
            'longtitle': true,
            'theme': 'dark',
            'onsuccess': onSuccess,
            'onfailure': onFailure
          }
        );
    }

    vm.onSuccess = onSuccess;
    function onSuccess(googleUser){
      console.log('onSuccess');
        vm.googleUser = googleUser;
        var profile = vm.googleUser.getBasicProfile();
        // console.log('Name: ' + profile.getName());
        // console.log('Email: ' + profile.getEmail());
        lc.emp_username = profile.getEmail();

        vm.readcookie_obj = CookieService.readCookie();

        if(vm.readcookie_obj!=null){
          vm.cookieName = vm.readcookie_obj['Username'];
          vm.cookiePassword = vm.readcookie_obj['Password'];

          if (vm.cookieName==null||vm.cookiePassword==null){
            CookieService.removeCookie();
            vm.writestatus = CookieService.writeCookie(1,vm.cookieName);
          }

          if (vm.writestatus == 1){
            lc.signin = true;
            console.log('Write cookie username successful');
          }else{
            console.log('Write cookie username error!');
          }
        }else{
          vm.writestatus = CookieService.writeCookie(1,lc.emp_username);
          lc.signin = true;
        }
    }

    function onFailure(error) {
        console.log('LoginController onFailure:'+error);
    }

    var lc = this;

    onLoad();
    function onLoad(){
      console.log('LoginController onLoad');
      lc.signin = false;
      lc.validatedsignedin = false;
      var cookieName_obj = CookieService.readCookie();

      if(cookieName_obj!=null){
        lc.cookieName = cookieName_obj['Username'];

        if(lc.cookieName != null){
          lc.signin = true;
          lc.cookiePassword = cookieName_obj['Password'];

          if(lc.cookiePassword != null){
            lc.validatedsignedin = true;
          }
        }
      }else{
        console.log('LoginController onLoad cookie is null.');
      }
    }

    vm.submitForm = submitForm;
    function submitForm(isValid,emp_password){
      lc.cookieName_obj = CookieService.readCookie();
      if(lc.cookieName_obj!=null){
        lc.signin = true;
      }else{
        lc.signin = false;
      }
      console.log('lc.signin:'+ lc.signin);
      if(isValid && lc.signin){
        lc.emp_password = emp_password;
        console.log('lc.emp_password:'+lc.emp_password);
        lc.Username = lc.cookieName_obj['Username'];
        LoginService.validateLogin(lc.Username, lc.emp_password).then(function(loginstatus){
           lc.loginstatus = loginstatus;
           switch(lc.loginstatus) {
               case 0:
               case 3:
                   alert('Invalid Username/Password!');
                   lc.emp_username = '';//clear username text box
                   lc.emp_password = '';//clear password text box

                   break;
               case 2:
                   alert('Login Successful!');
                   lc.writestatus = CookieService.writeCookie(2,lc.emp_password);
                   if (lc.writestatus == 1){
                     lc.validatedsignin = true;
                     console.log('Write cookie pw successful');
                     $location.path("/timein_out");
                   }else{
                     console.log('Write cookie pw error!');
                   }
                   break;
               default:
                   vm.validatedsignin = false;
                   alert('Unable to authenticate!');
           }
          //  vm.emp_username = '';//clear username text box
           lc.emp_password = '';//clear password text box
         }, function(error){
            console.log("LoginController.validateLogin Error" + JSON.stringify({error: error}));
        });
      }else{
        lc.emp_password = '';//clear password text box
        alert('Please sign in with google first. Thanks!');
      }
    }

    vm.signOut = signOut;
    function signOut(){
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function() {
          console.log('User signed out.');
      });

      var cookieStatus = CookieService.removeCookie();
      if (cookieStatus == 3){
        lc.emp_username = '';

        console.log('Cookies deleted.');
      }else{
        console.log('Error in deleting cookie!');
        console.log('deletecookieStatus:'+ cookieStatus);
      }
      lc.validatedsignin = false;
      $location.path("/");
    }
});

myApp.controller('loginMainController', function loginMainController(LoginMainService, EmpService, CookieService, $location){
  var lm = this;
  lm.cookie_Obj = CookieService.readCookie();
  lm.cookiePassword = null;

  if(lm.cookie_Obj != null){
    lm.cookiePassword = lm.cookie_Obj['Password'];
  }

  if (lm.cookiePassword != null){
    lm.employeesData = employeesData;
    lm.loginMainData = loginMainData;
    lm.saveLoginMain = saveLoginMain;
    lm.editLoginMain = editLoginMain;
    lm.deleteLoginMain = deleteLoginMain;
    lm.insertLoginMain = insertLoginMain;

    employeesData();
    loginMainData();

    function employeesData(){
      EmpService.getEmployees().then(function(employee){
        lm.employee = employee;
        }, function(error){
          alert('Error ' + error);
        });
    }

    function loginMainData(){
      LoginMainService.getvAllUserLogin().then(function(viewlogininfo){
        lm.viewlogininfo = viewlogininfo;
        }, function(error){
          alert('Error ' + error);
        });
    }

    function insertLoginMain() {
        // lm.username=username;
        // checkCountUsername(lm.username);
        // lm.obj = {
        //   user_name : lm.username
        // };
        // lm.endpointcheck = 'login/countusername';
        // console.log('loginMainController insertLoginMain lm.username:'+lm.username);
        // LoginMainService.countUsername(lm.obj,lm.endpointcheck).then(function(cnt_user){
        //   lm.cnt_user = cnt_user;
        //   console.log('LoginMainService.countUsername cnt_user:'+ cnt_user);
        //   }, function(error){
        //     alert('Error ' + error);
        //   });
        //
        // console.log('insertLoginMain lm.username:'+lm.username);
        // console.log('insertLoginMain lm.cnt_user:'+lm.cnt_user);
        // if (lm.cnt_user == 0) {
          saveLoginMain();
        // }else{
        //   // alert("Username already exist!");
        //   loginMainData();
        //   employeesData();
        //
        //   lm.username = "";
        //   lm.password = "";
        // }
    }

    function editLoginMain(userId, password){
      console.log("initial: "+userId+" "+password)
      lm.obj = {
        userId   : userId,
        user_password : password
      };
      console.log("1st check: ")
      console.log(lm.obj)
      //saveLoginMain(userId);
      lm.endpointsave = 'login/update';
      LoginMainService.savedelLogin(lm.obj,lm.endpointsave).then(function(response){
        alert("User password has been reset/change!");
        loginMainData();
        employeesData();

        lm.username = "";
        lm.password = "";

      }, function(error){
          alert('LoginMainService.savedelLogin Error: ' + error);
      });

    }

    function saveLoginMain(){
      lm.obj = {
        username : lm.username,
        password : lm.password
      };

      lm.endpointsave = 'login/save';
      LoginMainService.savedelLogin(lm.obj,lm.endpointsave).then(function(response){
        alert("User Login Saved!");
        loginMainData();
        employeesData();

        lm.username = "";
        lm.password = "";

      }, function(error){
          alert('LoginMainService.savedelLogin Error: ' + error);
      });
      }

    function deleteLoginMain(userId){
      console.log("initial: "+userId)
      lm.obj = {
        userId    : userId
      };
      console.log("1st check: "+lm.obj)
      lm.endpointdelete = 'login/remove';
      LoginMainService.savedelLogin(lm.obj,lm.endpointdelete).then(function(response){
        alert("Login Deleted Successfully!");
        loginMainData();
        employeesData();

      }, function(error){
          alert('Error ' + error);
      });
    }
  }else{
    console.log('loginMainController Please login!');
    alert('Please login!');
    $location.path("/");
  }


});

myApp.service('LoginMainService', function LoginMainService($q, $http, loginmain_obj, HOST){
var lms = this;

lms.getvAllUserLogin = getvAllUserLogin;
lms.savedelLogin = savedelLogin;
// lms.countUsername = countUsername;

  function getvAllUserLogin(){
    var defer = $q.defer();
      $http.get(loginmain_obj).then(function(response) {
        defer.resolve(response.data);
    }, function(error){
      defer.reject('getLoginMain error!' + error);
    });
    return defer.promise;
  }

  // function countUsername(obj, endpoint){
  //   console.log("countUsername obj value::");
  //   console.log(obj);
  //   console.log('endpoint:'+endpoint);
  //   var deferred = $q.defer();
  //   $http({
  //     method: 'GET',
  //     url : HOST + endpoint,
  //     params : obj
  //
  //   }).success(function (data, status, headers, config) {
  //       console.log('data:'+ data);
  //       deferred.resolve(data);
  //     }).error(function (data, status, headers, config) {
  //       deferred.reject(status);
  //     });
  //   return deferred.promise;
  // }

  function savedelLogin(obj, endpoint){
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
