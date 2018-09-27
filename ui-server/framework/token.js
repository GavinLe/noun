if (!global.conf) {
  global.conf = require('../conf');
}
const config = global.conf;
const express_jwt = require('express-jwt');
const redis = require('./redis');
const jwt = require('jsonwebtoken');
const unless = require('express-unless');

const token = {
  SECRET: config.jwt.secret, // token secret
  sign: (user) => {
    return jwt.sign(user, config.jwt.secret);
  },
  createToken: function(object, expiresIn = config.jwt.expiresIn, secret = config.jwt.secret) {
    if (object.exp && expiresIn) {
      delete object.exp;
    }
    return jwt.sign(object, secret, { expiresIn });
  },
  getToken: function fromHeaderOrQuerystring(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  },
  validToken: express_jwt({
    secret: SECRET,
    getToken: this.getToken
  }),
  noAuthorization: (err, req, res, next) => {
    if (err.status == 401) {
      res.json(err);
      return;
    }
    next();
  },
  // token在redis中存在，更新有效期，不存在说明已退出登录
  checkRedis: (req, res, next) => {
    const tok = token.getToken(req);
    redis.get(tok, (data) => {
      if (data) {
        // token 在redis中存在，延长过期时间
        redis.updateExpire(tok);
        next();
      } else {
        next(10005);
      }
    });
  },
  add: (tok) => {
    redis.add(tok);
  },
  remove: (req) => {
    const tok = token.getToken(req);
    tok && redis.remove(tok);
  }
};
token.checkRedis.unless = unless;

module.exports = token;

// var token = TokenService.createToken({user: 10000});
// var req = {
//   body: {},
//   params: {},
//   headers: {
//     authorization: token
//   }
// }
// TokenService.validateToken(req).then(rst=>console.log(rst)).catch(e=>console.log(e));
