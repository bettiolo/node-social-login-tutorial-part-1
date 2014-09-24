app.service('loginService', function () {
	console.log('loginService init');

	var _statusUpdatedCallback;
	this.data = { loginStatus : 'logging_in' };

	this.setStatusUpdatedCallback = function(statusUpdatedCallback) {
		_statusUpdatedCallback = statusUpdatedCallback;
		_statusUpdatedCallback();
	};

	this.setLoggedIn = function () {
		console.log('GoogleLogin logged in');
		this.setStatus('logged_in');
	};
	this.setLoggedOut = function () {
		this.setStatus('logged_out');
	};
	this.setLoggingIn = function () {
		this.setStatus('logging_in');
	};
	this.setLoggingOut = function () {
		this.setStatus('logging_out');
	};
	this.setStatus = function (status) {
		console.log('New Status: ' + status);
		if (status != this.data.loginStatus) {
			this.data.loginStatus = status;
			if (_statusUpdatedCallback) {
				_statusUpdatedCallback();
			}
		}
	};

	this.logout = function() {
		disconnectUser(gapi.auth.getToken().access_token);
		gapi.auth.signOut();
	};

	this.setLoggingIn();

	function disconnectUser(access_token) {
		var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token=' +
			access_token;

		console.log('disconnecting');
		// Perform an asynchronous GET request.
		$.ajax({
			type: 'GET',
			url: revokeUrl,
			async: false,
			contentType: "application/json",
			dataType: 'jsonp',
			success: function(nullResponse) {
				// Do something now that user is disconnected
				// The response is always undefined.
				console.log('disconnected');
			},
			error: function(e) {
				// Handle the error
				console.log(e);
				// You could point users to manually disconnect if unsuccessful
				// https://plus.google.com/apps
			}
		});
	}


	gapi.signin.render('signInButton',
		{
			'callback': onSignInCallback
		}
	);

	var _this = this;

	function onSignInCallback(authResult) {
		console.log('onSignInCallback() called, status:', authResult['status']);
		if (authResult['status']['signed_in']) {
			console.log(authResult);
			_this.setLoggedIn();
			// getProfile();
		} else {
			// Update the app to reflect a signed out user
			// Possible error values:
			//   "user_signed_out" - User is signed-out
			//   "access_denied" - User denied access to your app
			//   "immediate_failed" - Could not automatically log in the user
			console.log('Sign-in state: ' + authResult['error']);
			_this.setLoggedOut();
		}
	}

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
