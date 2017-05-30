# crab-rbac
A JavaScript Hierarchical Role Based Access Control library.

## Usage
Install the package

`npm i crab-rbac --save`

You can use the library with require

`const {rbac} = require('crab-rbac')`

or import it if you are using TypeScript

`import {rbac} from 'crab-rbac'`

## Testing
To run the tests using

`npm test`

is necessary to install

`npm i -g ts-node`

I highly suggest to install something like `faucet` (`npm i -g faucet`) and then pipe the output of npm test into it, in order to get an even more readable output. So the command is `npm test | faucet`.
