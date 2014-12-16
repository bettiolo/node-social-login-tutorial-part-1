app.controller('mainController', function ($scope, $location, loginService) {
	$scope.login = loginService;
	loginService.init();
});
