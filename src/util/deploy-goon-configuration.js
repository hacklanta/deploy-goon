/**
 * Deploy Goon
 * ©2013 Matt Farmer – Licensed under Apache 2 License
 * See LICENSE in project root for more details.
**/

var DeployJob = require('./deploy-job'),
    fs = require('fs');

var DeployGoonConfiguration = (function() {
  var configuredProjects = {},
      configurationFilePaths = {},
      deploygoonConfigFile = "/etc/deploygoon.config";

  function loadConfigurationJsonFromFile(configurationFile) {
    return JSON.parse(fs.readFileSync(configurationFile, {encoding: 'utf8'}));
  }

  function DeployGoonConfiguration() {
    if (! fs.existsSync(deploygoonConfigFile))
      fs.writeFileSync(deploygoonConfigFile, "");

    var configurationFiles = fs.readFileSync(deploygoonConfigFile, {encoding: 'utf8'}).split("\n");

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

  DeployGoonConfiguration.prototype.getJobs = function() {
    return configuredProjects;
  }

  DeployGoonConfiguration.prototype.getJobFilePaths = function() {
    return configurationFilePaths;
  }

  DeployGoonConfiguration.prototype.addJob = function(filename) {
    filename = fs.realpathSync(filename);

    for (slug in configurationFilePaths) {
      if (configurationFilePaths[slug] == filename) {
        console.error("That file is already configured.");
        return;
      }
    }

    var configuration = loadConfigurationJsonFromFile(filename);

    if (configuredProjects[configuration.slug] !== undefined) {
      console.error("That configuration uses a slug that is in use by another project.");
      return;
    }

    configuredProjects[configuration.slug] = configuration;
    configurationFilePaths[configuration.slug] = filename;
  }

  DeployGoonConfiguration.prototype.removeJob = function(slug) {
    if (configuredProjects[slug] === undefined) {
      console.error("That project doesn't exist.");
      return;
    }

    delete configuredProjects[slug];
    delete configurationFilePaths[slug];
  }

  DeployGoonConfiguration.prototype.save = function() {
    var filenames = [];

    for (slug in configurationFilePaths) {
      filenames.push(configurationFilePaths[slug]);
    }

    var deployGoonConfigurationContents = filenames.join("\n");

    fs.writeFileSync(deploygoonConfigFile, deployGoonConfigurationContents);
  }

  return DeployGoonConfiguration;
})();

module.exports = DeployGoonConfiguration;
