var myApp = angular.module('ShiftCtrl', ['ShiftSvc','CookieSvc']);
myApp.controller('ShiftController', function ShiftController(ShiftService, CookieService, $scope, $location){
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
