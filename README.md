# Deploy Goon [![Build Status](https://travis-ci.org/hacklanta/deploy-goon.png?branch=master)](https://travis-ci.org/hacklanta/deploy-goon)

Deploy Goon is that was originally birthed from working on deployment procedures for [Anchor Tab](http://anchortab.com). When
I was building out our continuous integration and deployment system, I wanted a way to trigger a release on the production
server without the server running Jenkins actually having SSH access to the production box. To accomplish that, I wrote a
quick-and-dirty Node.js daemon that kicked off the deploy scripts when it received an HTTP request.

After some iteration on the intial idea, I ended up with the specification for what is now Deploy Goon: a simple, but
powerful, remote command execution daemon configurable with JSON files.

## Features

* Capable of running any command, as any user.
* IP whitelisting to prevent Joe the Hacker from executing your deploys.
* Support for using X-Forwarded-For header as IP if proxy trust is enabled.
* Easy-to-use CLI interface for managing which configuration files are used.
* Automatically reloads deploy configurations when they change.
* Stock support for basic notifications delivered via Mandrill email. If you have additional notification methods you'd
like supported, open a PR!

## Installation

To install Deploy Goon, you'll need to first install [Node.js](http://nodejs.org). You can find some excellent instructions
for doing so on their website. After you have Node.js installed, execute the following command on your terminal:

```
$ sudo npm install -g deploy-goon
```

That will globally install Deploy Goon, and should drop the `deploygoon` executable on your path, which is all you really
need to get started.

## Using Deploy Goon

It's time to write your first deploy job configuration. Since Deploy Goon is written in
JavaScript, we define our deploy jobs in JSON. Here's an example:

```json
{
  "slug": "baconsauce",
  "description": "An example deployment allowable from localhost.",
  "ipWhitelist": ["192.168.1.1", "127.0.0.1"],
  "deployActions": [
    {
      "name": "Echo Lo",
      "command": "whoami"
    }
  ],
  "notifications": {
    "notifier": "mandrill",
    "onSuccess": false,
    "settings": {
      "apiKey": "zzzzz",
      "fromEmail": "deploy@goon.com",
      "fromName": "Deploy Goon",
      "toEmail": "the@boss.com",
      "toName": "The Boss"
    }
  }
}
```

In the configuration above, when `http://localhost:9090/baconsauce` is hit from either `192.168.1.1` or `127.0.0.1`,
the `whoami` command will be run. If it failed, we'll dispatch an email via Mandrill to "The Boss" letting him know.
(Of course, "zzzzz" isn't a valid Mandrill API key, so you'll need to get one of those.)

Here are all the options we support in detail.

* **slug** (string, required) – This should be a lowercase and hyphenated unique identifier for the project. Something suitable for
  for usage in a URL because it will make up the latter part of the URL for trigging your deploy.
* **description** (string, recommended) – Some human readable description of the project for display as output of the `deploygoon ls` command.
* **ipWhitelist** (array of string, recommended) – IPs 
* **deployActions** (array of objects, required) – The steps of the deploy process described in objects, where each object can take the
  following parameters:
  * **name** (string) – The huamn friendly name for the action.
  * **command** (string) – The program name to execute.
  * **arguments** (array of string) – Arguments to be passed to the command.
  * **uid** (number) – The numeric user id to execute the command under.
  * **gid** (number) – The numeric group id to execute the command under.
* **notifications** (object, optional) – Notification settings for the deploy process. If omitted, no notifications will occur. If provided
  use the following format.
  * **notifier** (string, required) – The name (minus extension) of the [notifier](https://github.com/hacklanta/deploy-goon/tree/master/src/notifiers)
    to use.
  * **onSuccess** (boolean, optional) – By default we only notify you on failed deploys. If you'd like success notifications too, set this flag
    to true.
  * **settings** (object, required) – The format of this object is specific to the notifier implementation you're using. It will be passed
    verbatim to the notifier.

After you have this build definition, you can do the following:

```
$ sudo deploygoon add path/to/my-deploy-job.json
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
the wheel. I figured other people were as well.

## Who is I?

My name is **Matt Farmer**. I'm a software engineer hailing from Atlanta, GA. I'm a member of Hacklanta. I'm a code curator for
a handful of people these days, not the least of which is [Anchor Tab](http://anchortab.com) where I serve as Lead Engineer. You
can read my ramblings at [my blog](http://farmdawgnation.com) and on my [twitter account](http://twitter.com/farmdawgnation).
