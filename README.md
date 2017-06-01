# crab-rbac
A JavaScript Hierarchical Role Based Access Control library.

## Usage
Install the package

`npm i crab-rbac --save`

You can use the library with require

`const {rbac} = require('crab-rbac')`

or import it if you are using TypeScript

`import {rbac} from 'crab-rbac'`

Then to initialize rbac, just build an array where every single object contains the name of the role, relative permissions and if it inherits all the permissions from a previously defined role.

For instance:

```
  const rolesData = [
    {
      name: 'DISABLED',
      capabilities: [],
      inherits: []
    },
    {
      name: 'VIEWER',
      capabilities: ['post:read', 'comment:read'],
      inherits: []
    },
    {
      name: 'EDITOR',
      capabilities: ['comment:read', 'post:edit', 'comment:edit'],
      inherits: ['VIEWER']
    },
    {
      name: 'USER_MANAGER',
      capabilities: ['user:read', 'user:edit'],
      inherits: []
    }
  ]

  rbac.init(rolesData)
```

## API
**can(capability: string, ...roles: string[]): boolean**
Returns a boolean that states if the required capability can be performed by the role(s) supplied in the arguments.

**capabilitiesOf(role: string): string[]**
Returns all the capabilities (also the inherited ones) that a role can perform.

**listRoles(): string[]**
Returns all the role names loaded by the rbac library.

**init(roles: Role[]): boolean**
Initializes the rbac library with the list of roles provided as argument.

**isInitialized(): boolean**
Tells if the library has been initialized

## Testing
To run the tests using

`npm test`

is necessary to install

`npm i -g ts-node`

I highly suggest to install something like `faucet` (`npm i -g faucet`) and then pipe the output of npm test into it, in order to get an even more readable output. So the command is `npm test | faucet`.
