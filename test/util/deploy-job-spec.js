describe('DeployJob', function() {
  var assert = require('assert'),
      DeployJob = require("../../src/util/deploy-job"),
      exampleJobDescriptor = {
        "slug": "example-job",
        "description": "An example job.",
        "ipWhitelist": ["127.0.0.1"],
        "deployActions": [
          {
            "name": "Echo Lo",
            "command": "whoami"
          }
        ]
      },
      exampleJob = new DeployJob(exampleJobDescriptor);

  var trustProxyJobDescriptor = {
        "slug": "example-job",
        "description": "An example job.",
        "ipWhitelist": ["127.0.0.1"],
        "trustProxy": true,
        "deployActions": [
          {
            "name": "Echo Lo",
            "command": "whoami"
          }
        ]
      },
      exampleJobWithProxyTrust = new DeployJob(trustProxyJobDescriptor);

  describe('#constructor', function() {
    it('should construct a valid DeployJob for valid input', function() {
      assert.equal(typeof exampleJob, "object");
    });

    it('should return a helpful error if required fields are not specified');
  });

  describe('#getSlug', function() {
    it('should return the correct slug', function() {
      assert.equal(exampleJob.getSlug(), exampleJobDescriptor.slug);
    });
  });

  describe('#getDescription', function() {
    it('should return the correct description', function() {
      assert.equal(exampleJob.getDescription(), exampleJobDescriptor.description);
    });
  });

  describe('#isIpWhitelisted', function() {
    it('should return true if the provided IP is whitelisted', function() {
      var ipWhitelistedResult = exampleJob.isIpWhitelisted("127.0.0.1");

      assert.equal(ipWhitelistedResult, true);
    });

    it('should return false if the provided IP is not whitelisted', function() {
      var ipWhitelistedResult = exampleJob.isIpWhitelisted("192.168.1.1");

      assert.equal(ipWhitelistedResult, false);
    });

    it('should return false if proxy trust is disabled and the actual IP it not whitelisted', function() {
      var ipWhitelistedResult = exampleJob.isIpWhitelisted("192.168.1.1", "127.0.0.1");

      assert.equal(ipWhitelistedResult, false);
    });

    it('should return true if proxy trust is enabled and the forwarded for IP is whitelisted', function() {
      var ipWhitelistedResult = exampleJobWithProxyTrust.isIpWhitelisted("192.168.1.1", "127.0.0.1");

      assert.equal(ipWhitelistedResult, true);
    });
  });

  describe("#executeDeployment", function() {
    it('should execute the deploy actions in the correct order');

    it('should stop execution when one of the deploy actions exits nonzero');
  })
});
