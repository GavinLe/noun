/**
 * node server dev env
 */

const winston = require('winston');
const path = require('path');
const _ = require('underscore');

const devConfig = require('./base');

const ENV_API_SERVER = process.env.API_SERVER || 'http://192.168.0.226:8888';

const conf = {
  env: 'dev',
  proxyStatic: true,
  compression: true,
  dumpException: true,
  viewCache: false,
  app_host: ENV_API_SERVER
};

conf.log_setting = {
  default: [{
    type: 'Console',
    level: 'debug'
  }]
};

module.exports = _.extend({}, devConfig, conf);
