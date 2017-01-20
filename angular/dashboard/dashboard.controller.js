(function () {
  'use strict';

  DashboardController.$inject = ['store', '$state', 'DbOpsFactory'];
  angular.module('scooter')
    .controller('DashboardController', DashboardController);


  function DashboardController(store, $state, DbOpsFactory) {
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

      DbOpsFactory.addNewTutor(tutor);
    }

    return dash;
  }


})();