(function () {
  'use strict';

  angular
    .module('scooter')
    .constant('$login', {
      username: 'scooter',
      password: 'tutor'
    })
    .constant('DB_CONFIG', {
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
    })
})();