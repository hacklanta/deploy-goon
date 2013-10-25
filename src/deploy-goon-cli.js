#!/usr/bin/env node
/**
 * Deploy Goon
 * ©2013 Matt Farmer – Licensed under Apache 2 License
 * See LICENSE in project root for more details.
 *
 * Deploy Goon CLI.
**/

process.title = "deploygoon";

var acceptedCommands = {
      add: {
        helpfulName: "deploygoon add path/to/deploygoon.json",
        description: "Add a project to deploy goon.",
        callback: function() {}
      },
      remove: {
        helpfulName: "deploygoon remove project-slug",
        description: "Remove a project from deploy goon.",
        callback: function() {}
      },
      ls: {
        helpfulName: "deploygoon ls",
        description: "List all projects deploy goon knows about.",
        callback: function() {}
      },
      start: {
        helpfulName: "deploygoon start",
        description: "Start the deploy goon daemon.",
        callback: function() {}
      },
      stop: {
        helpfulName: "deploygoon stop",
        description: "Stop the deploy goon daemon.",
        callback: function() {}
      },
      usage: {
        helpfulName: "deploygoon usage",
        description: "Display this usage information.",
        callback: usageCommand
      }
    },
    arguments = process.argv,
    command = ifValidCommand(arguments.shift()) || "usage";

function ifValidCommand(command) {
  if (acceptedCommands.hasOwnProperty(command))
    command
  else
    undefined
}

function usageCommand() {
  console.log("deploygoon -- A goon for deployment.");
  console.log("");

  for (command in acceptedCommands) {
    console.log(acceptedCommands[command].helpfulName);
    console.log("\t" + acceptedCommands[command].description);
    console.log("");
  }
}

acceptedCommands[command].callback();
