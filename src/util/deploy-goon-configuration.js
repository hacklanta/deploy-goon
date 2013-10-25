/**
 * Deploy Goon
 * ©2013 Matt Farmer – Licensed under Apache 2 License
 * See LICENSE in project root for more details.
**/

var DeployJob = require('./deploy-job'),
    fs = require('fs');

var DeployGoonConfiguration = (function() {
  var configuredProjects = {},
      configurationFiles = [];

  function DeployGoonConfiguration() {
    if (! fs.existsSync("deploygoonfiles.config"))
      fs.writeFileSync("deploygoonfiles.config", "");

    configurationFiles = fs.readFileSync("deploygoonfiles.config", {encoding: 'utf8'}).split("\n");

    configurationFiles.forEach(function(configurationFile) {
      if (configurationFile == "")
        return;

      var configurationJson = JSON.parse(fs.readFileSync(configurationFile, {encoding: 'utf8'}));

      configuredProjects[configurationJson.slug] = new DeployJob(configurationJson);
    });
  }

  DeployGoonConfiguration.prototype.getJob = function(slug) {
    return configuredProjects[slug];
  }

  return DeployGoonConfiguration;
})();

module.exports = DeployGoonConfiguration;
