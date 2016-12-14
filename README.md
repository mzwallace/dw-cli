#dw-cli

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
