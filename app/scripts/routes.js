'use strict';

angular.module('elasticSearchAngularApp.routes', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {templateUrl: 'views/main.html', controller: 'MainCtrl'});
        $routeProvider.when('/import', {templateUrl: 'views/import.html', controller: 'AboutCtrl'});
        $routeProvider.when('/importrfp', {templateUrl: 'views/importrfp.html', controller: 'AboutCtrl'});
        $routeProvider.when('/importrfp/:id', {templateUrl: 'views/importrfp.html', controller: 'AboutCtrl'});
          $routeProvider.when('/uncompleterfp', {templateUrl: 'views/uncompleterfp.html', controller: 'UncompleteCtrl'});
        $routeProvider.otherwise({redirectTo: '/'});
    }]);
