const winston = require('winston');
const path = require('path');
const moment = require('moment');
const util = require('util');

const ENV_API_SERVER = process.env.API_SERVER || 'http://192.168.0.251:8888';

const conf = {
  env: 'dev',
  proxyStatic: false, // 是否启用静态代理
  compression: false,
  dumpException: false,
  viewCache: true, // 页面是否开启缓存
  server: {
    port: 3000
  },

  app_host: ENV_API_SERVER,
  static_host: 'http://127.0.0.1:3500',

  cluster_workers: 1, // NodeJs Cluster 进程数设置, 可是任意小于cpu数量的值, 0 - 代表基于系统cpu数量自动计算

  session: {
    cookieName: 'nsession',
    secret: 'VAdminTsf4grt4drgsdFSD4e512',
    isRedisStore: true,
    redisOption: {
      host: '192.168.0.233',
      port: 6379,
      ttl: 30
    },
    maxAge: null
  },

  redis: {
    host: '192.168.0.233',
    port: 6379,
    retryStrategy: function (times) {
      var delay = Math.min(times * 5, 2000)
      return delay;
    }
  },
  jwt: {
    secret: 'noun-secret', // jwt 加密解密 secret
    expiresIn: 600 // 秒
  },
  mongodb: {
    'database': 'mongodb://localhost:27017/noun'
  },
  mysql: {
    host: '192.168.0.202',
    user: 'developer', // developer yoorstore
    password: '123456',
    database: 'ys_rr',
    port: 3306
  }
};

conf.docker_log_setting = {
  default: [{
    type: 'Console',
    level: 'debug',
    json: true,
    formatter: false,
    prettyPrint: false,
    timestamp: true,
    handleExceptions: true,
    stringify: (obj) => {
      obj.level = obj.level.toUpperCase();
      try {
        return JSON.stringify(obj);
      } catch (e) {
        let rst = {
          timestamp: obj.timestamp,
          level: obj.level,
          message: obj.message
        };
        if(obj.stack) rst.stack = obj.stack;
        return JSON.stringify(rst);
      }
    }
  }]
};

conf.log_setting = {
  default: [{
    type: 'Console',
    level: 'debug'
  }]
};

module.exports = conf;
