'use strict';

(function () {
  'use strict';

  angular.module('scooter', ['ui.router', 'ui.bootstrap']);
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

  angular.module('scooter').constant('username', 'scooterTutor').constant('password', 'rotoos');
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

  LoginRoute.$inject = ['$stateProvider'];

  angular.module('scooter').config(LoginRoute);

  function LoginRoute($stateProvider) {
    $stateProvider.state('app.login', {
      url: '/login',
      abstract: false,
      templateUrl: '/assets/templates/login/login.html'
    });
  }
})();