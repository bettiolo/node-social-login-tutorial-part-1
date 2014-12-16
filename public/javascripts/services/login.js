app.service('loginService', function ($rootScope, $timeout) {
	'use strict';
	var _loginStatus = '';
	var _this = this;

	function setStatus(status) {
		console.log('LoginService status: ' + status);
		if (status != _loginStatus) {
			_loginStatus = status;
		}
	}
	setStatus('logging_in');

	this.init = function () {
		$timeout(function () {
			gapi.signin.render('signInButton', {
				callback : function (authResult) { $rootScope.$apply(function () { onSignInCallback(authResult); });
			}});
		});
	};
	this.getStatus = function () {
		return _loginStatus;
	};
	this.isBusy = function () {
		return this.getStatus() === 'logging_in'
			|| this.getStatus() === 'logging_out';
	};
	this.isLoggedIn = function () {
		return this.getStatus() === 'logged_in';
	};
	this.logout = function() {
		disconnectUser(gapi.auth.getToken().access_token);
		gapi.auth.signOut();
	};
	this.authStatus = null;
	this.user = null;

	function disconnectUser(access_token) {
		setStatus('logging_out');
		var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token=' + access_token;

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

	function onSignInCallback(authResult) {
		console.log('onSignInCallback() status:', authResult['status']);
		_this.authStatus = authResult;
			if (authResult['status']['signed_in']) {
				if (_this.getStatus() !== 'logged_in') {
					setStatus('logged_in');
					getUser();
				}
			} else {
				// Possible error values:
				//   "user_signed_out" - User is signed-out
				//   "access_denied" - User denied access to your app
				//   "immediate_failed" - Could not automatically log in the user
				console.log('Sign-in state:', authResult['error']);
				setStatus('logged_out');
			}
	}

	function getUser() {
		gapi.client.load('plus', 'v1', function () {
			var request = gapi.client.plus.people.get({
				'userId': 'me'
			});
			request.execute(function (resp) {
				$rootScope.$apply(function () {
					console.log('getUser() :', resp);
					_this.user = resp;
				});
			});
		});
	}

});
