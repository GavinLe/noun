/**
 * node server dev env
 */
const winston = require('winston');
const path = require('path');
const _ = require('underscore');
const devConfig = require('./base');
const ENV_API_SERVER = process.env.API_SERVER || 'http://192.168.0.51:8888';

const overideConfig = {
  env: 'uat',
  proxyStatic: false,
  compression: true,
  dumpException: true,
  viewCache: true,
  app_host: ENV_API_SERVER,
  session: {
    cookieName: 'nspsession',
    secret: 'VAdminTsf4grt4drgsdFSDNsp',
    isRedisStore: true,
    redisOption: {
      host: '192.168.0.41',
      port: 6379,
      ttl: 30 * 60 // 30 分钟
    },
    maxAge: null
  },
  redis: {
    host: '192.168.0.41',
    port: 6379
  }
};

module.exports = _.extend({}, devConfig, overideConfig);
