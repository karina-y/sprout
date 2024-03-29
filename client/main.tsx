import { Meteor } from "meteor/meteor";
import React from "react";
import ReactDOM from "react-dom";
import App from "../imports/ui/App";
import * as serviceWorker from "./serviceWorker";

Meteor.startup(() => {
  ReactDOM.render(<App loading={true} />, document.getElementById("root"));

  /*Accounts.onEmailVerificationLink(function(token,done) {
    Accounts.verifyEmail(token, done);
  });*/
});

//TODO make register for prod
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
