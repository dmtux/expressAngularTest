'use strict';

module.exports = (app, passport, models, logger) => {
  require('./user')(app, passport, models, logger);
  require('./home')(app);
};