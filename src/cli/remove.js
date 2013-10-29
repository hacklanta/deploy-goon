/**
 * Deploy Goon
 * ©2013 Matt Farmer – Licensed under Apache 2 License
 * See LICENSE in project root for more details.
**/
module.exports = function(arguments) {
  var slugToRemove = arguments[0],
      DeployGoonConfiguration = require("../util/deploy-goon-configuration"),
      configuration = new DeployGoonConfiguration();

  if (slugToRemove === undefined) {
    console.error("Please provide the slug for the project you would like to remove.");
    return;
  }

  configuration.removeJob(slugToRemove);
  configuration.save();
}
