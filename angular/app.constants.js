(function () {
  'use strict';

  angular
    .module('scooter')
    .constant('$login', {
      username: 'scooter',
      password: 'tutor'
    })
    .constant('$GoogleApi', {
      geocode: {
        baseUrl: 'https://maps.googleapis.com/maps/api/geocode/json',
        key: 'AIzaSyBNqAX8VtxXJHyad_BGAdRGNx1Jnj2vy8U'
      }
    })
})();