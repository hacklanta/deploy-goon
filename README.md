# Deploy Goon

Deploy Goon is that was originally birthed from working on deployment procedures for [Anchor Tab](http://anchortab.com). When I was building out our continuous integration and deployment system, I wanted a way to trigger a release on the production server without the server running Jenkins actually having SSH access to the production box. To accomplish that, I wrote a quick-and-dirty Node.js daemon that kicked off the deploy scripts when it received an HTTP request.

Having determined that this process has worked well for us over the past few months, I started brainstorming how I could improve upon what essentially started as something of a hack. This brainstorming lead to the idea that it was time for this script to come into its own life as a project.

## Objectives

The main objective of this project is to get Deploy Goon to the point where you can do the following:

1. Install Deploy Goon on a server using npm (but then hopefully other package managers, too).
2. Define a deploygoon.json file that describes how deploy goon should behave for that project inside the project's SCM.
3. Execute a command like `deploygoon add deploy.goon` to add the projects deploy.goon file to the set of files deploygoon uses for configuration. Anytime there's a change to it, Deploy Goon reconfigures itself accordingly.
4. Set up monit if you want it to insure Deploy Goon is running when it needs to be (of that if it goes down it is restarted).
5. Configure your CI service to send an HTTP request to Deploy Goon on your server whenever it's time to deploy.

From the deploygoon.json file you should be able to specify the following on a project-by-project basis:

* **Project slug:** This will be used to compose the URL that your CI service will hit to trigger a deploy. For example, if the slug was "anchortab" our Jenkins instance would hit "/anchortab" to trigger the deploy. No two projects on the same server can have the same slug.
* **Allowed IPs:** An array containing a list of IPs that are allowed to trigger a deploy for this project.
* **Deploy procedure:** Ideally the full deploy procedure can be described in some pseudo-programming syntax.
* **Email notification settings:** Specify whether to always get a copy of the deployment log, only on errors, or never. These would also specify where the email should go to.

## Why Deploy Goon?

Fair question. This is a task that's easily handled by doing some quick and dirty shell scripting, as I've obviously done. And this isn't my first time writing a script like this. I actually implemented a similar ruby-specific one called [unicorn-easy-restart](https://github.com/farmdawgnation/unicorn-easy-restart) awhile back. I decided I'm tired of re-inventing the wheel.

## Who is I?

My name is **Matt Farmer**, and I'm a member of Hacklanta. I'm a code curator for a handful of people these days, not the least of which is [Anchor Tab](http://anchortab.com) where I serve as Lead Engineer and where the genesis of this project originates from.
