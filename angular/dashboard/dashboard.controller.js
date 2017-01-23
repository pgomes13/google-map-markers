(function () {
  'use strict';

  DashboardController.$inject = ['store', '$state', 'StoreOpsFactory', 'GeocodingFactory', '$q', '$timeout'];
  angular.module('scooter')
    .controller('DashboardController', DashboardController);


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
      $q.all([
        GeocodingFactory.getLatLong(dash.form.address)
      ]).then(function (responses) {
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
      var myLatLng = {lat: -25.363, lng: 131.044};

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

          google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
              infowindow.setContent(tutors[i].name + ' - ' + tutors[i].subjects.toString());
              infowindow.open(map, marker);
            }
          })(marker, i));
        }
      }
    }

    return dash;
  }


})();