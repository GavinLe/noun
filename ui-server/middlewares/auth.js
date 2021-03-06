/**
 * Created by gavin on 17/12/20.
 */
const TokenService = require('../framework').$token;
const constants = require('../lookups').$constants;
const _ = require('underscore');

const noAuth = ['/ping', '/login']; // 无需权限的白名单

exports.preauth = function() {
  return async function(req, res, next) {
    if (req.cuser || noAuth.includes(req.url)) {
      return next();
    }
    try {
      let jwt = req.cookies[constants.JWT_COOKIE_KEY];
      if (!_.isEmpty(jwt)) {
        let dToken = await TokenService.validateToken(jwt);
        if (dToken) {
          req.cuser = {
            id: dToken.id,
            name: dToken.user_name,
            roles: dToken.authorities
          };
          return next();
        } else {
          return res.json_error('无效的访问令牌', 990);
        }
      } else {
        return res.json_error('无效的访问令牌', 990);
      }
    } catch (e) {
      return res.json_error('访问令牌不存在！', 990);
    }
  };
};

exports.userRequired = function(req, res, next) {
  if (req.cuser) {
    return next();
  } else {
    if (req.xhr) {
      return res.json_error('user required', 990);
    } else {
      return res.redirect('/login');
    }
  }
};

const ACL = {
  GUEST: 1,
  LOGIN: 2
};

const _getUserRole = function(req) {
  // 获取用户等级
  const cuser = req.cuser;

  let uRole = ACL.GUEST;
  if (cuser) {
    uRole = ACL.LOGIN;
  } else {
    uRole = ACL.GUEST;
  }
  return uRole;
};

exports.accessLevel = function(acl) {
  return function(req, res, next) {
    const isAjax = req.xhr;
    const uRole = _getUserRole(req);
    if (uRole >= acl) {
      return next();
    } else {
      if (isAjax) {
        req.logger.error(`没有权限访问 Role: [ ${uRole} ] Url: ${req.originalUrl}`);
        return res.json_error('登录超时，请重新登录', 990);
      } else {
        return res.redirect('/login');
      }
    }
  };
};

exports.ACL = ACL;
