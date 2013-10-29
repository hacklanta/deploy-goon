/**
 * Deploy Goon
 * ©2013 Matt Farmer – Licensed under Apache 2 License
 * See LICENSE in project root for more details.
**/
module.exports = function(arguments) {
  var spawn = require("child_process").spawn,
      fs = require("fs"),
      logfile = fs.openSync("/var/log/deploygoon.log", "a"),
      child = spawn("node", ["src/daemon.js"], {
       detached: true,
       stdio: [ 'ignore', logfile, logfile]
      });

  child.unref();
}
