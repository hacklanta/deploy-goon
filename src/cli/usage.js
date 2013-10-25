/**
 * Deploy Goon
 * ©2013 Matt Farmer – Licensed under Apache 2 License
 * See LICENSE in project root for more details.
 *
 * Deploy Goon Usage Output.
**/
module.exports = function(arguments) {
  var acceptedCommands = require('./accepted-commands');

  console.log("deploygoon -- A goon for deployment.");
  console.log("");

  for (command in acceptedCommands) {
    console.log(acceptedCommands[command].helpfulName);
    console.log("\t" + acceptedCommands[command].description);
    console.log("");
  }
}
