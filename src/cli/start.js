/**
 * Deploy Goon
 * ©2013 Matt Farmer – Licensed under Apache 2 License
 * See LICENSE in project root for more details.
**/
module.exports = function(arguments) {
  var spawn = require("child_process").spawn,
      child = spawn("src/daemon", [], {
       detached: true,
       stdio: [ 'ignore', 'ignore', 'ignore' ]
      });

  child.unref();
}
