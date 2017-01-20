(function () {
  'use strict';

  StoreOpsFactory.$inject = ['store'];

  angular
    .module('scooter')
    .factory('StoreOpsFactory', StoreOpsFactory);

  function StoreOpsFactory(store) {

    var tutors = [];

    return {
      addNewTutor: addNewTutor,
      getAllTutors: getAllTutors
    }

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