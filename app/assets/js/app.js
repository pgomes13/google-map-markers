'use strict';

(function () {
  'use strict';

  angular.module('scooter', ['ui.router', 'ui.bootstrap', 'angular-storage', 'ngSQLite']);
})();
'use strict';

(function () {
  'use strict';

  appReady.$inject = ['$state', '$SQLite', 'DB_CONFIG'];

  angular.module('scooter').run(appReady);

  function appReady($state, $SQLite) {
    $state.go('app.login');

    $SQLite.dbConfig({
      name: 'scooter-tutor',
      description: 'DB to store new tutors',
      version: '1.0'
    });

    $SQLite.init(function (init) {
      angular.forEach(DB_CONFIG, function (config, name) {
        init.step();
        $SQLite.createTable(name, config).then(init.done);
      });
      init.finish();
    });
  }
})();
'use strict';

(function () {
  'use strict';

  angular.module('scooter').constant('$login', {
    username: 'scooter',
    password: 'tutor'
  }).constant('DB_CONFIG', {
    tutor: {
      id: key,
      name: {
        type: 'text',
        null: false
      },
      address: {
        type: 'text',
        null: false
      },
      latitude: {
        type: 'real'
      },
      longitude: {
        type: 'real'
      },
      subjects: {
        type: 'blob'
      }
    }
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

  DashboardController.$inject = ['store', '$state', 'DbOpsFactory'];
  angular.module('scooter').controller('DashboardController', DashboardController);

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
'use strict';

(function () {
  'use strict';

  DbOpsFactory.$inject = ['$SQLite'];

  angular.module('scooter').factory('DbOpsFactory', DbOpsFactory);

  function DbOpsFactory($SQLite) {

    return {
      addNewTutor: addNewTutor
    };

    function addNewTutor(tutor) {
      $SQLite.ready(function () {
        this.insert('tutor', tutor).then(onResult, onError, function (result) {
          console.log(result);
        });
      });
    }
  }
})();