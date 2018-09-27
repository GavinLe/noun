'use strict';
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  YS_ENV: JSON.stringify(process.env.YS_ENV || 'dev')
});
