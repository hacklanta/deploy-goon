/**
 * Deploy Goon
 * ©2013 Matt Farmer – Licensed under Apache 2 License
 * See LICENSE in project root for more details.
**/

var DeployJob = require('./deploy-job');

var DeployGoonConfiguration = (function() {
  var configuredProjects = {};

  function DeployGoonConfiguration() {
    // TODO: Determine where all the deploygoon.json files are located
    // on the file system, read them into the DeployJob constructor, then
    // associate them to their slug in configured projects.

    configuredProjects["bacon"] = new DeployJob({
      slug: "bacon",
      ipWhitelist: ["127.0.0.1"],
      deployActions: [
        "echo ohaithar",
        "echo can i haz bacon",
        "echo mmkay"
      ],
      notifictionSettings: {
        notify: "always",
        email: "matt@sauce.com"
      }
    });
  }

  DeployGoonConfiguration.prototype.getJob = function(slug) {
    return configuredProjects[slug];
  }

  return DeployGoonConfiguration;
})();

module.exports = DeployGoonConfiguration;
