/**
 * Deploy Goon
 * ©2013 Matt Farmer – Licensed under Apache 2 License
 * See LICENSE in project root for more details.
 *
 * Deploy Goon Main.
**/
var http = require('http'),
    url = require('url'),
    spawn = require('child_process').spawn,
    fs = require('fs');

var DeployHelpers = {
  executeCommand: function(scriptCommand, callback) {
    var scriptHandle = spawn(scriptCommand);

    scriptHandle.stdout.on('data', function(data) {
      process.stdout.write(data);
    });

    scriptHandle.stderr.on('data', function(data) {
      process.stderr.write(data);
    });

    scriptHandle.on('close', function(code) {
      if (code !== 0) {
        console.log(scriptCommand + " was unsuccessful. Aborting.");

        if (typeof callback != 'undefined') callback(false);
      } else {
        console.log(scriptCommand + " complete.");

        if (typeof callback != 'undefined') callback(true);
      }
    });
  }
}

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

    DeployHelpers.executeCommand(deployActions[0], deploycommandCallback(0));
  }

  return DeployJob;
})();

http.createServer(function(req, res) {
  if (url.parse(req.url).pathname == "/bacon") {
    res.writeHead(200);
    res.end();
  } else {
    res.writeHead(404);
    res.end();
  }
}).listen(9090, '127.0.0.1');

console.log("The Deploy Goon is up on 9090.");
