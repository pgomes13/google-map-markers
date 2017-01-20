(function () {
  'use strict';

  LoginRoute.$inject = ['$stateProvider'];

  angular
    .module('scooter')
    .config(LoginRoute);

  function LoginRoute($stateProvider) {
    $stateProvider
      .state('app.login', {
        url: '/login',
        abstract: false,
        templateUrl: '/assets/templates/login/login.html'
      });

  }
})();