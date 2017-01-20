(function () {
  'use strict';

  LoginController.$inject = ['$login', 'store', '$state'];
  angular.module('scooter')
    .controller('LoginController', LoginController);


  function LoginController($login, store, $state) {
    var login = this;

    // function declarations
    login.authenticateUser = authenticateUser;
    login.closeAlert = closeAlert;

    init();

    function init() {
      login.showErrorMsg = false;
    }

    function authenticateUser() {
      if (login.username === $login.username && login.password === $login.password) {
        store.set('isLoggedIn', true);
        $state.go('app.dashboard');
      } else {
        login.showErrorMsg = true;
      }
    }

    function closeAlert() {
      login.showErrorMsg = false;
    }

    return login;
  }


})();