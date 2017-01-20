(function () {
  'use strict';


  routes.$inject = ['$stateProvider', '$urlRouterProvider'];
  angular.module('scooter')
    .config(routes);


  function routes($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app.dashboard', {
        url: '/dashboard',
        abstract: false,
        templateUrl: '/assets/templates/dashboard/dashboard.html',
        controller: 'DashboardController as dash',
        onEnter: ['$state', 'store', '$rootScope', function($state, store) {
          if(!store.get('isLoggedIn')) {
            $state.go('app.login');
          }
        }]
      })

    $urlRouterProvider.otherwise('/app/dashboard');

  }


})();