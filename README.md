# ⚡️ Serverless Plugin env@Edge
## About the plugin

This serverless plugin generates a JSON file based on the environment variables in the `serverless.yml` so you can use them in your Lambda@Edge, or somewhere else in your pipeline.

## Usage

### Install the plug-in
```
$ npm i --save-dev serverless-env-at-edge
```

### Add it to your `serverless.yaml`:
```

provider:
  environment:
    MY_ENV_VAR: ${env:MY_ENV_VAR, 'some value'}
    
...

plugins:
  - serverless-env-at-edge

...

custom:
  envAtEdge:
    functions: # required
      - myLambda: lambda/config.js
    camelCaseOutput: true # optional, defaults to false. If set to true, env keys will be converted from SNAKE_CASE to camelCase

functions:
  jwtAuth:
    ...
    environment:
      MY_OTHER_VAR: value

```
Generate the JSON file:
```
$ sls jsonenv
```

### Use exported variables in the Lambda@Edge
```javascript
const myVars = require('./config.js');

...
// outputs: { myEnvVar: 'some value', myOtherVar: 'value' }
console.log(myVars);
```


