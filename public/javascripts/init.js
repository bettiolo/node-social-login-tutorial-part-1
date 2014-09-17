var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl : 'templates/index',
			controller  : 'mainController'
		})
		.otherwise({ redirectTo: '/' });
	$locationProvider.html5Mode(true);
});
