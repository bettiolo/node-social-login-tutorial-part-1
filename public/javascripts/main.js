var app = angular.module('app', ['ngRoute']);
app.config(function(/* $routeProvider, $locationProvider */ ) {
//	$routeProvider
//		.when('/', {
//			templateUrl : 'pages/product-categories',
//			controller  : 'productCategoriesController'
//		})
//		.when('/list', {
//			templateUrl : 'pages/product-list',
//			controller  : 'productListContoller'
//		})
//		.when('/details/:code', {
//			templateUrl : 'pages/product-details',
//			controller  : 'productDetailsController'
//		});
//
//	$locationProvider.html5Mode(false);
//	$locationProvider.hashPrefix('!');
});

app.controller('navController', function ($scope, $location, $timeout, loginService) {
	$scope.loggedOff = true;
	$scope.isActive = function (viewLocation) {
		return viewLocation === $location.path();
	};
	$scope.login = function () {
		$scope.loggedOff = false;
		$scope.loggingIn = true;
		$timeout(function () {
			$scope.loggingIn = false;
			$scope.loggedIn = true;
			// $location.path('/list');
			loginService.login();
		}, 1000);
	};
	$scope.logout = function () {
		$scope.loggedIn = false;
		$scope.loggingIn = true;
		$timeout(function () {
			$scope.loggingIn = false;
			$scope.loggedOff = true;
			loginService.logout();
			// $location.path('/list');
		}, 1000);

	}
});
