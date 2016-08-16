var myApp = angular.module('myApplication', ['Constants','ngRoute','ngCookies','LoginCtrl','LoginMainCtrl','EmpTimeTrackerCtrl','EmployeeCtrl','EmpShiftCtrl','ShiftCtrl','TimeCtrl','TimeTrackerRptCtrl']);

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
