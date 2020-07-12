import { Meteor } from 'meteor/meteor';
import colors from 'colors';
import './api';
import logger from '../imports/utils/logger'
import handleMethodException from '../imports/utils/handle-method-exception'
import './monti'

Meteor.startup(() => {
  colors.enable();

  Accounts.validateLoginAttempt(function(options) {
    /* options:
        type            (String)    The service name, such as "password" or "twitter".
        allowed         (Boolean)   Whether this login is allowed and will be successful.
        error           (Error)     When allowed is false, the exception describing why the login failed.
        user            (Object)    When it is known which user was attempting to login, the Meteor user object.
        connection      (Object)    The connection object the request came in on.
        methodName      (String)    The name of the Meteor method being used to login.
        methodArguments (Array)     An array of the arguments passed to the login method
    */

    // logger('info', "options in validate", options)

    // If the login has failed, just return false.
    if (!options.allowed) {
      return false;
    }

    // Check the user's email is verified. If users may have multiple
    // email addresses (or no email address) you'd need to do something
    // more complex.
    if (options.user.emails[0].verified === true) {
      return true;
    } else {
      handleMethodException('You must verify your email address before you can log in')
      // throw new Meteor.Error('You must verify your email address before you can log in');
    }

  });

  Accounts.emailTemplates.siteName = 'http://sprout.karinacodes.com';
  Accounts.emailTemplates.from = Meteor.settings.private.awsSmtp.mail_from;

  /*Accounts.emailTemplates.enrollAccount.subject = (user) => {
    return `Welcome to sprout, ${user.profile.name}`;
  };

  Accounts.emailTemplates.enrollAccount.text = (user, url) => {
    return 'You have been selected to participate in building a better future!'
            + ' To activate your account, simply click the link below:\n\n'
            + url;
  };

  Accounts.emailTemplates.resetPassword.from = () => {
    // Overrides the value set in `Accounts.emailTemplates.from` when resetting
    // passwords.
    return 'sprout <karinayeznaian@gmail.com>';
  };*/

  Accounts.emailTemplates.verifyEmail = {
    subject() {
      return "Activate your sprout account now!";
    },
    text(user, url) {
      return `Hi ${user.profile.name}, welcome to sprout! Verify your e-mail by following this link: ${url}`;
    }
  };

  //MAIL_URL=smtp://AKIA3E3PBV2OGGYRXQ6D:BDIEBIbFYZ6WnwYvqptpp8rzzoB/6+fKf5FZJIJ0B3Gi@email-smtp.us-west-2.amazonaws.com:465

  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(Meteor.settings.private.awsSmtp.mail_username) + ':' + encodeURIComponent(Meteor.settings.private.awsSmtp.mail_password) + '@' + encodeURIComponent(Meteor.settings.private.awsSmtp.mail_server) + ':' + Meteor.settings.private.awsSmtp.mail_port;

  // process.env.MOBILE_DDP_URL = 'http://1.1.1.1:3000 1';
  // process.env.MOBILE_ROOT_URL = 'http://1.1.1.1:3000 1';
});
