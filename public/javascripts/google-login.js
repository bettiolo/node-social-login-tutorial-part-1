(function() {
    window.___gcfg = {
        parsetags: 'explicit'
    };
    var po = document.createElement('script');
    po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/client:plusone.js?onload=render';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(po, s);
})();

/* Executed when the APIs finish loading */
function render() {
  console.log('render() called');
  gapi.auth.signIn({ 'callback': onSignInCallback });

  var signinButton = document.getElementById('signinButton');
  signinButton.addEventListener('click', function() {
    gapi.auth.signIn({
      'callback': onSignInCallback
    });
  });

}

function renderLoginButton() {
    "use strict";
    gapi.signin.render("gConnect", {
        'callback': onSignInCallback,
        'cookiepolicy': 'single_host_origin',
        'requestvisibleactions': 'http://schema.org/AddAction',
        'scope': 'https://www.googleapis.com/auth/plus.profile.emails.read',
        'width': 'wide'
    });
}

function onSignInCallback(authResult) {
    console.log('onSignInCallback() called, status: ');
    console.log(authResult['status']);
    if (authResult['status']['signed_in']) {
        // Update the app to reflect a signed in user
        // Hide the sign-in button now that the user is authorized, for example:
        document.getElementById('gConnect').setAttribute('style', 'display: none');
        console.log(authResult);
        getProfile();
    } else {
        // Update the app to reflect a signed out user
        // Possible error values:
        //   "user_signed_out" - User is signed-out
        //   "access_denied" - User denied access to your app
        //   "immediate_failed" - Could not automatically log in the user
        console.log('Sign-in state: ' + authResult['error']);
        renderLoginButton();
    }
    //  // Will use page level configuration
}

function getProfile() {
    "use strict";
    gapi.client.load('plus','v1', function(){
        var request = gapi.client.plus.people.get({
            'userId': 'me'
        });
        request.execute(function(resp) {
            console.log('Retrieved profile for:' + resp.displayName);
            console.log(resp);

            var primaryEmail;
            for (var i=0; i < resp.emails.length; i++) {
                if (resp.emails[i].type === 'account') primaryEmail = resp.emails[i].value;
            }
            console.log('Primary email: ' + primaryEmail);
            document.getElementById('loginData').innerHTML =
              'Primary email: ' + primaryEmail + '\n';

            document.getElementById('loginData').innerHTML +=
              'User ID: ' + resp.id + '\n';

            document.getElementById('loginData').innerHTML +=
              'Domain: ' + resp.domain + '\n';

//            document.getElementById('loginData').innerHTML +=
//              'Customer ID: ' + resp.customerId + '\n';

            if (resp.organizations) {
              var organisation;
              for (var i=0; i < resp.organizations.length; i++) {
                if (resp.organizations[i].type === 'work') organisation = resp.organizations[i].name;
              }
              console.log('Organisation: ' + organisation);
              document.getElementById('loginData').innerHTML +=
                'Organisation: ' + organisation + '\n';
            }
        });
    });

}
