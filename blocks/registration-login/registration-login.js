/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
import { SignUp } from '@dropins/storefront-auth/containers/SignUp.js';
import { render as authRenderer } from '@dropins/storefront-auth/render.js';
import { checkIsAuthenticated } from '../../scripts/configs.js';
import { CUSTOMER_ACCOUNT_PATH, CUSTOMER_LOGIN_PATH } from '../../scripts/constants.js';

// Initialize
import '../../scripts/initializers/auth.js';

function getAccountInfoResponse(response) {
  if (response.errorCode == 0) {
    var profile = response['profile'];
    var msg = profile['firstName'] + ' is ' + profile['age'] + ' years old';
    alert(msg);
  } else {
    alert('Error :' + response.errorMessage);
  }
}

function initializeGigya() {
  window.__gigyaConf = {
    onGigyaServiceReady: function () {
      gigya.accounts.addEventHandlers({
        onLogin: function (r) {
          // User is logged in
          console.log('User is logged in');
          console.log(r);
          gigya.accounts.getAccountInfo({ callback: getAccountInfoResponse });
        },
        onLogout: function (r) {
          // User is logged out
          console.log('User is logged out');
          console.log(r);
          gigya.accounts.showScreenSet({ screenSet: 'Default-RegistrationLogin' });
        }
      });
      gigya.accounts.session.verify({
        callback: function (response) {
          if (response.errorCode == 0) {
            gigya.accounts.showScreenSet({ screenSet: 'Default-ProfileUpdate' });
            console.log('gigya.accounts', gigya.accounts);
          } else {
            gigya.accounts.showScreenSet({ screenSet: 'Default-RegistrationLogin' });
            console.log('gigya.accounts', gigya.accounts);
          }
        }
      });
    }
  };

  // Load Gigya script dynamically
  const gigyaScript = document.createElement('script');
  gigyaScript.src = 'https://cdns.gigya.com/js/gigya.js?apikey=4_VdOdUO1BkYX2CMMdGd8LhA';
  document.head.appendChild(gigyaScript);
}

export default async function decorate(block) {
  // Initialize Gigya
  initializeGigya();
}