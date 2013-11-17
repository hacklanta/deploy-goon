# Deploy Goon [![Build Status](https://travis-ci.org/hacklanta/deploy-goon.png?branch=master)](https://travis-ci.org/hacklanta/deploy-goon)

Deploy Goon is that was originally birthed from working on deployment procedures for [Anchor Tab](http://anchortab.com). When
I was building out our continuous integration and deployment system, I wanted a way to trigger a release on the production
server without the server running Jenkins actually having SSH access to the production box. To accomplish that, I wrote a
quick-and-dirty Node.js daemon that kicked off the deploy scripts when it received an HTTP request.

Having determined that this process has worked well for us over the past few months, I started brainstorming how I could
improve upon what essentially started as something of a hack. This brainstorming lead to the idea that it was time for
this script to come into its own life as a project.

## Installation

To install Deploy Goon, you'll need to first install [Node.js](http://nodejs.org). You can find some excellent instructions
for doing so on their website. After you have Node.js installed, execute the following command on your terminal:

```
$ sudo npm install -g deploy-goon
```

That will globally install Deploy Goon, and should drop the `deploygoon` executable on your path, which is all you really
need to get started.

## Using Deploy Goon

To use Deploy Goon, the first thing you'll need to do is write a deploy job configuration. Since Deploy Goon is written in
JavaScript, we define our deploy jobs in JSON. Here's an example:

```json
{
  "slug": "my-job",
  "description": "Some human readable description.",
  "ipWhitelist": ["127.0.0.1"],
  "deployActions": [
    {
      "name": "Build software.",
      "command": "make",
      "arguments": ""
    },
    {
      "name": "Install software.",
      "command": "make",
      "arguments": "install"
    }
  ],
  "notificationSettings": {
    "notify": "always",
    "email": "buildnotifications@frmr.me"
  }
}
```

Not all of these options are *functional* yet (hence why our version number is less than 1.0), but hopefully you'll
go ahead and get familiar with them anyway. Here's a brief outline of the available options.

* **slug:** This should be a lowercase and hyphenated unique identifier for the project. Something suitable for
  for usage in a URL because... it will be used in a URL.
* **description:** Some human readable description of the project for display as output of the `deploygoon ls` command.
* **ipWhitelist:** IPs allowed to trigger this deploy. (TODO)
* **deployActions:** The steps of the deploy process.
* **notificationSettings:** Settings for the notification emails in the resulting deploy. (TODO)

After you have this build definition, you can do the following:

```
$ sudo deploygoon add my-deploy-job.json
```

Your deploy job will then be added to the list of jobs Deploy Goon knows about. Now, all that's left is to start up
Deploy Goon!

```
$ sudo deploygoon start
```

Assuming nothing went wrong, you should now have Deploy Goon running on port 9090. You should be able to trigger the
deploy you described above by going sending an HTTP request to http://localhost:9090/my-job like so:

```
$ curl http://localhost:9090/my-job
```

Output from the deploy job will be displayed in Deploy Goon's logfile located at `/var/log/deploygoon.log`.

## Why Deploy Goon?

Fair question. This is a task that's easily handled by doing some quick and dirty shell scripting, as I've obviously done.
And this isn't my first time writing a script like this. I actually implemented a similar ruby-specific one called
[unicorn-easy-restart](https://github.com/farmdawgnation/unicorn-easy-restart) awhile back. I decided I'm tired of re-inventing
the wheel.

## Who is I?

My name is **Matt Farmer**, and I'm a member of Hacklanta. I'm a code curator for a handful of people these days, not the least
of which is [Anchor Tab](http://anchortab.com) where I serve as Lead Engineer and where the genesis of this project originates from.
