/**
 * Deploy Goon
 * ©2013 Matt Farmer – Licensed under Apache 2 License
 * See LICENSE in project root for more details.
**/
module.exports = function(arguments) {
  var fs = require("fs"),
      pid = fs.readFileSync("/var/run/deploygoon-daemon.pid", {charset: 'utf8'});

  process.kill(pid);
}
