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
 * deployActions: An array of action descriptors to execute, where action descriptors are:
 *   An object containing the following:
 *     name: A human readable name.
 *     command: The command.
 *     arguments: Arguments to pass to the command.
 * notificationSettings:
 *   notify: [always|failure|off]
 *   email: An email address to notify with the deploy log.
**/
var DeployHelpers = require('./deploy-helpers');

var DeployJob = (function() {
  function DeployJob(configuration) {
    configuration = configuration || {}

    this.slug = configuration.slug;
    this.description = configuration.description;
    this.ipWhitelist = configuration.ipWhitelist;
    this.trustProxy = configuration.trustProxy;
    this.deployActions = configuration.deployActions;
    this.notifications = configuration.notifications || {};
    this.executing = false;

    if (typeof this.slug === 'undefined')
      throw "A slug is required to define a deploy job.";

    if (typeof this.deployActions === 'undefined' || this.deployActions.length == 0)
      throw "At least one deploy action is required to define a deploy job.";
  }

  DeployJob.prototype.getSlug = function() {
    return this.slug;
  }

  DeployJob.prototype.getDescription = function() {
    return this.description;
  }

  DeployJob.prototype.isIpWhitelisted = function(ipAddress, xForwardedForIp) {
    if (typeof this.ipWhitelist === 'undefined') {
      // Whitelisting disabled.
      return true;
    } else if (this.trustProxy && xForwardedForIp) {
      return this.ipWhitelist.indexOf(xForwardedForIp) !== -1;
    } else {
      return this.ipWhitelist.indexOf(ipAddress) !== -1;
    }
  }

  DeployJob.prototype.notify = function(success) {
    if (typeof this.notifications.notifier !== 'undefined') {
      var notifier = require("../notifiers/" + this.notifications.notifier + ".js");

      if (success && this.notifications.onSuccess)
        notifier.notifySuccess(this.notifications.settings, this.slug);

      if (! success)
        notifier.notifyFailure(this.notifications.settings, this.slug);
    }
  }

  DeployJob.prototype.executeDeployment = function(options) {
    if (this.executing) {
      console.warn("Deployment of " + slug + " is already in progress.");
      return;
    }

    this.executing = true;

    var deployCommandCount = this.deployActions.length,
        deployCommandCallback,
        deployJob = this,
        options = options || {},
        afterAll = options.afterAll || function() {},
        afterEach = options.afterEach || function() {};

    deployCommandCallback = function(deployCommandIndex) {
      return function(success) {
        afterEach(success, deployJob.deployActions[deployCommandIndex]);

        if (success && deployCommandIndex < deployCommandCount - 1) {
          DeployHelpers.executeCommand(
            deployJob.deployActions[deployCommandIndex + 1],
            deployCommandCallback(deployCommandIndex + 1),
            options
          );

          return;
        } else if (success) {
          if (! options.silenceOutput)
            console.log("Deployment of " + deployJob.slug + " is finished.");

          deployJob.notify(true);
          afterAll(true);
        } else {
          if (! options.silenceOutput)
            console.error("Deployment of " + deployJob.slug + " failed.");

          deployJob.notify(false);
          afterAll(false);
        }

        executing = false;
      };
    }

    DeployHelpers.executeCommand(this.deployActions[0], deployCommandCallback(0), options);
  }

  return DeployJob;
})();

module.exports = DeployJob;
