/**
 * Deploy Goon
 * ©2013 Matt Farmer – Licensed under Apache 2 License
 * See LICENSE in project root for more details.
**/
module.exports = function(arguments) {
  var filePath = arguments[0],
      fs = require("fs"),
      DeployGoonConfiguration = require("../util/deploy-goon-configuration"),
      configuration = new DeployGoonConfiguration();

  if (filePath === undefined) {
    console.error("You are required to provide a valid file path to the add command.");
    return;
  }

  try {
    var stat = fs.statSync(filePath);

    if (! stat.isFile()) {
      console.error("The name you provide must be a file that exists, and may not be a directory.");
      return;
    }
  } catch(error) {
    console.error("Couldn't stat the file you tried to add.");
    console.error(error.toString());
    return;
  }

  configuration.addJob(filePath);
  configuration.save();
}
