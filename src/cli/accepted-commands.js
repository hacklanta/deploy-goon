/**
 * Deploy Goon
 * ©2013 Matt Farmer – Licensed under Apache 2 License
 * See LICENSE in project root for more details.
 *
 * The commands recognized by Deploy Goon.
**/
module.exports = {
  add: {
    helpfulName: "deploygoon add path/to/deploygoon.json",
    description: "Add a project to deploy goon.",
    callback: require('./add')
  },
  remove: {
    helpfulName: "deploygoon remove project-slug",
    description: "Remove a project from deploy goon.",
    callback: require('./remove')
  },
  ls: {
    helpfulName: "deploygoon ls",
    description: "List all projects deploy goon knows about.",
    callback: require('./ls')
  },
  start: {
    helpfulName: "deploygoon start",
    description: "Start the deploy goon daemon.",
    callback: require('./start')
  },
  stop: {
    helpfulName: "deploygoon stop",
    description: "Stop the deploy goon daemon.",
    callback: require('./stop')
  },
  usage: {
    helpfulName: "deploygoon usage",
    description: "Display this usage information.",
    callback: require('./usage')
  }
}
