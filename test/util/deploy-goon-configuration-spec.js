describe("DeployGoonConfiguration", function() {
  var assert = require('assert'),
      fs = require("fs"),
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

  it("should correctly detect a change in a watched configuration", function() {
    var configurationFile = __dirname + "/../../examples/job-that-will-change-a.json",
        configuration = new DeployGoonConfiguration({configurationFiles: [configurationFile]}),
        content = '{"slug": "a-job-that-will-change", "description": "Saucceeee!", "ipWhitelist": ["127.0.0.1"], "deployActions": [{"name": "z", "command": "Z"}]}';

    configuration.watchConfiguration();
    fs.writeFileSync(configurationFile, content);

    setTimeout(function() {
      var jobs = configuration.getJobs();
      assert.equal(jobs['a-job-that-will-change'].getDescription(), "Saucceeee!");
    }, 50);
  });

  it("should correctly handle a slug rename for a watched job", function() {
    var configurationFile = __dirname + "/../../examples/job-that-will-change-name.json",
        configuration = new DeployGoonConfiguration({configurationFiles: [configurationFile]}),
        originalContent = '{"slug": "name-me", "description": "Saucceeee!", "ipWhitelist": ["127.0.0.1"], "deployActions": [{"name": "z", "command": "Z"}]}',
        content = '{"slug": "zz-top", "description": "Saucceeee!", "ipWhitelist": ["127.0.0.1"], "deployActions": [{"name": "z", "command": "Z"}]}';

    configuration.watchConfiguration();
    fs.writeFileSync(configurationFile, content);

    setTimeout(function() {
      var jobs = configuration.getJobs();
      assert.equal(jobs['zz-top'].getDescription(), "Saucceeee!");
      fs.writeFileSync(configurationFile, originalContent);
    }, 50);
  });
});
