#dw-cli

A command line utility for Salesforce Commerce Cloud (Demandware) SIG and PIG (not production) development and deployment.

```
Usage: $ <command> <env> [options]

Commands:
  push <env> [options]          Push code to an environment
  watch <env> [options]         Push file changes to an environment
  versions <env>                List codeversions in an environment
  activate <env> [codeversion]  Activate code on an environment
  rollback <env> <commit>       Rollback code on an environment
  init                          Create a dw.json file

Options:
  --help, -h     Show help                                             [boolean]
  --version, -v  Show version number                                   [boolean]

Examples:
  $ dw push dev01   Push code to the dev01 environment
  $ dw watch dev01  Watch for changes and push files to the dev01 environment
```
Place a dw.json file with these contents in your projects root directory or use `dw init`.  A Client ID and password can be created in the Account Center.
```
{
  "hostname": "-region-customer.demandware.net",
  "username": "defaultuser",
  "password": "defaultpass",
  
  "api_verson": "v16_6",
  
  "client_id": "client-id-from-account-dashboard",
  "client_password": "client-password-from-account-dashboard",

  "environments": {
    "dev01": {
      "username": "dev01user",
      "password": "dev01pass"
    },

    "staging": {
      "certificate": "./staging.crt",
      "username": "staginguser",
      "password": "stagingpass"
    }
  }
}
```

To use this utility you will need to setup your Open Commerce API Settings (Global not Site) on each instance in question.  A Client ID can be created in the Account Center.

```
{
  "_v":"16.6",
  "clients":
  [ 
    {
      "client_id":"client-id-from-account-dashboard",
      "resources":
      [
        {
          "resource_id":"/code_versions",
          "methods":["get"],
          "read_attributes":"(**)",
          "write_attributes":"(**)"
        }
      ]
    }
  ]
}
```
