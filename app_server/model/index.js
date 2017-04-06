'use strict';

module.exports = (mongoose) => {
  return {
    user: require('./user')(mongoose)
  };
};