'use strict';

module.exports = (app) => {
  app.get('*', (req, res) => {
    res.sendFile(`${appRoot}/app_client/index.html`);
  });
};