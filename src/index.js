'use strict'

const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const camelCase = require('camel-case')

class ServerlessEnvAtEdgePlugin {
  constructor(serverless, options) {
    this.serverless = serverless
    this.options = options
    this.initialized = false;

    this.commands = {
      envAtEdge: {
        usage: 'Create JSON files from serverless environment variables',
        lifecycleEvents: [
          'envAtEdgeHandler'
        ]
      }
    }

    this.hooks = {
      'envAtEdge:envAtEdgeHandler': this.envAtEdgeHandler.bind(this)
    }
  }

  _init() {
    this.initialized = true
    this.functions = this.serverless.service.custom.envAtEdge.functions || []
    this.functions = this.functions.reduce((obj, el) => {
      obj[Object.keys(el)[0]] = el[Object.keys(el)[0]];
      return obj
    }, {});
    this.camelCaseOutput = this.serverless.service.custom.envAtEdge.camelCaseOutput || false
  }

  envAtEdgeHandler() {
    if (!this.initialized) {
      this._init()
    }

    // collect global environment variables
    const globalEnvironment = this.serverless.service.provider.environment

    for (const [functionName, fileName] of Object.entries(this.functions)) {
      const fun = this.serverless.service.functions[functionName]
      if (!fun) {
        this.serverless.cli.log(`${functionName} is not defined`)
        throw new Error(`${functionName} is not defined`)
      }
      this.serverless.cli.log(`Creating JSON env file for ${functionName}: ${fileName}`)
      let environmentVariables = Object.assign({}, globalEnvironment, fun.environment)

      if (this.camelCaseOutput) {
        environmentVariables = this.toCamelCase(environmentVariables);
      }

      // write .env file
      mkdirp.sync(path.dirname(fileName))
      fs.writeFileSync(fileName, JSON.stringify(environmentVariables, null, 2))
    }
  }

  toCamelCase(obj) {
    return Object.entries(obj).reduce((camelCased, pair) => {
      return { ...camelCased,
        [camelCase(pair[0])]: pair[1]
      }
    }, {})
  }
}

module.exports = ServerlessEnvAtEdgePlugin
