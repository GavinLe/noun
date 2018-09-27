'use strict';
module.exports = {
  NODE_ENV: '"production"',
  YS_ENV: JSON.stringify(process.env.YS_ENV || 'prod')
};
