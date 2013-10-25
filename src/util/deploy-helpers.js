/**
 * Deploy Goon
 * ©2013 Matt Farmer – Licensed under Apache 2 License
 * See LICENSE in project root for more details.
**/
var spawn = require('child_process').spawn;

var DeployHelpers = {
  executeCommand: function(scriptCommand, callback) {
    var scriptHandle = spawn(scriptCommand);

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
        console.log(scriptCommand + " was unsuccessful. Aborting.");

        if (typeof callback != 'undefined') callback(false);
      } else {
        console.log(scriptCommand + " complete.");

        if (typeof callback != 'undefined') callback(true);
      }
    });
  }
}

module.exports = DeployHelpers;
