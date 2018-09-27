/**
 * Created by gavin on 18/4/17.
 */
import supports from 'supports';
const $fetch = supports.$fetch;

class UserApi {
  signIn(args, options) {
    options = options || {};
    let loginParams = { username: args.username, password: args.password };
    return $fetch.postForm('/noun/api/login', loginParams, options).then(rst => {
      return {errcode: 0, data: rst};
    });
  };

  signOut() {
    return $fetch.get('/noun/api/logout');
  };

  getUserInfo (params, options) {
    return $fetch.get('/noun/api/user/info', params);
  };

  ping(params) {
    return $fetch.get('/noun/api/ping', {});
  }
}

export default new UserApi();
