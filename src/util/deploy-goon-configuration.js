/**
 * Deploy Goon
 * ©2013 Matt Farmer – Licensed under Apache 2 License
 * See LICENSE in project root for more details.
**/

var DeployJob = require('./deploy-job'),
    fs = require('fs');

var DeployGoonConfiguration = (function() {
  var configuredProjects = {},
      configurationFilePaths = {};

  function loadConfigurationJsonFromFile(configurationFile) {
    return JSON.parse(fs.readFileSync(configurationFile, {encoding: 'utf8'}));
  }

  function DeployGoonConfiguration() {
    if (! fs.existsSync("deploygoonfiles.config"))
      fs.writeFileSync("deploygoonfiles.config", "");

    var configurationFiles = fs.readFileSync("deploygoonfiles.config", {encoding: 'utf8'}).split("\n");

    configurationFiles.forEach(function(configurationFile) {
      if (configurationFile == "")
        return;

      var configurationJson = loadConfigurationJsonFromFile(configurationFile);

      configuredProjects[configurationJson.slug] = new DeployJob(configurationJson);
      configurationFilePaths[configurationJson.slug] = configurationFile;
    });
  }

  DeployGoonConfiguration.prototype.getJob = function(slug) {
    return configuredProjects[slug];
  }

  function configurationUpdateHandler(slug, filePath) {
    return function() {
      console.log("Reloading configuration for " + slug);

      var updatedConfiguration = loadConfigurationJsonFromFile(filePath);

      configuredProjects[updatedConfiguration.slug] = new DeployJob(updatedConfiguration);

      if (updatedConfiguration.slug != slug) {
        console.log("Name for " + projectSlug + " has changed to " + updatedConfiguration.slug);

        delete configuredProjects[slug];
        delete configurationFilePaths[slug];

        configurationFilePaths[updatedConfiguration.slug] = filePath;

        fs.unwatchFile(filePath);
        fs.watchFile(filePath, configurationUpdateHandler(updatedConfiguration.slug, filePath));
      }

      console.log("Configuration updated.");
    }
  }

  DeployGoonConfiguration.prototype.watchConfiguration = function() {
    for (projectSlug in configurationFilePaths) {
      var configurationFilePath = configurationFilePaths[projectSlug];
      fs.watchFile(configurationFilePath, configurationUpdateHandler(projectSlug, configurationFilePath));
    }
  }

  return DeployGoonConfiguration;
})();

module.exports = DeployGoonConfiguration;
