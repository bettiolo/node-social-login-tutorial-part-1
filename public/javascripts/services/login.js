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

	this.authStatus = null;
	this.user = null;
	this.tokenInfo = null;
	this.init = function () {
		$timeout(function () {
			gapi.signin.render('signInButton', {
				callback : function (authResult) { $timeout(function () { onSignInCallback(authResult); });
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
		setStatus('logging_out');
		if (document.location.hostname == "localhost") {
			disconnectUser(gapi.auth.getToken().access_token);
		}
		gapi.auth.signOut();
	};

	function disconnectUser(access_token) {
		console.log('Disconnecting token', access_token);
		var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token=' + access_token;
		// Perform an asynchronous GET request.
		$http.jsonp(revokeUrl)
			.success(function (data, status, headers, config, statusText) {
				console.log('disconnectUser() Logged Out', data, status);
			})
			.error(function (data, status, headers, config, statusText) {
				console.log('disconnectUser() Error', data, status, statusText);
			});
	}

	function onSignInCallback(authResult) {
		console.log('onSignInCallback() status:', authResult);
		_this.authStatus = authResult;
		_this.user = null;
		_this.tokenInfo = null;
		if (authResult['status']['signed_in']) {
			if (_this.getStatus() !== 'logged_in') {
				setStatus('logged_in');
				getTokenInfo();
				getUser();
			}
		} else {
			// Possible error values:
			//   "user_signed_out" - User is signed-out
			//   "access_denied" - User denied access to your app
			//   "immediate_failed" - Could not automatically log in the user
			if (_this.getStatus() !== 'logged_out') {
				setStatus('logged_out');
			}
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

	function getTokenInfo() {
		$http.post('api/google/token-check', { access_token: _this.authStatus.access_token })
			.success(function (data, status, headers, config, statusText) {
				_this.tokenInfo = data;
				console.log('getTokenInfo() Success:', _this.tokenInfo);
			})
			.error(function (data, status, headers, config, statusText) {
				console.log('getTokenInfo() Error', data, status, statusText);
			});
	}

});
