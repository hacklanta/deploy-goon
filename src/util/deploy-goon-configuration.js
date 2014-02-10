/**
 * Deploy Goon
 * ©2013 Matt Farmer – Licensed under Apache 2 License
 * See LICENSE in project root for more details.
**/

var DeployJob = require('./deploy-job'),
    fs = require('fs');

var DeployGoonConfiguration = (function() {
  var deploygoonConfigFile = "/etc/deploygoon.config";

  function loadConfigurationJsonFromFile(configurationFile) {
    return JSON.parse(fs.readFileSync(configurationFile, {encoding: 'utf8'}));
  }

  function DeployGoonConfiguration(options) {
    var options = options || {},
        configurationFiles,
        configuredProjects = {},
        configurationFilePaths = {};

    if (! options.configurationFiles && ! fs.existsSync(deploygoonConfigFile))
      fs.writeFileSync(deploygoonConfigFile, "");

    if (! options.configurationFiles)
      configurationFiles = fs.readFileSync(deploygoonConfigFile, {encoding: 'utf8'}).split("\n");
    else
      configurationFiles = options.configurationFiles;

    configurationFiles.forEach(function(configurationFile) {
      if (configurationFile == "")
        return;

      try {
        var configurationJson = loadConfigurationJsonFromFile(configurationFile);

        configuredProjects[configurationJson.slug] = new DeployJob(configurationJson);
        configurationFilePaths[configurationJson.slug] = configurationFile;
      } catch (error) {
        console.error("Error loading configuration from " + configurationFile);
        console.error(error);
      }
    });

    this.configuredProjects = configuredProjects;
    this.configurationFilePaths = configurationFilePaths;
  }

  DeployGoonConfiguration.prototype.getJob = function(slug) {
    return this.configuredProjects[slug];
  }

  DeployGoonConfiguration.prototype.configurationUpdateHandler = function(slug, filePath) {
    return (function() {
      console.log("Reloading configuration for " + slug);

      var updatedConfiguration = loadConfigurationJsonFromFile(filePath);

      this.configuredProjects[updatedConfiguration.slug] = new DeployJob(updatedConfiguration);

      if (updatedConfiguration.slug != slug) {
        console.log("Name for " + projectSlug + " has changed to " + updatedConfiguration.slug);

        delete this.configuredProjects[slug];
        delete this.configurationFilePaths[slug];

        this.configurationFilePaths[updatedConfiguration.slug] = filePath;

        fs.unwatchFile(filePath);
        fs.watchFile(filePath, this.configurationUpdateHandler(updatedConfiguration.slug, filePath));
      }

      console.log("Configuration updated.");
    }).bind(this);
  }

  DeployGoonConfiguration.prototype.watchConfiguration = function() {
    for (projectSlug in this.configurationFilePaths) {
      var configurationFilePath = this.configurationFilePaths[projectSlug];
      fs.watchFile(configurationFilePath, this.configurationUpdateHandler(projectSlug, configurationFilePath));
    }
  }

  DeployGoonConfiguration.prototype.getJobs = function() {
    return this.configuredProjects;
  }

  DeployGoonConfiguration.prototype.getJobFilePaths = function() {
    return this.configurationFilePaths;
  }

  DeployGoonConfiguration.prototype.addJob = function(filename) {
    filename = fs.realpathSync(filename);

    for (slug in this.configurationFilePaths) {
      if (this.configurationFilePaths[slug] == filename) {
        console.error("That file is already configured.");
        return;
      }
    }

    var configuration = loadConfigurationJsonFromFile(filename);

    if (this.configuredProjects[configuration.slug] !== undefined) {
      console.error("That configuration uses a slug that is in use by another project.");
      return;
    }

    this.configuredProjects[configuration.slug] = configuration;
    this.configurationFilePaths[configuration.slug] = filename;
  }

  DeployGoonConfiguration.prototype.removeJob = function(slug) {
    if (this.configuredProjects[slug] === undefined) {
      console.error("That project doesn't exist.");
      return;
    }

    delete this.configuredProjects[slug];
    delete this.configurationFilePaths[slug];
  }

  DeployGoonConfiguration.prototype.save = function() {
    var filenames = [];

    for (slug in this.configurationFilePaths) {
      filenames.push(this.configurationFilePaths[slug]);
    }

    var deployGoonConfigurationContents = filenames.join("\n");

    fs.writeFileSync(deploygoonConfigFile, deployGoonConfigurationContents);
  }

  return DeployGoonConfiguration;
})();

module.exports = DeployGoonConfiguration;
