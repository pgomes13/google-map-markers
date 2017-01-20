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

  DashboardController.$inject = ['store', '$state', 'StoreOpsFactory'];
  angular.module('scooter').controller('DashboardController', DashboardController);

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

  StoreOpsFactory.$inject = ['store'];

  angular.module('scooter').factory('StoreOpsFactory', StoreOpsFactory);

  function StoreOpsFactory(store) {

    var tutors = [];

    return {
      addNewTutor: addNewTutor,
      getAllTutors: getAllTutors
    };

    function addNewTutor(tutor) {
      if (store.get('tutors')) {
        tutors = store.get('tutors');
        store.remove('tutors');
        tutors.push(tutor);
        store.set('tutors', tutors);
      } else {
        tutors.push(tutor);
        store.set('tutors', tutors);
      }
    }

    function getAllTutors() {
      return store.get('tutors');
    }
  }
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGVzLmpzIiwiYXBwLmNvbmZpZy5qcyIsImFwcC5jb25zdGFudHMuanMiLCJhcHAucm91dGUuanMiLCJkYXNoYm9hcmQvZGFzaGJvYXJkLmNvbnRyb2xsZXIuanMiLCJkYXNoYm9hcmQvZGFzaGJvYXJkLnJvdXRlLmpzIiwibG9naW4vbG9naW4uY29udHJvbGxlci5qcyIsImxvZ2luL2xvZ2luLnJvdXRlLmpzIiwic3FsaXRlL29wZXJhdGlvbnMuZmFjdG9yeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ3Njb290ZXInLCBbJ3VpLnJvdXRlcicsICd1aS5ib290c3RyYXAnLCAnYW5ndWxhci1zdG9yYWdlJ10pO1xufSkoKTsiLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhcHBSZWFkeS4kaW5qZWN0ID0gWyckc3RhdGUnXTtcblxuICBhbmd1bGFyLm1vZHVsZSgnc2Nvb3RlcicpLnJ1bihhcHBSZWFkeSk7XG5cbiAgZnVuY3Rpb24gYXBwUmVhZHkoJHN0YXRlKSB7XG4gICAgJHN0YXRlLmdvKCdhcHAubG9naW4nKTtcbiAgfVxufSkoKTsiLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnc2Nvb3RlcicpLmNvbnN0YW50KCckbG9naW4nLCB7XG4gICAgdXNlcm5hbWU6ICdzY29vdGVyJyxcbiAgICBwYXNzd29yZDogJ3R1dG9yJ1xuICB9KTtcbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgcm91dGVzLiRpbmplY3QgPSBbJyRzdGF0ZVByb3ZpZGVyJ107XG5cbiAgYW5ndWxhci5tb2R1bGUoJ3Njb290ZXInKS5jb25maWcocm91dGVzKTtcblxuICBmdW5jdGlvbiByb3V0ZXMoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnYXBwJywge1xuICAgICAgdXJsOiAnL2FwcCcsXG4gICAgICBhYnN0cmFjdDogdHJ1ZSxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgIGNvbnRlbnQ6IHtcbiAgICAgICAgICB0ZW1wbGF0ZTogJzx1aS12aWV3PjwvdWktdmlldz4nXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSkoKTsiLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBEYXNoYm9hcmRDb250cm9sbGVyLiRpbmplY3QgPSBbJ3N0b3JlJywgJyRzdGF0ZScsICdTdG9yZU9wc0ZhY3RvcnknXTtcbiAgYW5ndWxhci5tb2R1bGUoJ3Njb290ZXInKS5jb250cm9sbGVyKCdEYXNoYm9hcmRDb250cm9sbGVyJywgRGFzaGJvYXJkQ29udHJvbGxlcik7XG5cbiAgZnVuY3Rpb24gRGFzaGJvYXJkQ29udHJvbGxlcihzdG9yZSwgJHN0YXRlLCBTdG9yZU9wc0ZhY3RvcnkpIHtcbiAgICB2YXIgZGFzaCA9IHRoaXM7XG5cbiAgICAvLyBmdW5jdGlvbiBkZWNsYXJhdGlvbnNcbiAgICBkYXNoLmxvZ291dCA9IGxvZ291dDtcbiAgICBkYXNoLmNyZWF0ZVR1dG9yID0gY3JlYXRlVHV0b3I7XG5cbiAgICBpbml0KCk7XG5cbiAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgZGFzaC5mb3JtID0ge1xuICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgYWRkcmVzczogJycsXG4gICAgICAgIHN1YmplY3RzOiAnJ1xuICAgICAgfTtcblxuICAgICAgU3RvcmVPcHNGYWN0b3J5LmdldEFsbFR1dG9ycygpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvZ291dCgpIHtcbiAgICAgIHN0b3JlLnJlbW92ZSgnaXNMb2dnZWRJbicpO1xuICAgICAgJHN0YXRlLmdvKCdhcHAubG9naW4nKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVUdXRvcigpIHtcbiAgICAgIHZhciB0dXRvciA9IHtcbiAgICAgICAgbmFtZTogZGFzaC5mb3JtLm5hbWUsXG4gICAgICAgIGFkZHJlc3M6IGRhc2guZm9ybS5hZGRyZXNzLFxuICAgICAgICBzdWJqZWN0czogZGFzaC5mb3JtLnN1YmplY3RzLnNwbGl0KCcsJylcbiAgICAgIH07XG5cbiAgICAgIFN0b3JlT3BzRmFjdG9yeS5hZGROZXdUdXRvcih0dXRvcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhc2g7XG4gIH1cbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgcm91dGVzLiRpbmplY3QgPSBbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlciddO1xuICBhbmd1bGFyLm1vZHVsZSgnc2Nvb3RlcicpLmNvbmZpZyhyb3V0ZXMpO1xuXG4gIGZ1bmN0aW9uIHJvdXRlcygkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2FwcC5kYXNoYm9hcmQnLCB7XG4gICAgICB1cmw6ICcvZGFzaGJvYXJkJyxcbiAgICAgIGFic3RyYWN0OiBmYWxzZSxcbiAgICAgIHRlbXBsYXRlVXJsOiAnL2Fzc2V0cy90ZW1wbGF0ZXMvZGFzaGJvYXJkL2Rhc2hib2FyZC5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdEYXNoYm9hcmRDb250cm9sbGVyIGFzIGRhc2gnLFxuICAgICAgb25FbnRlcjogWyckc3RhdGUnLCAnc3RvcmUnLCAnJHJvb3RTY29wZScsIGZ1bmN0aW9uICgkc3RhdGUsIHN0b3JlKSB7XG4gICAgICAgIGlmICghc3RvcmUuZ2V0KCdpc0xvZ2dlZEluJykpIHtcbiAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5sb2dpbicpO1xuICAgICAgICB9XG4gICAgICB9XVxuICAgIH0pO1xuXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2FwcC9kYXNoYm9hcmQnKTtcbiAgfVxufSkoKTsiLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBMb2dpbkNvbnRyb2xsZXIuJGluamVjdCA9IFsnJGxvZ2luJywgJ3N0b3JlJywgJyRzdGF0ZSddO1xuICBhbmd1bGFyLm1vZHVsZSgnc2Nvb3RlcicpLmNvbnRyb2xsZXIoJ0xvZ2luQ29udHJvbGxlcicsIExvZ2luQ29udHJvbGxlcik7XG5cbiAgZnVuY3Rpb24gTG9naW5Db250cm9sbGVyKCRsb2dpbiwgc3RvcmUsICRzdGF0ZSkge1xuICAgIHZhciBsb2dpbiA9IHRoaXM7XG5cbiAgICAvLyBmdW5jdGlvbiBkZWNsYXJhdGlvbnNcbiAgICBsb2dpbi5hdXRoZW50aWNhdGVVc2VyID0gYXV0aGVudGljYXRlVXNlcjtcbiAgICBsb2dpbi5jbG9zZUFsZXJ0ID0gY2xvc2VBbGVydDtcblxuICAgIGluaXQoKTtcblxuICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICBsb2dpbi5zaG93RXJyb3JNc2cgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhdXRoZW50aWNhdGVVc2VyKCkge1xuICAgICAgaWYgKGxvZ2luLnVzZXJuYW1lID09PSAkbG9naW4udXNlcm5hbWUgJiYgbG9naW4ucGFzc3dvcmQgPT09ICRsb2dpbi5wYXNzd29yZCkge1xuICAgICAgICBzdG9yZS5zZXQoJ2lzTG9nZ2VkSW4nLCB0cnVlKTtcbiAgICAgICAgJHN0YXRlLmdvKCdhcHAuZGFzaGJvYXJkJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2dpbi5zaG93RXJyb3JNc2cgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsb3NlQWxlcnQoKSB7XG4gICAgICBsb2dpbi5zaG93RXJyb3JNc2cgPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbG9naW47XG4gIH1cbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgTG9naW5Sb3V0ZS4kaW5qZWN0ID0gWyckc3RhdGVQcm92aWRlciddO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdzY29vdGVyJykuY29uZmlnKExvZ2luUm91dGUpO1xuXG4gIGZ1bmN0aW9uIExvZ2luUm91dGUoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnYXBwLmxvZ2luJywge1xuICAgICAgdXJsOiAnL2xvZ2luJyxcbiAgICAgIGFic3RyYWN0OiBmYWxzZSxcbiAgICAgIHRlbXBsYXRlVXJsOiAnL2Fzc2V0cy90ZW1wbGF0ZXMvbG9naW4vbG9naW4uaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnTG9naW5Db250cm9sbGVyIGFzIGxvZ2luJyxcbiAgICAgIG9uRW50ZXI6IFsnJHN0YXRlJywgJ3N0b3JlJywgZnVuY3Rpb24gKCRzdGF0ZSwgc3RvcmUpIHtcbiAgICAgICAgaWYgKHN0b3JlLmdldCgnaXNMb2dnZWRJbicpKSB7XG4gICAgICAgICAgJHN0YXRlLmdvKCdhcHAuZGFzaGJvYXJkJyk7XG4gICAgICAgIH1cbiAgICAgIH1dXG4gICAgfSk7XG4gIH1cbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgU3RvcmVPcHNGYWN0b3J5LiRpbmplY3QgPSBbJ3N0b3JlJ107XG5cbiAgYW5ndWxhci5tb2R1bGUoJ3Njb290ZXInKS5mYWN0b3J5KCdTdG9yZU9wc0ZhY3RvcnknLCBTdG9yZU9wc0ZhY3RvcnkpO1xuXG4gIGZ1bmN0aW9uIFN0b3JlT3BzRmFjdG9yeShzdG9yZSkge1xuXG4gICAgdmFyIHR1dG9ycyA9IFtdO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFkZE5ld1R1dG9yOiBhZGROZXdUdXRvcixcbiAgICAgIGdldEFsbFR1dG9yczogZ2V0QWxsVHV0b3JzXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGFkZE5ld1R1dG9yKHR1dG9yKSB7XG4gICAgICBpZiAoc3RvcmUuZ2V0KCd0dXRvcnMnKSkge1xuICAgICAgICB0dXRvcnMgPSBzdG9yZS5nZXQoJ3R1dG9ycycpO1xuICAgICAgICBzdG9yZS5yZW1vdmUoJ3R1dG9ycycpO1xuICAgICAgICB0dXRvcnMucHVzaCh0dXRvcik7XG4gICAgICAgIHN0b3JlLnNldCgndHV0b3JzJywgdHV0b3JzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHR1dG9ycy5wdXNoKHR1dG9yKTtcbiAgICAgICAgc3RvcmUuc2V0KCd0dXRvcnMnLCB0dXRvcnMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEFsbFR1dG9ycygpIHtcbiAgICAgIHJldHVybiBzdG9yZS5nZXQoJ3R1dG9ycycpO1xuICAgIH1cbiAgfVxufSkoKTsiXX0=
