/**
 * Deploy Goon
 * ©2013 Matt Farmer – Licensed under Apache 2 License
 * See LICENSE in project root for more details.
**/

/**
 * The Mandrill Notifier.
 *
 * Uses the Mandrill API package to send a really simple email regarding the status
 * of your deployment.
**/
module.exports = (function() {
  var Mandrill = require('mandrill-api').Mandrill;

  function sendEmail(settings, subject, messageContent) {
    var mandrillApi = new Mandrill(settings.apiKey);

    var result = mandrillApi.messages.send({
      message: {
        html: messageContent,
        subject: subject,
        from_email: settings.fromEmail,
        from_name: settings.fromName,
        to: [
          {
            email: settings.toEmail,
            name: settings.toName
          }
        ]
      }
    });
  }

  return {
    notifySuccess: function(settings, slug) {
      var subject = "Deployment of " + slug + " was successful.",
          message = "We successfully completed deployment of " + slug + ".";

      sendEmail(settings, subject, message);
    },

    notifyFailure: function(settings, slug) {
      var subject = "Deployment of " + slug + " was unsuccessful.",
          message = "We couldn't complete deployment of " + slug + ". Might be a good idea to log on and check the logs.";

      sendEmail(settings, subject, message);
    }
  }
})();
