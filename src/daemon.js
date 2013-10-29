/**
 * Deploy Goon
 * ©2013 Matt Farmer – Licensed under Apache 2 License
 * See LICENSE in project root for more details.
 *
 * Deploy Goon Main.
**/
var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    DeployGoonConfiguration = require('./util/deploy-goon-configuration'),
    configuration = new DeployGoonConfiguration();

try {
  var existingPid = fs.readFileSync("/var/run/deploygoon-daemon.pid", {charset: 'utf8'});

  console.error("It looks like there's already an instance of deploy goon running (PID " + existingPid + ")");
  console.error("Please check to see if it's active. If not, delete /var/run/deploygoon-daemon.pid and try again.");
  process.exit(1);
} catch(error) {
  if (error.code == "ENOENT") {
    try {
      fs.writeFileSync("/var/run/deploygoon-daemon.pid", process.pid);
    } catch (writeError) {
      console.error("Couldn't write pidfile. Please ensure you're running the daemon as root.");
      process.exit(1);
    }
  } else {
    console.error(error.toString());
    process.exit(1);
  }
}

function unlinkPidfile() {
  fs.unlinkSync("/var/run/deploygoon-daemon.pid");
  process.exit(0);
}

process.on("SIGINT", unlinkPidfile);
process.on("SIGTERM", unlinkPidfile);
process.on("SIGQUIT", unlinkPidfile);

process.title = "deploygoon-daemon";

configuration.watchConfiguration();

process.on("SIGUSR2", function() {
  console.log("Got a USR2 signal. Reloading all configuration from scratch.");
  configuration = new DeployGoonConfiguration();
  console.log("Configuration reload completed.");
});

http.createServer(function(req, res) {
  var job = configuration.getJob(url.parse(req.url).pathname.substr(1));

  if (job) {
    res.writeHead(200);
    res.end();

    job.executeDeployment();
  } else {
    res.writeHead(404);
    res.end();
  }
}).listen(9090, '127.0.0.1');

console.log("The Deploy Goon is up on 9090.");
