# ⚡️ Serverless Plugin JSONEnv
## About the plugin

This serverless plugin generates a JSON file based on the environment variables in the `serverless.yml` so you can use them somewhere else in your pipeline. An interesting user case could be generating a config file to include in a Lambda@Edge, where environment variables can't be injected.

## Usage

Install the plug-in:
```
$ npm i --save-dev serverless-jsonenv
```

Add it to your `serverless.yaml`:
```
plugins:
  - serverless-jsonenv
  
...

custom:
  jsonenv:
    fileName: lambda/config.js
```
Generate the JSON file:
```
$ sls jsonenv
```
