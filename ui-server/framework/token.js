const jwt = require('jsonwebtoken');
const $vx = require('./vx');

if (!global.conf) {
  global.conf = require('../conf');
}
const config = global.conf;

var promisifyVerify = $vx.promisify(jwt.verify);

var TokenService = {
  createToken: function(object, expiresIn = config.jwt.expiresIn, secret = config.jwt.secret) {
    if(object.exp && expiresIn){
      delete object.exp;
    }
    return jwt.sign(object, secret, { expiresIn });
  },

  validateToken: function(token, secret = config.jwt.secret) {
    return promisifyVerify(token, secret);
  }
}

module.exports = TokenService;

// var token = TokenService.createToken({user: 10000});
// var req = {
//   body: {},
//   params: {},
//   headers: {
//     authorization: token
//   }
// }
// TokenService.validateToken(req).then(rst=>console.log(rst)).catch(e=>console.log(e));
