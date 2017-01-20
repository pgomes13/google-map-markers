(function () {
  'use strict';

  DashboardController.$inject = ['store', '$state'];
  angular.module('scooter')
    .controller('DashboardController', DashboardController);


  function DashboardController(store, $state) {
    var dash = this;

    // function declarations
    dash.logout = logout;

    function logout() {
      store.remove('isLoggedIn');
      $state.go('app.login');
    }

    return dash;
  }


})();