app.controller('navController', function ($scope, $location, loginService) {
	'use strict';
	$scope.login = loginService;
	$scope.getProfileImageUrl = function () {
		if ($scope.login && $scope.login.user) {
			return $scope.login.user.image.url;
		}
		return '';
	}
});
