#dw-cli

This project is usable but WIP.

A command line utility for Salesforce Commerce Cloud (Demandware) SIG and PIG (not production) development and deployment.

```
Usage: $ <command>

Commands:
  push <sandbox>                     Push cartridges to an environment (Assunes
                                     "cartridges" folder in cwd)
  watch <sandbox> <cartridge>        Push file changes to an environment
  versions <sandbox>                 List codeversions in an environment
  activate <sandbox> <code-version>  Activate code on an environment
  init                               Create a dw.json file

Options:
  --username         Sandbox username
  --password         Sandbox password
  --hostname         Sandbox hostname
  --sandbox          Sandbox
  --code-version     Code version to deploy to               [default: "master"]
  --cartridge        Path to single cartridge
  --cartridges       Path to all cartridges
  --api-version      Demandware API version                   [default: "v16_6"]
  --client-id        Demandware API client_id
  --client-password  Demandware API client_password
  --help, -h         Show help                                         [boolean]
  --version, -v      Show version number                               [boolean]

Examples:
  $ dw push dev01                          Push all cartridges to the dev01
                                           sandbox
  $ dw push dev01 --cartridge app_mz_core  Push a single cartridge to the dev01
                                           sandbox
  $ dw watch dev01 app_mz_core             Watch for changes and push files to
                                           the dev01 environment
```
Place a dw.json file with these contents in your projects root directory or use `dw init`.  A Client ID and password can be created in the Account Center.
```
{
  "username": "defaultuser",
  "password": "defaultpass",

  "apiVersion": 'v16_6',

  "clientId": "client-id-from-account-dashboard",
  "clientPassword": "client-password-from-account-dashboard",

  "environments": {
    "dev01": {
      "hostname": "dev01.hostname.com",
      "username": "dev01user",
      "password": "dev01pass"
    },

    "staging": {
      "hostname": "staging.hostname.com",
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
        },
        {
          "resource_id":"/code_versions/*",
          "methods":["get", "patch", "put"],
          "read_attributes":"(**)",
          "write_attributes":"(**)"
        }
      ]
    }
  ]
}
```
