/**
 * Deploy Goon
 * ©2013 Matt Farmer – Licensed under Apache 2 License
 * See LICENSE in project root for more details.
**/
var spawn = require('child_process').spawn;

var DeployHelpers = {
  executeCommand: function(actionDescriptor, callback) {
    var scriptHandle = spawn(actionDescriptor.command, actionDescriptor.arguments, {env: process.env});

    scriptHandle.stdout.on('data', function(data) {
      process.stdout.write(data);
    });

    scriptHandle.stderr.on('data', function(data) {
      process.stderr.write(data);
    });

    scriptHandle.on('error', function(error) {
      console.log(error);
    });

    scriptHandle.on('close', function(code) {
      if (code !== 0) {
        console.log(actionDescriptor.name + " was unsuccessful. Aborting.");

        if (typeof callback != 'undefined') callback(false);
      } else {
        console.log(actionDescriptor.name + " complete.");

        if (typeof callback != 'undefined') callback(true);
      }
    });
  }
}

module.exports = DeployHelpers;
