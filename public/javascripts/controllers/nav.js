app.controller('navController', function ($scope, $location, $timeout, loginService) {
	$scope.$watch('loginService.data.loginStatus', function (newValue) {
		console.log('navController watch', newValue);
	});
	loginService.setStatusUpdatedCallback(function () {
		console.log('navController: ' + loginService.data.loginStatus);
		var loginStatus = loginService.data.loginStatus;
		$scope.isBusy = function () {
			return loginStatus == 'logging_in' || loginStatus == 'logging_out';
		};
		$scope.isLoggedIn = function() {
			return loginStatus == 'logged_in';
		}
	});
	$scope.logout = function () {
		loginService.logout();
	};
});
