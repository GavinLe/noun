const redis = require('ioredis');

if (!global.conf) {
  throw new Error('Global conf is not defined！');
}
const conf = global.conf;
const _cacheRedis = {};

const Redis = {
  getRedis: (db = 0) => {
    if (!_cacheRedis[db]) {
      _cacheRedis[db] = new Redis(Object.assign(conf.redis, {db: db}));
    }
    return _cacheRedis[db];
  },
  get(k, db, callback) {
    db = db || 0;
    this.getRedis(db).get(k, (err, data) => {
      callback(data);
    });
  },
  add(k, v, db, expire) {
    db = db || 0;
    if (expire) {
      this.getRedis(db).set(k, v, expire);
    } else {
      this.getRedis(db).set(k, v);
    }
  },
  updateExpire(k, expire, db) {
    db = db || 0;
    this.getRedis(db).expire(k, expire);
  },
  remove(key, db) {
    db = db || 0;
    this.getRedis(db).del(key);
  }
};

module.exports = Redis;
