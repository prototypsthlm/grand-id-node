# Grand ID
Simplifies integration against Grand ID-API when using Node.js. More info about Grand ID:

- [Svensk e-identitet](http://www.e-identitet.se/index.php?page=authify_for_systemproviders)
- [GrandID homepage](http://grandid.com)
- [Prototyp wiki](https://sites.google.com/a/prototyp.se/wiki/projekt/egna-projekt/grandid) (needs Prototyp access)


## Example usage
Add it to package.json: `"dependencies": {
    "grand-id": "prototypsthlm/grand-id-node"
  }`
 
Example code to login: 

```
var grandId = require('grand-id');

// Set required config containing API key etc
var config = require('./grand-id.config');
grandId.setConfig(config);

// 'bankId' must be specified in grand-id.config file
var bankIdProvider = grandId.createIdentityProvider('bankId');
 
bankIdProvider.login(function(error, result) {
  if(error) {
    console.log('Login error');
  }
  else {
    // Redirect user to result.redirectUrl
    // User will end up at third party auth page
  }
});
```
