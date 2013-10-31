var assert = require('assert');

describe('DeployJob', function() {
  describe('#constructor', function() {
    it('should construct a valid DeployJob for valid input');

    it('should return a helpful error if required fields are not specified');
  });

  describe('#getSlug', function() {
    it('should return the correct slug');
  });

  describe('#getDescription', function() {
    it('should return the correct description');
  });

  describe('#isIpWhitelisted', function() {
    it('should return true if the provided IP is whitelisted');

    it('should return false if the provided IP is not whitelisted');
  });

  describe("#executeDeployment", function() {
    it('should execute the deploy actions in the correct order');

    it('should stop execution when one of the deploy actions exits nonzero');
  })
});
