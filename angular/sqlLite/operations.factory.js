(function () {
  'use strict';

  DbOpsFactory.$inject = ['$SQLite'];

  angular
    .module('scooter')
    .factory('DbOpsFactory', DbOpsFactory);

  function DbOpsFactory($SQLite) {

    return {
      addNewTutor: addNewTutor
    }

    function addNewTutor(tutor) {
      $SQLite.ready(function () {
       this.insert('tutor', tutor).then(onResult, onError, function (result) {
         console.log(result);
       });
      });
    }

  }


})();