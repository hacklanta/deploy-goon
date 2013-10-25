/**
 * Deploy Goon
 * ©2013 Matt Farmer – Licensed under Apache 2 License
 * See LICENSE in project root for more details.
 *
 * Deploy Goon Main.
**/
var http = require('http'),
    url = require('url'),
    spawn = require('child_process').spawn,
    fs = require('fs'),
    DeployHelpers = require('./util/deploy-helpers'),
    DeployJob = require('./util/deploy-job');

http.createServer(function(req, res) {
  if (url.parse(req.url).pathname == "/bacon") {
    res.writeHead(200);
    res.end();
  } else {
    res.writeHead(404);
    res.end();
  }
}).listen(9090, '127.0.0.1');

console.log("The Deploy Goon is up on 9090.");
