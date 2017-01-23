(function() {
  'use strict';

  arr2string.$inject = [];
  angular
    .module('scooter')
    .filter('arr2string', arr2string);

  function arr2string() {
    return function(value) {
      return value.toString();
    };
  }

})();
