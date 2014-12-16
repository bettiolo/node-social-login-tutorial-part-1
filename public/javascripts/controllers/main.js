app.controller('mainController', function ($scope, $location, loginService) {
	$scope.login = loginService;
	loginService.init();
});

function getProfile() {
	"use strict";
	gapi.client.load('plus', 'v1', function () {
		var request = gapi.client.plus.people.get({
			'userId': 'me'
		});
		request.execute(function (resp) {
			console.log(resp);

			document.getElementById('loginData').innerHTML +=
				'Display name: ' + resp.displayName + '\n';

			document.getElementById('profileImage').setAttribute('src', resp.image.url);

			var primaryEmail;
			for (var i = 0; i < resp.emails.length; i++) {
				if (resp.emails[i].type === 'account') primaryEmail = resp.emails[i].value;
			}
			document.getElementById('loginData').innerHTML +=
				'Primary email: ' + primaryEmail + '\n';

			document.getElementById('loginData').innerHTML +=
				'User ID: ' + resp.id + '\n';

			document.getElementById('loginData').innerHTML +=
				'Domain: ' + resp.domain + '\n';

			if (resp.organizations) {
				var organisation;
				for (var i = 0; i < resp.organizations.length; i++) {
					if (resp.organizations[i].type === 'work') organisation = resp.organizations[i].name;
				}
				document.getElementById('loginData').innerHTML +=
					'Organisation: ' + organisation + '\n';
			}
		});
	});
}
