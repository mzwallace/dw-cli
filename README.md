# dw-cli

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
## Examples
```
user@computer:~/Sites/site$ dw push dev01
[23:21:06] Deploying cartridges to current-branch-name
✔ Zipping cartridges
✔ Creating remote folder
✔ Uploading to MZ-755
✔ Removing /Cartridges/current-branch-name/archive.zip
[23:21:42] Success
user@computer:~/Sites/site$ dw activate dev01 current-branch-name
[23:22:00] Activating MZ-755 on dev01-us-brand.demandware.net
✔ Activating
✔ Reading
Versions
✖ another-branch
✔ current-branch-name
✖ develop
✖ version1
[23:22:04] Success
user@computer:~/Sites/site$ dw watch dev01
[23:22:25] Watching 'cartridges' for changes
  cartridges/app_controllers/cartridge/scripts/app.js changed
✔ cartridges/app_controllers/cartridge/scripts/app.js uploaded
  cartridges/app_controllers/cartridge/scripts/guard.js changed
✔ cartridges/app_controllers/cartridge/scripts/guard.js uploaded
  cartridges/app_controllers/cartridge/scripts/models/CartModel.js changed
✔ cartridges/app_controllers/cartridge/scripts/models/CartModel.js uploaded
⠙ Watching
```
## Setup
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
