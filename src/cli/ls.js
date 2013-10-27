/**
 * Deploy Goon
 * ©2013 Matt Farmer – Licensed under Apache 2 License
 * See LICENSE in project root for more details.
**/
module.exports = function(arguments) {
  var DeployGoonConfiguration = require("../util/deploy-goon-configuration"),
      configuration = new DeployGoonConfiguration(),
      jobs = configuration.getJobs(),
      jobFiles = configuration.getJobFilePaths();

  for (slug in jobs) {
    var job = jobs[slug],
        description = job.getDescription(),
        path = jobFiles[slug];

    console.log(slug + " (" + path + ")");
    console.log("\t" + description);
  }
}
