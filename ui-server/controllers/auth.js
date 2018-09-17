
const ServiceClient = require('../framework').$ServiceClient;
const wrap = require('../framework').$vx.wrap;
const token = require('../framework').$token;
const sc = new ServiceClient();
const _ = require('underscore');


exports.pages = {

};

exports.apis = {
  ping: wrap(async function (req, res, next) {
    res.json_success('tong');
  }),
  login: wrap(async function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    if (_.isEmpty(username) || _.isEmpty(password)) {
      return res.json_error('用户名密码不能为空!');
    }
    if (password !== '123456') {
      return res.json_error('用户名密码不正确!');
    }
    let expire = 60 * 30;
    let jwtToken = token.createToken({username: username, password: password}, expire);
    res.json_success({token: jwtToken, expiresIn: expire});
  })
};
