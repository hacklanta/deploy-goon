describe("DeployGoonConfiguration", function() {
  var assert = require('assert'),
      DeployGoonConfiguration = require('../../src/util/deploy-goon-configuration');

  it("should return empty array for getJobs with no jobs added.", function() {
    var configuration = new DeployGoonConfiguration({configurationFiles: []}),
        jobs = configuration.getJobs(),
        jobCount = 0;

    for (key in jobs) jobCount++;
    assert.equal(jobCount, 0);
  });

  it("should return a job from getJobs that was passed in constructor", function() {
    var configuration = new DeployGoonConfiguration({configurationFiles: [
          __dirname + "/../../examples/example-job.json"
        ]}),
        jobs = configuration.getJobs(),
        jobCount = 0;

    for (key in jobs) jobCount++;
    assert.equal(jobCount, 1);
    assert.equal(jobs['example-job'].slug, 'example-job');
    assert.equal(jobs['example-job'].description, 'An example job.');
  });

  it("should return a job from getJobs that was added", function() {
    var configuration = new DeployGoonConfiguration({configurationFiles: []}),
        jobs = configuration.getJobs(),
        jobCount = 0;

    configuration.addJob(__dirname + "/../../examples/example-job.json");

    for (key in jobs) jobCount++;
    assert.equal(jobCount, 1);
    assert.equal(jobs['example-job'].slug, 'example-job');
    assert.equal(jobs['example-job'].description, 'An example job.');
  });

  it("should no longer return an added job after that job has been removed", function() {
    var configuration = new DeployGoonConfiguration({configurationFiles: []}),
        jobs = configuration.getJobs(),
        jobCount = 0;

    configuration.addJob(__dirname + "/../../examples/example-job.json");
    configuration.removeJob("example-job");

    for (key in jobs) jobCount++;
    assert.equal(jobCount, 0);
  });
});
