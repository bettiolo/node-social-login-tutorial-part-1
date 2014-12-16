app.service('loginService', function ($rootScope, $timeout, $http) {
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
		if (document.location.hostname == "localhost") {
			disconnectUser(gapi.auth.getToken().access_token);
		}
		gapi.auth.signOut();
	};
	this.authStatus = null;
	this.user = null;

	function disconnectUser(access_token) {
		setStatus('logging_out');
		var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token=' + access_token;

		// Perform an asynchronous GET request.
		$http.jsonp(revokeUrl)
			.success(function (data, status, headers, config) {
				console.log('Logged Out', data, status, headers, config);
			})
			.error(function (data, status, headers, config) {
				console.log('Error logging out', data, status, headers, config);
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
