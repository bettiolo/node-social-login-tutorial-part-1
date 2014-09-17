app.controller('navController', function ($scope, $location, $timeout, loginService) {
	$scope.isBusy = function () {
		var status = loginService.getStatus();
		return status == 'logging_in'
			|| status == 'logging_out';
	};
	$scope.isLoggedIn = function () {
		return loginService.getStatus() == 'logged_in';
	};
//	$scope.login = function () {
//		$scope.loginStatus = 'logging_in';
//		$timeout(function () {
//			$scope.loginStatus = 'logged_in';
//			loginService.login();
//		}, 1000);
//	};
//	$scope.logout = function () {
//		$scope.loginStatus = 'logging_out';
//		$timeout(function () {
//			$scope.loginStatus = 'logged_out';
//			loginService.logout();
//		}, 1000);

});
