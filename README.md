# dw-cli
A command line utility for Salesforce Commerce Cloud (Demandware) SIG and PIG development.  The goal of this package is to make working with development on the Salesforce Commerce Cloud platform a more pleasant and intuitive experience.
```
Usage: dw <command> <instance> [options] --switches

Commands:
  init                                Create a dw.json file
  versions <instance>                 List code versions on an instance
  activate <instance> [code-version]  Activate code version on an instance
  push <instance> [code-version]      Push code version to an instance
  remove <instance> [code-version]    Remove code version from an instance
  watch <instance> [code-version]     Push changes to an instance
  clean <instance>                    Remove inactive code versions on instance
  extract <instance> <file>           Extract a file on an instance
  log <instance>                      Stream log files from an instance
  keygen <user> <crt> <key> <srl>     Generate a staging certificate for a stage
                                      instance user account

Options:
  --username, -u     Username for instance
  --password, -p     Password for instance
  --hostname, -h     Hostname for instance
  --cartridges, -c   Path to cartridges
  --api-version      Demandware API Version
  --client-id        Demandware API Client ID
  --client-password  Demandware API Client Password
  --help             Show help                         [boolean]
  --version          Show version number               [boolean]

Examples:
  dw versions dev01        List code versions on dev01
  dw activate dev01        Activate branch name as code version on dev01
  dw push dev01 version1   Push version1 to dev01
  dw remove dev01          Remove branch name as code version from dev01
  dw watch dev01 version1  Push changes in cwd to version1 on dev01
  dw clean dev01           Remove all inactive code versions on dev01
  dw log dev01             Stream log files from the dev01
```
## Examples
Activate, push, remove, and watch assume the 'code version' is the git branch of the cwd unless it is declared in the command arguments.
#### dw push
```
user@computer:~/Sites/site$ dw push dev01
[23:21:06] Pushing current-branch-name to dev01-region-brand.demandware.net
✔ Zipping 'cartridges'
✔ Creating remote folder /Cartridges/current-branch-name
✔ Uploading /Cartridges/current-branch-name/archive.zip
✔ Unzipping /Cartridges/current-branch-name/archive.zip
✔ Removing /Cartridges/current-branch-name/archive.zip
[23:21:42] Success 30.142s
```
#### dw activate
```
user@computer:~/Sites/site$ dw activate dev01 current-branch-name
[23:22:00] Activating current-branch-name on dev01-region-brand.demandware.net
✔ Activating
[23:22:04] Success 0.976s
```
#### dw versions
```
user@computer:~/Sites/site$ dw versions dev01
[23:22:06] Reading code versions on dev01-region-brand.demandware.net
✔ Reading
-------------------
✔ current-branch-name
✖ master
✖ develop
-------------------
[23:22:08] Success 0.754s
```
#### dw remove
```
user@computer:~/Sites/site$ dw remove dev01 version1
[16:40:51] Removing develop from dev01-region-brand.demandware.net
✔ Removing
[16:40:57] Success 5.762s
```
#### dw clean
```
user@computer:~/Sites/site$ dw clean dev01
[16:42:05] Cleaning up dev01-region-brand.demandware.net
✔ Reading
-------------------
✔ Removed version2
✔ Removed version1
✔ Removed version3
-------------------
[16:42:06] Success 1.025s
```
#### dw watch
```
user@computer:~/Sites/site$ dw watch dev01
[23:22:25] Pushing current-branch-name changes to dev01-region-brand.demandware.net
  cartridges/app_controllers/README.md changed
✔ cartridges/app_controllers/README.md pushed to Cartridges/current-branch-name/app_controllers
  cartridges/app_controllers/cartridge/controllers/Home.js changed
✔ cartridges/app_controllers/cartridge/controllers/Home.js pushed to Cartridges/current-branch-name/app_controllers/cartridge/controllers
⠙ Watching 'cartridges' [Ctrl-C to Cancel]
```
#### dw log
```
user@computer:~/Sites/site$ dw log help
dw log <instance>

Options:
  --help           Show help                                            [boolean]
  --version        Show version number                                  [boolean]
  --poll-interval  Polling interval for log (seconds)                [default: 2]
  --num-lines      Number of lines to print on each tail           [default: 100]
  --include        Log levels to include                    [array] [default: []]
  --exclude        Log levels to exclude                    [array] [default: []]
  --list           Output a list of available log levels         [default: false]
  --filter         Filter log messages by regexp                  [default: null]
  --length         Length to truncate a log message               [default: null]
  --no-timestamp   Stop converting timestamps to computer locale [default: false]

user@computer:~/Sites/site$ dw log dev01
[23:23:28] Streaming log files from dev01-region-brand.demandware.net
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
⠙ Streaming [Ctrl-C to Cancel]

user@computer:~/Sites/site$ dw log dev01 --include error,warn --filter '42|402' --length 100 --poll-interval 1 --num-lines 100
[16:15:34] Streaming log files from dev01-region-brand.demandware.net
error at org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:423)
error at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)
error at org.apache.catalina.connector.OutputBuffer.realWriteBytes(OutputBuffer.java:402)
error ... 42 more
error at org.apache.catalina.connector.OutputBuffer.write(OutputBuffer.java:420)
warn [2017-01-13 07:56:01.464 GMT] WARN JobThread|14022147|Export Analytics Configuration|ExportAnalytics
warn [2017-01-13 08:15:01.623 GMT] WARN wwd-pool.2 com.demandware.wwd.dr.DRBackupMgr  system JOB 4eb780bd
warn [2017-01-13 08:56:01.490 GMT] WARN JobThread|24209416|Export Analytics Configuration|ExportAnalytics
warn [2017-01-13 09:15:01.475 GMT] WARN wwd-pool.0 com.demandware.wwd.dr.DRBackupMgr  system JOB 4eb780bd
warn [2017-01-13 09:45:01.482 GMT] WARN wwd-pool.2 com.demandware.wwd.dr.DRBackupMgr  system JOB 4eb780bd
warn [2017-01-13 10:15:01.477 GMT] WARN wwd-pool.0 com.demandware.wwd.dr.DRBackupMgr  system JOB 4eb780bd
warn [2017-01-13 10:45:01.494 GMT] WARN wwd-pool.1 com.demandware.wwd.dr.DRBackupMgr  system JOB 4eb780bd
warn [2017-01-13 10:45:01.495 GMT] WARN wwd-pool.2 com.demandware.wwd.dr.DRBackupMgr  system JOB 4eb780bd
warn [2017-01-13 10:56:01.467 GMT] WARN JobThread|24209416|Export Analytics Configuration|ExportAnalytics
warn [2017-01-13 11:15:01.474 GMT] WARN wwd-pool.2 com.demandware.wwd.dr.DRBackupMgr  system JOB 4eb780bd
warn [2017-01-13 11:56:01.467 GMT] WARN JobThread|14022147|Export Analytics Configuration|ExportAnalytics
⠙ Streaming [Ctrl-C to Cancel]
```
## Installation
#### Install via NPM
```
user@computer:~/Sites/site$ npm install -g dw-cli
```
#### The way config works
Place a dw.json file in your project root directory or use `dw init`.
* Regular file config comes first.
* If instance config exists in the file it overrides regular config when using a particular instance in your command.
* Command line arguments override the config file.
#### Sandbox Dev Example
Working on a single sandbox and your cartidges are in a 'cartridges' folder in the project root?
```
{
  "hostname": "-region-brand.demandware.net",
  "username": "default-user",
  "password": "default-pass",
  "cartridges": "cartridges",
  "apiVersion": 'v16_6',
  "clientId": "client-id-from-account-dashboard",
  "clientPassword": "client-password-from-account-dashboard",
}
```
#### Another Example
Working on several sandboxes and a staging instance with two-factor auth?
```
{
  "hostname": "-region-brand.demandware.net",
  "username": "default-user",
  "password": "default-pass",
  "apiVersion": 'v16_6',
  "clientId": "client-id-from-account-dashboard",
  "clientPassword": "client-password-from-account-dashboard",

  "environments": {
    "dev02": {
      "password": "different-pass"
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
#### All Possible Config Options
```
{
  "hostname": "-region-brand.demandware.net",
  "username": "default-user",
  "password": "default-pass",
  "cartridges": "cartridges-root-folder",
  "apiVersion": "v16_6",
  "clientId": "client-id-from-account-dashboard",
  "clientPassword": "client-password-from-account-dashboard",
  "webdav": "cert.staging.region.brand.demandware.net",
  "key": "./user.key",
  "cert": "./user.pem",
  "ca": "./staging.cert"
}
```
#### Sandbox Instances
For sandbox instances, I try to keep all of mine consistent as far as usernames and passwords go, so that is why we have the global default 'hostname' postfix, 'username', and 'password' config fields.  When you type in something like `dw push dev01`, the 'hostname' will converted to 'dev01-region-brand.demandware.net'.  If you need to override any settings per instance, you can do that in 'instances', as seen above with a scenario where the dev02 sandbox instance has a different password than the rest (yay strict af demandware password policy).
#### Staging
For staging, if you are using a custom hostname, you can fill that into 'hostname'.
##### Two-factor Auth and WebDAV
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
