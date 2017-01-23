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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGVzLmpzIiwiYXBwLmNvbmZpZy5qcyIsImFwcC5jb25zdGFudHMuanMiLCJhcHAucm91dGUuanMiLCJkYXNoYm9hcmQvZGFzaGJvYXJkLmNvbnRyb2xsZXIuanMiLCJkYXNoYm9hcmQvZGFzaGJvYXJkLnJvdXRlLmpzIiwiZGFzaGJvYXJkL2dlb2NvZGluZy5mYWN0b3J5LmpzIiwibG9naW4vbG9naW4uY29udHJvbGxlci5qcyIsImxvZ2luL2xvZ2luLnJvdXRlLmpzIiwic3RvcmFnZS9vcGVyYXRpb25zLmZhY3RvcnkuanMiLCJnbG9iYWwvZmlsdGVycy9hcnIyc3RyaW5nLmZpbHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ3Njb290ZXInLCBbJ3VpLnJvdXRlcicsICd1aS5ib290c3RyYXAnLCAnYW5ndWxhci1zdG9yYWdlJ10pO1xufSkoKTsiLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhcHBSZWFkeS4kaW5qZWN0ID0gWyckc3RhdGUnXTtcblxuICBhbmd1bGFyLm1vZHVsZSgnc2Nvb3RlcicpLnJ1bihhcHBSZWFkeSk7XG5cbiAgZnVuY3Rpb24gYXBwUmVhZHkoJHN0YXRlKSB7XG4gICAgJHN0YXRlLmdvKCdhcHAubG9naW4nKTtcbiAgfVxufSkoKTsiLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnc2Nvb3RlcicpLmNvbnN0YW50KCckbG9naW4nLCB7XG4gICAgdXNlcm5hbWU6ICdzY29vdGVyJyxcbiAgICBwYXNzd29yZDogJ3R1dG9yJ1xuICB9KS5jb25zdGFudCgnJEdvb2dsZUFwaScsIHtcbiAgICBnZW9jb2RlOiB7XG4gICAgICBiYXNlVXJsOiAnaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2dlb2NvZGUvanNvbicsXG4gICAgICBrZXk6ICdBSXphU3lCTnFBWDhWdHhYSkh5YWRfQkdBZFJHTngxSm5qMnZ5OFUnXG4gICAgfVxuICB9KTtcbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgcm91dGVzLiRpbmplY3QgPSBbJyRzdGF0ZVByb3ZpZGVyJ107XG5cbiAgYW5ndWxhci5tb2R1bGUoJ3Njb290ZXInKS5jb25maWcocm91dGVzKTtcblxuICBmdW5jdGlvbiByb3V0ZXMoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnYXBwJywge1xuICAgICAgdXJsOiAnL2FwcCcsXG4gICAgICBhYnN0cmFjdDogdHJ1ZSxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgIGNvbnRlbnQ6IHtcbiAgICAgICAgICB0ZW1wbGF0ZTogJzx1aS12aWV3PjwvdWktdmlldz4nXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSkoKTsiLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBEYXNoYm9hcmRDb250cm9sbGVyLiRpbmplY3QgPSBbJ3N0b3JlJywgJyRzdGF0ZScsICdTdG9yZU9wc0ZhY3RvcnknLCAnR2VvY29kaW5nRmFjdG9yeScsICckcScsICckdGltZW91dCddO1xuICBhbmd1bGFyLm1vZHVsZSgnc2Nvb3RlcicpLmNvbnRyb2xsZXIoJ0Rhc2hib2FyZENvbnRyb2xsZXInLCBEYXNoYm9hcmRDb250cm9sbGVyKTtcblxuICBmdW5jdGlvbiBEYXNoYm9hcmRDb250cm9sbGVyKHN0b3JlLCAkc3RhdGUsIFN0b3JlT3BzRmFjdG9yeSwgR2VvY29kaW5nRmFjdG9yeSwgJHEsICR0aW1lb3V0KSB7XG4gICAgdmFyIGRhc2ggPSB0aGlzO1xuXG4gICAgLy8gZnVuY3Rpb24gZGVjbGFyYXRpb25zXG4gICAgZGFzaC5sb2dvdXQgPSBsb2dvdXQ7XG4gICAgZGFzaC5jcmVhdGVUdXRvciA9IGNyZWF0ZVR1dG9yO1xuICAgIGRhc2gubG9nb3V0ID0gbG9nb3V0O1xuXG4gICAgaW5pdCgpO1xuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6YXRpb25cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgZGFzaC5mb3JtID0ge1xuICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgYWRkcmVzczogJycsXG4gICAgICAgIHN1YmplY3RzOiAnJ1xuICAgICAgfTtcblxuICAgICAgZGFzaC50dXRvcnMgPSBbXTtcblxuICAgICAgaWYgKHN0b3JlLmdldCgndHV0b3JzJykpIHtcbiAgICAgICAgZGFzaC50dXRvcnMgPSBzdG9yZS5nZXQoJ3R1dG9ycycpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGFzaC50dXRvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICBpbml0TWFwKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIHRoZSBsb2dvdXQgZnJvbSB0aGUgZGFzaGJvYXJkXG4gICAgICovXG4gICAgZnVuY3Rpb24gbG9nb3V0KCkge1xuICAgICAgc3RvcmUucmVtb3ZlKCdpc0xvZ2dlZEluJyk7XG4gICAgICAkc3RhdGUuZ28oJ2FwcC5sb2dpbicpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBuZXcgdHV0b3IgJiBzdG9yZSBpbiBsb2NhbCBzdG9yYWdlXG4gICAgICovXG4gICAgZnVuY3Rpb24gY3JlYXRlVHV0b3IoKSB7XG4gICAgICAkcS5hbGwoW0dlb2NvZGluZ0ZhY3RvcnkuZ2V0TGF0TG9uZyhkYXNoLmZvcm0uYWRkcmVzcyldKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZXMpIHtcbiAgICAgICAgU3RvcmVPcHNGYWN0b3J5LmFkZE5ld1R1dG9yKGNyZWF0ZVR1dG9yT2JqKHJlc3BvbnNlc1swXSkpO1xuICAgICAgICBpbml0TWFwKCk7XG4gICAgICAgIGluaXQoKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiBhIHR1dG9yIG9ialxuICAgICAqIEBwYXJhbSBnZW9jb2Rlc1xuICAgICAqIEByZXR1cm5zIHt7bmFtZTogc3RyaW5nLCBhZGRyZXNzOiBzdHJpbmcsIGxvbmdpdHVkZTogKiwgbGF0aXR1ZGU6ICosIHN1YmplY3RzOiBBcnJheX19XG4gICAgICovXG4gICAgZnVuY3Rpb24gY3JlYXRlVHV0b3JPYmooZ2VvY29kZXMpIHtcbiAgICAgIHZhciB0dXRvciA9IHtcbiAgICAgICAgbmFtZTogZGFzaC5mb3JtLm5hbWUsXG4gICAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgICAgYWRkcmVzczogZGFzaC5mb3JtLmFkZHJlc3MsXG4gICAgICAgICAgbG9uZ2l0dWRlOiBnZW9jb2Rlcy5sbmcsXG4gICAgICAgICAgbGF0aXR1ZGU6IGdlb2NvZGVzLmxhdFxuICAgICAgICB9LFxuICAgICAgICBzdWJqZWN0czogZGFzaC5mb3JtLnN1YmplY3RzLnNwbGl0KCcsJylcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiB0dXRvcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEaXNwbGF5IHRoZSBHb29nbGUgbWFwIHdpdGggdGhlIHR1dG9yIG1hcmtlcnNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbml0TWFwKCkge1xuICAgICAgdmFyIG15TGF0TG5nID0geyBsYXQ6IC0yNS4zNjMsIGxuZzogMTMxLjA0NCB9O1xuXG4gICAgICB2YXIgbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJyksIHtcbiAgICAgICAgem9vbTogNCxcbiAgICAgICAgY2VudGVyOiBteUxhdExuZyxcbiAgICAgICAgbWFwVHlwZUlkOiBnb29nbGUubWFwcy5NYXBUeXBlSWQuUk9BRE1BUFxuICAgICAgfSk7XG5cbiAgICAgIHZhciBpbmZvd2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coKTtcbiAgICAgIHZhciBtYXJrZXIsIGk7XG5cbiAgICAgIHZhciB0dXRvcnMgPSBzdG9yZS5nZXQoJ3R1dG9ycycpO1xuXG4gICAgICBpZiAodHV0b3JzKSB7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0dXRvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKHR1dG9yc1tpXS5sb2NhdGlvbi5sYXRpdHVkZSwgdHV0b3JzW2ldLmxvY2F0aW9uLmxvbmdpdHVkZSksXG4gICAgICAgICAgICBtYXA6IG1hcFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnY2xpY2snLCBmdW5jdGlvbiAobWFya2VyLCBpKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBpbmZvd2luZG93LnNldENvbnRlbnQodHV0b3JzW2ldLm5hbWUgKyAnIC0gJyArIHR1dG9yc1tpXS5zdWJqZWN0cy50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgaW5mb3dpbmRvdy5vcGVuKG1hcCwgbWFya2VyKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfShtYXJrZXIsIGkpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkYXNoO1xuICB9XG59KSgpOyIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHJvdXRlcy4kaW5qZWN0ID0gWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInXTtcbiAgYW5ndWxhci5tb2R1bGUoJ3Njb290ZXInKS5jb25maWcocm91dGVzKTtcblxuICBmdW5jdGlvbiByb3V0ZXMoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhcHAuZGFzaGJvYXJkJywge1xuICAgICAgdXJsOiAnL2Rhc2hib2FyZCcsXG4gICAgICBhYnN0cmFjdDogZmFsc2UsXG4gICAgICB0ZW1wbGF0ZVVybDogJy9hc3NldHMvdGVtcGxhdGVzL2Rhc2hib2FyZC9kYXNoYm9hcmQuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnRGFzaGJvYXJkQ29udHJvbGxlciBhcyBkYXNoJyxcbiAgICAgIG9uRW50ZXI6IFsnJHN0YXRlJywgJ3N0b3JlJywgJyRyb290U2NvcGUnLCBmdW5jdGlvbiAoJHN0YXRlLCBzdG9yZSkge1xuICAgICAgICBpZiAoIXN0b3JlLmdldCgnaXNMb2dnZWRJbicpKSB7XG4gICAgICAgICAgJHN0YXRlLmdvKCdhcHAubG9naW4nKTtcbiAgICAgICAgfVxuICAgICAgfV1cbiAgICB9KTtcblxuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9hcHAvZGFzaGJvYXJkJyk7XG4gIH1cbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgR2VvY29kaW5nRmFjdG9yeS4kaW5qZWN0ID0gWyckR29vZ2xlQXBpJywgJyRodHRwJywgJyRxJ107XG5cbiAgYW5ndWxhci5tb2R1bGUoJ3Njb290ZXInKS5mYWN0b3J5KCdHZW9jb2RpbmdGYWN0b3J5JywgR2VvY29kaW5nRmFjdG9yeSk7XG5cbiAgZnVuY3Rpb24gR2VvY29kaW5nRmFjdG9yeSgkR29vZ2xlQXBpLCAkaHR0cCwgJHEpIHtcblxuICAgIHJldHVybiB7XG4gICAgICBnZXRMYXRMb25nOiBnZXRMYXRMb25nXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybiBhIGdlb2NvZGUgcHJvbWlzZVxuICAgICAqIEBwYXJhbSBhZGRyZXNzXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldExhdExvbmcoYWRkcmVzcykge1xuICAgICAgdmFyIGRlZmVyID0gJHEuZGVmZXIoKTtcblxuICAgICAgJGh0dHAoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICB1cmw6ICRHb29nbGVBcGkuZ2VvY29kZS5iYXNlVXJsICsgJz9hZGRyZXNzPScgKyBhZGRyZXNzLnJlcGxhY2UoL1xccy9nLCAnKycpICsgJyZrZXk9JyArICRHb29nbGVBcGkuZ2VvY29kZS5rZXlcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gc3VjY2Vzc0NhbGxiYWNrKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgIGRlZmVyLnJlc29sdmUocmVzcG9uc2UuZGF0YS5yZXN1bHRzWzBdLmdlb21ldHJ5LmxvY2F0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICAvLyByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHRzWzBdLmdlb21ldHJ5LmxvY2F0aW9uO1xuICAgICAgfSwgZnVuY3Rpb24gZXJyb3JDYWxsYmFjayhyZXNwb25zZSkge1xuICAgICAgICBkZWZlci5yZWplY3QocmVzcG9uc2UpO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBkZWZlci5wcm9taXNlO1xuICAgIH1cbiAgfVxufSkoKTsiLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBMb2dpbkNvbnRyb2xsZXIuJGluamVjdCA9IFsnJGxvZ2luJywgJ3N0b3JlJywgJyRzdGF0ZSddO1xuICBhbmd1bGFyLm1vZHVsZSgnc2Nvb3RlcicpLmNvbnRyb2xsZXIoJ0xvZ2luQ29udHJvbGxlcicsIExvZ2luQ29udHJvbGxlcik7XG5cbiAgZnVuY3Rpb24gTG9naW5Db250cm9sbGVyKCRsb2dpbiwgc3RvcmUsICRzdGF0ZSkge1xuICAgIHZhciBsb2dpbiA9IHRoaXM7XG5cbiAgICAvLyBmdW5jdGlvbiBkZWNsYXJhdGlvbnNcbiAgICBsb2dpbi5hdXRoZW50aWNhdGVVc2VyID0gYXV0aGVudGljYXRlVXNlcjtcbiAgICBsb2dpbi5jbG9zZUFsZXJ0ID0gY2xvc2VBbGVydDtcblxuICAgIGluaXQoKTtcblxuICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICBsb2dpbi5zaG93RXJyb3JNc2cgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhdXRoZW50aWNhdGVVc2VyKCkge1xuICAgICAgaWYgKGxvZ2luLnVzZXJuYW1lID09PSAkbG9naW4udXNlcm5hbWUgJiYgbG9naW4ucGFzc3dvcmQgPT09ICRsb2dpbi5wYXNzd29yZCkge1xuICAgICAgICBzdG9yZS5zZXQoJ2lzTG9nZ2VkSW4nLCB0cnVlKTtcbiAgICAgICAgJHN0YXRlLmdvKCdhcHAuZGFzaGJvYXJkJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2dpbi5zaG93RXJyb3JNc2cgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsb3NlQWxlcnQoKSB7XG4gICAgICBsb2dpbi5zaG93RXJyb3JNc2cgPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbG9naW47XG4gIH1cbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgTG9naW5Sb3V0ZS4kaW5qZWN0ID0gWyckc3RhdGVQcm92aWRlciddO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdzY29vdGVyJykuY29uZmlnKExvZ2luUm91dGUpO1xuXG4gIGZ1bmN0aW9uIExvZ2luUm91dGUoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnYXBwLmxvZ2luJywge1xuICAgICAgdXJsOiAnL2xvZ2luJyxcbiAgICAgIGFic3RyYWN0OiBmYWxzZSxcbiAgICAgIHRlbXBsYXRlVXJsOiAnL2Fzc2V0cy90ZW1wbGF0ZXMvbG9naW4vbG9naW4uaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnTG9naW5Db250cm9sbGVyIGFzIGxvZ2luJyxcbiAgICAgIG9uRW50ZXI6IFsnJHN0YXRlJywgJ3N0b3JlJywgZnVuY3Rpb24gKCRzdGF0ZSwgc3RvcmUpIHtcbiAgICAgICAgaWYgKHN0b3JlLmdldCgnaXNMb2dnZWRJbicpKSB7XG4gICAgICAgICAgJHN0YXRlLmdvKCdhcHAuZGFzaGJvYXJkJyk7XG4gICAgICAgIH1cbiAgICAgIH1dXG4gICAgfSk7XG4gIH1cbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgU3RvcmVPcHNGYWN0b3J5LiRpbmplY3QgPSBbJ3N0b3JlJ107XG5cbiAgYW5ndWxhci5tb2R1bGUoJ3Njb290ZXInKS5mYWN0b3J5KCdTdG9yZU9wc0ZhY3RvcnknLCBTdG9yZU9wc0ZhY3RvcnkpO1xuXG4gIGZ1bmN0aW9uIFN0b3JlT3BzRmFjdG9yeShzdG9yZSkge1xuXG4gICAgdmFyIHR1dG9ycyA9IFtdO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFkZE5ld1R1dG9yOiBhZGROZXdUdXRvcixcbiAgICAgIGdldEFsbFR1dG9yczogZ2V0QWxsVHV0b3JzXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFkZCB0aGUgbmV3IHR1dG9yIHRvIGxvY2FsIHN0b3JhZ2VcbiAgICAgKiBAcGFyYW0gdHV0b3JcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhZGROZXdUdXRvcih0dXRvcikge1xuICAgICAgaWYgKHN0b3JlLmdldCgndHV0b3JzJykpIHtcbiAgICAgICAgdHV0b3JzID0gc3RvcmUuZ2V0KCd0dXRvcnMnKTtcbiAgICAgICAgc3RvcmUucmVtb3ZlKCd0dXRvcnMnKTtcbiAgICAgICAgdHV0b3JzLnB1c2godHV0b3IpO1xuICAgICAgICBzdG9yZS5zZXQoJ3R1dG9ycycsIHR1dG9ycyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0dXRvcnMucHVzaCh0dXRvcik7XG4gICAgICAgIHN0b3JlLnNldCgndHV0b3JzJywgdHV0b3JzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRBbGxUdXRvcnMoKSB7XG4gICAgICByZXR1cm4gc3RvcmUuZ2V0KCd0dXRvcnMnKTtcbiAgICB9XG4gIH1cbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYXJyMnN0cmluZy4kaW5qZWN0ID0gW107XG4gIGFuZ3VsYXIubW9kdWxlKCdzY29vdGVyJykuZmlsdGVyKCdhcnIyc3RyaW5nJywgYXJyMnN0cmluZyk7XG5cbiAgZnVuY3Rpb24gYXJyMnN0cmluZygpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKTtcbiAgICB9O1xuICB9XG59KSgpOyJdfQ==
