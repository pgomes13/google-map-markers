(function () {
  'use strict';

  appReady.$inject = ['$state', '$SQLite', 'DB_CONFIG'];

  angular
    .module('scooter')
    .run(appReady);

  function appReady ($state, $SQLite) {
    $state.go('app.login');

    $SQLite.dbConfig({
      name: 'scooter-tutor',
      description: 'DB to store new tutors',
      version: '1.0'
    });

    $SQLite.init(function (init) {
      angular.forEach(DB_CONFIG, function (config, name) {
        init.step();
        $SQLite.createTable(name, config).then(init.done);
      });
      init.finish();
    });
  }
})();