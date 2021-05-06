import https from 'node:https';

export interface DWArgv {
  username: string;
  password: string;
  hostname: string;
  apiVersion: string;
  clientId: string;
  clientPassword: string;
  codeVersion: string;
  cartridges: string;
  webdav: string;
  key: string;
  cert: string;
  ca: string;
  p12: string;
  passphrase: string;
  request: ArgvRequest;

  silent: boolean;
  spinner: boolean;
  remove: boolean;
}

type ArgvRequest = {
  baseURL: string;
  auth: {username: string; password: string};
  httpsAgent: https.Agent;
};
