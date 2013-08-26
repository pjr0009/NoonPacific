'use strict';

function jsonp_callback(data) {
    // returning from async callbacks is (generally) meaningless
    console.log(data.found);
}


// Declare app level module which depends on filters, and services
var NoonPacific= angular.module('NoonPacific', ['NoonPacific.filters', 'NoonPacific.services', 'NoonPacific.directives','ajoslin.mobile-navigate','ngMobile'])
    .config(function ($compileProvider){
        $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    })
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {templateUrl: 'partials/homeView.html'});
        $routeProvider.when('/mixes', {templateUrl: 'partials/mixes.html'});
        $routeProvider.when('/menu', {templateUrl: 'partials/menu.html'});
        $routeProvider.otherwise({redirectTo: '/'});
  }]);

NoonPacific.filter('oneAtATime', function() {
    return function(input, start) {
      start = +start;
      return input.slice(start, start + 1);
    };
});
