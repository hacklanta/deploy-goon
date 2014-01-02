/**
 * Deploy Goon
 * ©2013 Matt Farmer – Licensed under Apache 2 License
 * See LICENSE in project root for more details.
**/
var spawn = require('child_process').spawn;

var DeployHelpers = {
  executeCommand: function(actionDescriptor, callback, options) {
    var options = options || {},
        spawnOptions = {env: options.env || process.env};

    if (actionDescriptor.uid)
      spawnOptions["uid"] = actionDescriptor.uid;

    if (actionDescriptor.gid)
      spawnOptions["gid"] = actionDescriptor.gid;

    var scriptHandle = spawn(actionDescriptor.command, actionDescriptor.arguments, spawnOptions);

    scriptHandle.stdout.on('data', function(data) {
      if (! options.silenceOutput)
        process.stdout.write(data);
    });

    scriptHandle.stderr.on('data', function(data) {
      if (! options.silenceOutput)
        process.stderr.write(data);
    });

    scriptHandle.on('error', function(error) {
      if (! options.silenceOutput)
        console.log(error);
    });

    scriptHandle.on('close', function(code) {
      if (code !== 0) {
        if (! options.silenceOutput)
          console.log(actionDescriptor.name + " was unsuccessful. Aborting.");

        if (typeof callback != 'undefined') callback(false);
      } else {
        if (! options.silenceOutput)
          console.log(actionDescriptor.name + " complete.");

        if (typeof callback != 'undefined') callback(true);
      }
    });
  }
}

module.exports = DeployHelpers;
