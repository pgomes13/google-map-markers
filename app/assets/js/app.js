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
  }).constant('$GoogleApi', {
    geocode: {
      baseUrl: 'https://maps.googleapis.com/maps/api/geocode/json',
      key: 'AIzaSyBNqAX8VtxXJHyad_BGAdRGNx1Jnj2vy8U'
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

  DashboardController.$inject = ['store', '$state', 'StoreOpsFactory', 'GeocodingFactory', '$q', '$timeout'];
  angular.module('scooter').controller('DashboardController', DashboardController);

  function DashboardController(store, $state, StoreOpsFactory, GeocodingFactory, $q, $timeout) {
    var dash = this;

    // function declarations
    dash.logout = logout;
    dash.createTutor = createTutor;
    dash.logout = logout;

    init();

    /**
     * Initialization
     */
    function init() {
      dash.form = {
        name: '',
        address: '',
        subjects: ''
      };

      dash.tutors = [];

      if (store.get('tutors')) {
        dash.tutors = store.get('tutors');
      }

      if (dash.tutors.length > 0) {
        initMap();
      }
    }

    /**
     * Handle the logout from the dashboard
     */
    function logout() {
      store.remove('isLoggedIn');
      $state.go('app.login');
    }

    /**
     * Create new tutor & store in local storage
     */
    function createTutor() {
      $q.all([GeocodingFactory.getLatLong(dash.form.address)]).then(function (responses) {
        StoreOpsFactory.addNewTutor(createTutorObj(responses[0]));
        initMap();
        init();
      });
    }

    /**
     * Return a tutor obj
     * @param geocodes
     * @returns {{name: string, address: string, longitude: *, latitude: *, subjects: Array}}
     */
    function createTutorObj(geocodes) {
      var tutor = {
        name: dash.form.name,
        location: {
          address: dash.form.address,
          longitude: geocodes.lng,
          latitude: geocodes.lat
        },
        subjects: dash.form.subjects.split(',')
      };

      return tutor;
    }

    /**
     * Display the Google map with the tutor markers
     */
    function initMap() {
      var myLatLng = { lat: -25.363, lng: 131.044 };

      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: myLatLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      var infowindow = new google.maps.InfoWindow();
      var marker, i;

      var tutors = store.get('tutors');

      if (tutors) {
        for (i = 0; i < tutors.length; i++) {
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(tutors[i].location.latitude, tutors[i].location.longitude),
            map: map
          });

          google.maps.event.addListener(marker, 'click', function (marker, i) {
            return function () {
              infowindow.setContent(tutors[i].name + ' - ' + tutors[i].subjects.toString());
              infowindow.open(map, marker);
            };
          }(marker, i));
        }
      }
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

  GeocodingFactory.$inject = ['$GoogleApi', '$http', '$q'];

  angular.module('scooter').factory('GeocodingFactory', GeocodingFactory);

  function GeocodingFactory($GoogleApi, $http, $q) {

    return {
      getLatLong: getLatLong
    };

    /**
     * Return a geocode promise
     * @param address
     * @returns {Function}
     */
    function getLatLong(address) {
      var defer = $q.defer();

      $http({
        method: 'GET',
        url: $GoogleApi.geocode.baseUrl + '?address=' + address.replace(/\s/g, '+') + '&key=' + $GoogleApi.geocode.key
      }).then(function successCallback(response) {
        if (response.status === 200) {
          defer.resolve(response.data.results[0].geometry.location);
        }
        // return response.data.results[0].geometry.location;
      }, function errorCallback(response) {
        defer.reject(response);
      });

      return defer.promise;
    }
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

    /**
     * Add the new tutor to local storage
     * @param tutor
     */
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
'use strict';

(function () {
  'use strict';

  arr2string.$inject = [];
  angular.module('scooter').filter('arr2string', arr2string);

  function arr2string() {
    return function (value) {
      return value.toString();
    };
  }
})();