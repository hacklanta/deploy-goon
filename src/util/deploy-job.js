/**
 * Deploy Goon
 * ©2013 Matt Farmer – Licensed under Apache 2 License
 * See LICENSE in project root for more details.
**/

/**
 * DeployJobs describe a deployment job that the Deploy Goon is responsible for.
 *
 * To create a deploy job, you pass in some configuration that is usually retrieved
 * from a deploygoon.json file. That configuration takes the following parameters.
 *
 * slug: The slug name of the project.
 * ipWhitelist: An array of valid IPs that can request against this slug.
 * deployActions: An array of commands to execute during deployment.
 * notificationSettings:
 *   notify: [always|failure|off]
 *   email: An email address to notify with the deploy log.
**/
var DeployHelpers = require('./deploy-helpers');

var DeployJob = (function() {
  var slug, ipWhitelist, deployActions, notificationSettings;

  function DeployJob(configuration) {
    configuration = configuration || {}

    slug = configuration.slug
    ipWhitelist = configuration.ipWhitelist
    deployActions = configuration.deployActions
    notificationSettings = configuration.notificationSettings || {}
  }

  DeployJob.prototype.getSlug = function() {
    return slug;
  }

  DeployJob.prototype.isIpWhitelisted = function(ipAddress) {
    ipWhitelist.indexOf(ipAddress) !== -1;
  }

  DeployJob.prototype.executeDeployment = function() {
    var deployCommandCount = deployActions.length,
        deployCommandCallback;

    deployCommandCallback = function(deployCommandIndex) {
      return function(success) {
        if (success && deployCommandIndex < deployCommandCount - 1) {
          DeployHelpers.executeCommand(
            deployActions[deployCommandIndex + 1],
            deploycommandCallback(deploycommandIndex + 1)
          );
        } else if (success) {
          console.log("Deployment of " + slug + " is finished.");
        } else {
          console.error("Deployment of " + slug + " failed.");
        }
      };
    }

    DeployHelpers.executeCommand(deployActions[0], deployCommandCallback(0));
  }

  return DeployJob;
})();

module.exports = DeployJob;
