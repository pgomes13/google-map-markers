(function () {
  'use strict';

  DashboardController.$inject = ['store', '$state', 'StoreOpsFactory'];
  angular.module('scooter')
    .controller('DashboardController', DashboardController);


  function DashboardController(store, $state, StoreOpsFactory) {
    var dash = this;

    // function declarations
    dash.logout = logout;
    dash.createTutor = createTutor;

    init();

    function init() {
      dash.form = {
        name: '',
        address: '',
        subjects: ''
      };

      StoreOpsFactory.getAllTutors();
    }

    function logout() {
      store.remove('isLoggedIn');
      $state.go('app.login');
    }

    function createTutor() {
      var tutor = {
        name: dash.form.name,
        address: dash.form.address,
        subjects: dash.form.subjects.split(',')
      };

      StoreOpsFactory.addNewTutor(tutor);
    }

    return dash;
  }


})();