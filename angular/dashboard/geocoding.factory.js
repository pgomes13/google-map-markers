(function () {
  'use strict';

  GeocodingFactory.$inject = ['$GoogleApi', '$http', '$q'];

  angular
    .module('scooter')
    .factory('GeocodingFactory', GeocodingFactory);

  function GeocodingFactory($GoogleApi, $http, $q) {

    return {
      getLatLong: getLatLong
    }

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