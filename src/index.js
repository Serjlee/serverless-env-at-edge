'use strict'

const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const camelCase = require('camel-case')

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
  }

  jsonenvHandler() {
    const jsonFileName = this.serverless.service.custom.jsonenv.fileName;
    if (!jsonFileName) {
      return;
    }
    this.serverless.cli.log('Creating json env file')

    // collect global environment variables
    const globalEnvironment = this.serverless.service.provider.environment
    let environmentVariables = Object.assign({}, globalEnvironment)

    // collect environment variables of functions
    const functionEnvironment = this.collectFunctionEnvVariables()
    environmentVariables = Object.assign(environmentVariables, functionEnvironment)

    if (this.serverless.service.custom.jsonenv.camelCaseOutput) {
      environmentVariables = this.toCamelCase(environmentVariables);
    }

    // write .env file
    mkdirp.sync(path.dirname(jsonFileName))
    fs.writeFileSync(jsonFileName, JSON.stringify(environmentVariables, null, 2))
  }

  toCamelCase(obj) {
    return Object.entries(obj).reduce((camelCased, pair) => {
      return { ...camelCased,
        [camelCase(pair[0])]: pair[1]
      }
    }, {})
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
