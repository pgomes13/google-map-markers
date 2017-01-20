'use strict';

(function () {
  'use strict';

  angular.module('scooter', ['ui.router', 'ui.bootstrap', 'angular-storage']);
})();
'use strict';

(function () {
  'use strict';

  appReady.$inject = ['$state'];

  angular.module('scooter').run(appReady);

  function appReady($state) {
    $state.go('app.login');
  }
})();
'use strict';

(function () {
  'use strict';

  angular.module('scooter').constant('$login', {
    username: 'scooter',
    password: 'tutor'
  });
})();
'use strict';

(function () {
  'use strict';

  routes.$inject = ['$stateProvider'];

  angular.module('scooter').config(routes);

  function routes($stateProvider) {
    $stateProvider.state('app', {
      url: '/app',
      abstract: true,
      views: {
        content: {
          template: '<ui-view></ui-view>'
        }
      }
    });
  }
})();
'use strict';

(function () {
  'use strict';

  DashboardController.$inject = ['store', '$state'];
  angular.module('scooter').controller('DashboardController', DashboardController);

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
'use strict';

(function () {
  'use strict';

  routes.$inject = ['$stateProvider', '$urlRouterProvider'];
  angular.module('scooter').config(routes);

  function routes($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.dashboard', {
      url: '/dashboard',
      abstract: false,
      templateUrl: '/assets/templates/dashboard/dashboard.html',
      controller: 'DashboardController as dash',
      onEnter: ['$state', 'store', '$rootScope', function ($state, store) {
        if (!store.get('isLoggedIn')) {
          $state.go('app.login');
        }
      }]
    });

    $urlRouterProvider.otherwise('/app/dashboard');
  }
})();
'use strict';

(function () {
  'use strict';

  LoginController.$inject = ['$login', 'store', '$state'];
  angular.module('scooter').controller('LoginController', LoginController);

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
'use strict';

(function () {
  'use strict';

  LoginRoute.$inject = ['$stateProvider'];

  angular.module('scooter').config(LoginRoute);

  function LoginRoute($stateProvider) {
    $stateProvider.state('app.login', {
      url: '/login',
      abstract: false,
      templateUrl: '/assets/templates/login/login.html',
      controller: 'LoginController as login',
      onEnter: ['$state', 'store', function ($state, store) {
        if (store.get('isLoggedIn')) {
          $state.go('app.dashboard');
        }
      }]
    });
  }
})();