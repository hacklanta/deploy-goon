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

configuration.watchConfiguration();

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
