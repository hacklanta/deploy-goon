#!/usr/bin/env node
/**
 * Deploy Goon
 * ©2013 Matt Farmer – Licensed under Apache 2 License
 * See LICENSE in project root for more details.
 *
 * Deploy Goon CLI.
**/

process.title = "deploygoon";

var acceptedCommands = require('./cli/accepted-commands'),
    arguments = process.argv.slice(2),
    command = ifValidCommand(arguments.shift()) || "usage";

function ifValidCommand(command) {
  if (acceptedCommands.hasOwnProperty(command))
    return command;
  else
    return undefined;
}

acceptedCommands[command].callback();
