(function () {
  'use strict';

  appReady.$inject = ['$state'];

  angular
    .module('scooter')
    .run(appReady);

  function appReady ($state) {
    $state.go('app.login');
  }
})();