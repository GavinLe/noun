/**
 * Created by gavin on 18/4/17.
 */
import supports from 'supports';
const $fetch = supports.$fetch;

class UserApi {
  signIn(args, options) {
    options = options || {};
    let loginParams = { username: args.username, password: args.password };
    options.skipToken = true;
    /*return $fetch.postForm('/noun/api/login', loginParams, options).then(rst => {
        return {errcode: 0, data: rst};
    });*/
    return {errcode: 0, data: {id: '1', name: args.username}};
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
