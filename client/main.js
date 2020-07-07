import { Meteor } from 'meteor/meteor'
import React from 'react';
import ReactDOM from 'react-dom';
import App from '../imports/ui/App';
import * as serviceWorker from './serviceWorker';
import { toast } from 'react-toastify'

Meteor.startup(() => {
  ReactDOM.render(<App />, document.getElementById('root'));

  /*Accounts.onEmailVerificationLink(function(token,done) {
    Accounts.verifyEmail(token, done);
  });*/

});


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
