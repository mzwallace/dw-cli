const path = require('path');
const express = require('express');
const app = express();
const jsDAV = require('jsDAV/lib/jsdav');
const basicAuth = require('basic-auth');

function makeServer() {
  const auth = function (username, password) {
    return function (req, res, next) {
      const user = basicAuth(req);

      if (!user || user.name !== username || user.pass !== password) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.sendStatus(401);
      }

      next();
    };
  };

  const logger = function (req, res, next) {
    console.log(req.url);
    next();
  };

  app.use(logger);

  app.use((req, res) => {
    jsDAV.mount({
      node: path.join(__dirname, 'data'),
      mount: '/on/demandware.servlet/webdav/Sites/Cartridges/',
      server: req.app,
      standalone: false
    }).exec(req, res);
  });

  app.use('*', auth('test', 'test'));

  return app.listen(3000, () => {
    console.log('Test server started');
  });
}

module.exports = makeServer;
