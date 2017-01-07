# dw-cli

This project is usable but WIP.

A command line utility for Salesforce Commerce Cloud (Demandware) SIG and PIG (no webdav on production) development and deployment.

```
Usage: $ <command>

Commands:
  activate <sandbox> <code-version>  Activate code on an environment
  init                               Create a dw.json file
  log <sandbox>                      Stream log files from an environment
  push <sandbox>                     Push all cartridges to an environment
  versions <sandbox>                 List codeversions in an environment
  watch <sandbox>                    Push file changes to an environment

Options:
  --username, -u   Username for environment
  --password, -p   Password for environment
  --hostname, -h   Hostname for environment
  --cartridge, -c  Path to single cartridge
  --help           Show help                                           [boolean]
  --version        Show version number                                 [boolean]

Examples:
  $ dw activate dev01 develop
  $ dw push dev01              Push all cartridges to the dev01 sandbox
  $ dw push dev01 -c app_core  Push a single cartridge to the dev01 sandbox
  $ dw watch dev01             Push changes to the dev01 environment
```
## Examples

Push and watch assume the 'code version' is the git branch of the cwd.

```
user@computer:~/Sites/site$ dw push dev01
[23:21:06] Deploying cartridges to current-branch-name on dev01-region-brand.demandware.net
✔ Zipping cartridges
✔ Creating remote folder
✔ Uploading to current-branch-name
✔ Removing /Cartridges/current-branch-name/archive.zip
[23:21:42] Success
```
```
user@computer:~/Sites/site$ dw activate dev01 current-branch-name
[23:22:00] Activating current-branch-name on dev01-region-brand.demandware.net
✔ Activating
✔ Reading
Versions
✖ another-branch
✔ current-branch-name
✖ develop
✖ version1
[23:22:04] Success
```
```
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
```
user@computer:~/Sites/site$ dw log dev01
[23:23:28] Streaming log files
customerror [2016-12-30 18:49:49.212 GMT] ERROR PipelineCallServlet|12129246|Sites-Site|Product-HitTile|PipelineCall|Gl5mgZN_FjcBOi1siIw8AAPAMkRF7fycxl5GKt-wIdKVBUMYxGFRD1k-EtRw7gCSoVy0GgkT_Mw4Xju3W6a4Gg== custom.ProductImageSO.ds   Image doesn't exist: "default/images/hi-res/2111319/1.jpg". Product ID: "Black BE
error 	at org.apache.tomcat.util.buf.ByteChunk.append(ByteChunk.java:366)
error 	at org.apache.coyote.http11.InternalOutputBuffer$OutputStreamOutputBuffer.doWrite(InternalOutputBuffer.java:240)
error 	at org.apache.coyote.http11.filters.IdentityOutputFilter.doWrite(IdentityOutputFilter.java:84)
error 	at org.apache.coyote.http11.AbstractOutputBuffer.doWrite(AbstractOutputBuffer.java:192)
error 	at org.apache.coyote.Response.doWrite(Response.java:499)
error 	at org.apache.catalina.connector.OutputBuffer.realWriteBytes(OutputBuffer.java:402)
error 	... 42 more
wwd [02:15:01.610] DEBUG Completed DR backup.
wwd [02:45:01.604] DEBUG Starting DR backup.
wwd [02:45:01.611] DEBUG Completed DR backup.
syslog [2016-12-31 04:22:03.465 GMT] User system activates code version 'current-branch-name'.
syslog [2016-12-31 04:22:03.920 GMT] Code version 'current-branch-name' activated.
syslog [2016-12-31 04:22:03.920 GMT] User system clears pipeline page cache of root
analyticsengine [2016-12-31 02:02:01.592 GMT] Splitter only runs on production instance
analyticsengine [2016-12-31 02:32:01.595 GMT] Base directory is: /remote/bbhd/bbhd_s08/sharedata/adl
api [2016-12-30 20:07:51.158 GMT] PipelineDictionary usage violation: WARN: deprecated getAlias() PIPELET: com.demandware.pipelet.common.Assign
api [2016-12-30 21:18:40.095 GMT] PipelineDictionary usage violation: WARN: deprecated getAliasKey() PIPELET: com.demandware.component.foundation.pipelet.common.DispatchFormAction
sysevent [2016-12-31 04:22:03.485 GMT] Using '/remote/bbhd/bbhd_s08/sharedata/cartridges/current-branch-name/bm_paypal/cartridge' as main cartridge directory for 'bm_paypal'.
sysevent [2016-12-31 04:22:03.486 GMT] Using '/remote/bbhd/bbhd_s08/sharedata/cartridges/current-branch-name/int_cybersource/cartridge' as main cartridge directory for 'int_cybersource'.
jobs [2016-12-31 04:23:01.597 GMT] Created Job configuration for domain [system]. Job type [1]. Job Configuration [, de4ba8565c1ee2d1998142d8bc]
jobs [2016-12-31 04:23:01.598 GMT] Created Job configuration for Schedule [RealTimeQuotaAlert, 5243faf4c73317f2ac12e375df]
```
## Setup
Place a dw.json file with these contents in your projects root directory or use `dw init`.
```
{
  "hostname": "-region-brand.demandware.net",
  "username": "defaultuser",
  "password": "defaultpass",

  "apiVersion": 'v16_6',

  "clientId": "client-id-from-account-dashboard",
  "clientPassword": "client-password-from-account-dashboard",

  "environments": {
    "dev02": {
      "password": "differentpass"
    },

    "staging": {
      "hostname": "stage.hostname.com",
      "webdav": "cert.staging.us.brand.demandware.net",
      "key": "./user.key",
      "cert": "./user.pem",
      "ca": "./staging.cert"
    }
  }
}
```
#### Sandbox Instances
For sandbox instances, I try to keep all of mine consistent as far as usernames and passwords go, so that is why we have the global default 'hostname' postfix, 'username', and 'password' config fields.  When you type in something like `dw push dev01`, the 'hostname' will converted to 'dev01-region-brand.demandware.net'.  If you need to override any settings per instance, you can do that in environments, as seen above with a scenario where the dev02 sandbox instance has a different password than the rest (yay strict af demandware password policy).

#### Staging
For staging, if you are using a custom hostname, you can fill that into 'hostname'.

###### Two-factor Auth and Webdav
If two-factor auth is configured on staging, the special hostname required for webdav can be filled into 'webdav' as well as key, cert, and ca — these are all generated using the staging cert given to you from support.  The process of creating the user key and pem from the staging cert is outlined in the support documentation.

#### Versions and Activate commands
To get access to 'versions' and 'activate', you will need to setup your Open Commerce API Settings (Global, not Site) on each instance.  A Client ID and Client Password can be created in the Account Center (account.demandware.com).

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
