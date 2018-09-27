/**
 * Created by gavin on 18/8/4.
 */

import axiosDefault from 'axios';
import NProgress from 'nprogress';
import {$listener, LSN} from './events';
// import '../libs/jquery/plugins/jquery.fileDownload';
import $store from '../../vuex/store';
var axios = axiosDefault.create();

axios.defaults.timeout = 30000;

var $httpHelper = {
  wrapHostForUrl(url) {
    return url;
  },
  setDefaultHeaders(options) {
    var defaultHeader = {
      'X-Requested-With': 'XMLHttpRequest',
      'X-Requested-By': 'noun-client',
      'Accept-Language': 'zh-CN'
    };
    if (options.method && options.method.toLowerCase() != 'get') {
      options.headers = options.headers || {};
      options.headers['Accept'] = options.headers['Accept'] || 'application/json';
      options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
    }
    options.headers = Object.assign(defaultHeader, options.headers);
    options.credentials = 'same-origin'; // 保证传送cookie
    return options;
  },

  setAuthorizationHeader(options) {
    options.headers = options.headers || {};
    return options;
  },

  setDefaultBody(options) {
    if (options.method && options.method.toLowerCase() != 'get') {
      options.body = options.body || {};
      if (options.headers['Content-Type'].toLowerCase() == 'application/json') {
        options.body = JSON.stringify(options.body);
      }
    }
    return options;
  }
};

const _paramify = function (obj) {
  var str = '';
  for (var key in obj) {
    if (str !== '') {
      str += '&';
    }
    str += key + '=' + obj[key];
  }
  return str;
};

class Http {
  status(response) {
    // console.log(response)
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    } else if (response.status == 404) {
      throw 'Api not found';
    }
    throw response;
  };

  async request(options) {
    options = options || {};
    options.retrieveCount = (options.retrieveCount || 0) + 1;
    options.showLoading = (options.showLoading == null) ? true : options.showLoading;
    options.skipToken = options.skipToken || false;
    options.skipUser = options.skipUser || false;
    options = $httpHelper.setDefaultHeaders(options);
    options = $httpHelper.setDefaultBody(options);

    $httpHelper.wrapHostForUrl(options.url);

    if (!options.skipToken) {
      const token = await $store.dispatch('getAccessToken');
      if (!_.isEmpty(token)) {
        options.headers.Authorization = 'Bearer ' + token;
      }
    }

    if (options.showLoading) {
      NProgress.start();
    }

    try {
      const result = await axios.request(options);
      if (options.showLoading) {
        NProgress.done();
      }
      if (result.status == 200) {
        var rspData = result.data;
        $listener.$emit(LSN.LSN_SESSION_TIME_OUT, null);
        if (rspData.errcode != window.undefined && rspData.errcode != null) {
          if (rspData.errcode == 0) {
            return rspData;
          } else {
            // session 过期
            if ([990, 991, 999, 901].includes(rspData.errcode)) {
              $listener.$emit(LSN.SESSION_EXPIRED, result.data);
            }
            throw rspData;
          }
        }
        return rspData;
      }
      return result;
    } catch (error) {
      $listener.$emit(LSN.LSN_SESSION_TIME_OUT, null);
      if (options.showLoading) {
        NProgress.done();
      }
      let errRst = {errcode: 1, message: 'error'};
      if (_.isString(error)) {
        errRst.message = error;
      } else if (error.errcode || error.message) {
        errRst = error;
      } else if (error.response && error.response.data && error.response.data.errcode) {
        errRst = error.response.data;
      } else if (error.code || error.statusText) {
        errRst = {errcode: 1, message: error.statusText || 'error'};
      } else {
        errRst = {errcode: 1, message: JSON.stringify(error)};
      }
      throw errRst;
    }
  };

  get(url, options) {
    options = options || {};
    options.method = 'GET';
    options.url = url;
    if (options.hasOwnProperty('params')) {
      options.params = Object.assign({}, options.params);
      options.params['ts'] = new Date().getTime();
    } else {
      options['params'] = {ts: new Date().getTime()};
    }
    return this.request(options);
  };

  post(url, data, options) {
    options = options || {};
    options.method = 'POST';
    options.url = url;
    options.data = data;
    return this.request(options);
  };

  postQuery(url, params, data, options) {
    if (params) {
      let getParams = _paramify(params);
      url += `?${getParams}`;
    }
    options = options || {};
    options.method = 'POST';
    options.url = url;
    options.data = data;
    return this.request(options);
  };

  put(url, data, options) {
    options = options || {};
    options.method = 'PUT';
    options.url = url;
    options.data = data;
    return this.request(options);
  };

  patch(url, data, options) {
    options = options || {};
    options.method = 'PATCH';
    options.url = url;
    options.data = data;
    return this.request(options);
  };

  delete(url, options) {
    options = options || {};
    options.method = 'DELETE';
    options.url = url;
    return this.request(options);
  };

  postForm(url, data, options) {
    options = options || {};
    options.method = 'POST';
    options.headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    options.url = url;
    options.data = _paramify(data);
    return this.request(options);
  };
};

export default new Http();
