var googleLogin = function () {

	function GoogleLogin() {
		console.log('GoogleLogin init');
		this.setStatus('logging_in');
	}
	GoogleLogin.prototype.setLoggedIn = function () {
		console.log('GoogleLogin logged in');
		this.setStatus('logged_in');
	};
	GoogleLogin.prototype.setLoggedOut = function () {
		this.setStatus('logged_out');
	};
	GoogleLogin.prototype.setLoggingIn = function () {
		this.setStatus('logging_in');
	};
	GoogleLogin.prototype.setLoggingOut = function () {
		this.setStatus('logging_out');
	};
	GoogleLogin.prototype.getStatus = function () {
		return this.loginStatus;
	};
	GoogleLogin.prototype.setStatus = function (status) {
		if (status != this.loginStatus) {
			this.loginStatus = status;
			if (this.statusUpdatedCallback) {
				this.statusUpdatedCallback();
			}
		}
	};
	GoogleLogin.prototype.setStatusUpdateCallback = function (statusUpdateCallback) {
		this.statusUpdatedCallback = statusUpdateCallback;
	};

	return new GoogleLogin();
}();

app.service('loginService', function () {
	console.log('login service init');
	googleLogin.setStatusUpdateCallback(function () {
		this.loginStatus = googleLogin.getStatus();
	});
});

function onSignInCallback(authResult) {
	console.log('onSignInCallback() called, status: ');
	console.log(authResult['status']);
	if (authResult['status']['signed_in']) {
		console.log(authResult);
		googleLogin.setLoggedIn();
		// getProfile();
	} else {
		// Update the app to reflect a signed out user
		// Possible error values:
		//   "user_signed_out" - User is signed-out
		//   "access_denied" - User denied access to your app
		//   "immediate_failed" - Could not automatically log in the user
		console.log('Sign-in state: ' + authResult['error']);
		googleLogin.setLoggedOut();
	}
}

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
