const redis = require("ioredis");

if (!global.conf) {
  throw new Error('Global conf is not defined！')
}
const conf = global.conf;
const _cacheRedis = {};
/**
 * @param opt
 * @returns {*}
 * @private
 */
const _getRedisClient = (db = 0) => {
  if(!_cacheRedis[db]) {
    _cacheRedis[db] = new redis(Object.assign(conf.redis, {db: db}));
  }
  return _cacheRedis[db];
}

exports.getRedis = _getRedisClient;
