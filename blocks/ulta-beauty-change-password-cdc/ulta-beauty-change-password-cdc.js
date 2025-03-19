/* eslint-disable eqeqeq, no-alert, no-underscore-dangle, func-names, object-shorthand, no-console, no-undef, no-unused-vars, operator-linebreak, eol-last */
/* eslint-disable-next-line max-len */
/* global gigya */

function getAccountInfoResponse(response) {
  if (response.errorCode == 0) {
    const profile = response.profile;
    const msg = `${profile.firstName} is ${profile.age} years old`;
    alert(msg);
  } else {
    alert(`Error: ${response.errorMessage}`);
  }
}

function initializeGigya(container) {
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
          gigya.accounts.showScreenSet({
            screenSet: 'Default-LiteRegistration',
            containerID: container.id,
          });
        },
      });

      gigya.accounts.session.verify({
        callback: function (response) {
          if (response.errorCode == 0) {
            gigya.accounts.showScreenSet({
              screenSet: 'Default-ProfileUpdate',
              containerID: container.id,
            });
            console.log('gigya.accounts', gigya.accounts);
          } else {
            gigya.accounts.showScreenSet({
              screenSet: 'Default-RegistrationLogin',
              containerID: container.id,
            });
            console.log('gigya.accounts', gigya.accounts);
          }
        },
      });
    },
  };

  // Load Gigya script dynamically
  const gigyaScript = document.createElement('script');
  gigyaScript.src = 'https://cdns.gigya.com/js/gigya.js?apikey=4_VdOdUO1BkYX2CMMdGd8LhA';
  document.head.appendChild(gigyaScript);
}

export default async function decorate(block) {
  console.log('block', block);
  block.innerHTML = '';

  // Crea un nuevo div con el ID deseado
  const container = document.createElement('div');
  container.id = 'ulta-beauty-change-password-cdc-container';
  block.appendChild(container);
  initializeGigya(container);
}
