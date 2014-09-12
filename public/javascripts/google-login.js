(function () {
	var po = document.createElement('script');
	po.type = 'text/javascript';
	po.async = true;
	po.src = 'https://apis.google.com/js/client:plusone.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(po, s);
})();

function onSignInCallback(authResult) {
	console.log('onSignInCallback() called, status: ');
	console.log(authResult['status']);
	if (authResult['status']['signed_in']) {
		console.log(authResult);
		hideLogin();
		getProfile();
	} else {
		// Update the app to reflect a signed out user
		// Possible error values:
		//   "user_signed_out" - User is signed-out
		//   "access_denied" - User denied access to your app
		//   "immediate_failed" - Could not automatically log in the user
		console.log('Sign-in state: ' + authResult['error']);
		showLogin();
	}
}

function hideLogin() {
	document.getElementById('login').setAttribute('style', 'display: none');
}

function showLogin() {
	document.getElementById('login').setAttribute('style', 'display: initial');
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
