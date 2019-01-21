'use strict'

const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')

class ServerlessJSONenvPlugin {
  constructor(serverless, options) {
    this.serverless = serverless
    this.options = options

    this.commands = {
      jsonenv: {
        usage: 'Create JSON files from serverless environment variables',
        lifecycleEvents: [
          'jsonenvHandler'
        ]
      }
    }

    this.hooks = {
      'jsonenv:jsonenvHandler': this.jsonenvHandler.bind(this)
    }

    this.environmentVariables = {}
  }

  jsonenvHandler() {
    const jsonFileName = this.serverless.service.custom.jsonenv.fileName;
    if (!jsonFileName) {
      return;
    }
    this.serverless.cli.log('Creating json env file')

    // collect global environment variables
    const globalEnvironment = this.serverless.service.provider.environment
    this.environmentVariables = Object.assign(this.environmentVariables, globalEnvironment)

    // collect environment variables of functions
    const functionEnvironment = this.collectFunctionEnvVariables()
    this.environmentVariables = Object.assign(this.environmentVariables, functionEnvironment)

    // write .env file
    mkdirp.sync(path.dirname(jsonFileName))
    fs.writeFileSync(jsonFileName, JSON.stringify(this.environmentVariables, null, 2))
  }

  collectFunctionEnvVariables() {
    const functions = this.serverless.service.functions || {}
    let environmentVariables = {}

    Object.keys(functions).forEach(func => {
      const environment = functions[func].environment

      environmentVariables = Object.assign({}, environmentVariables, environment)
    })

    return environmentVariables
  }
}

module.exports = ServerlessJSONenvPlugin
