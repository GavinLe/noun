const axiosSource = require('axios');
if (!global.conf) {
  throw new Error('Global conf is not defined！');
}
const config = global.conf;

const tough = require('tough-cookie');
const Cookie = tough.Cookie;
const http = require('http');
const https = require('https');
const util = require('util');

if (!global.logger) {
  throw new Error('Global logger is not defined！');
}

// 保持长连接，提高性能
const axios = axiosSource.create({
  timeout: 25000,
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true })
});
// just do nothing
const noop = () => {};

const defaultHeader = {
  'X-Requested-With': 'XMLHttpRequest',
  'X-Requested-By': 'ExpressClient'
};

class ServiceClient {
  constructor(options) {
    let defaultOptions = {
      app_host: '',
      flat: true,
      transferCookie: true,
      postUploadFile: false
    };
    this.defaultOptions = Object.assign({}, defaultOptions, options);
  }

  _wrap_resp_cookie(apiResponse, options) {
    if (options.transferCookie && options.response) {
      var rspCookies = apiResponse.headers['set-cookie'];
      if (rspCookies) {
        options.response.append('Set-Cookie', rspCookies);
      }
    }
  }

   _paramify(obj) {
    var str = '';
    for (var key in obj) {
      if (str !== '') {
        str += '&';
      }
      str += key + '=' + obj[key];
    }
    return str;
  }

  _wrap_options(options) {
    var opt = Object.assign({}, this.defaultOptions, options);
    if (opt.url.indexOf('/') == 0) {
      opt.url = options.app_host || config.app_host + opt.url;
    }
    return opt;
  }

  _wrap_header(options) {
    options.headers = Object.assign({}, defaultHeader, options.headers);
    if (options.method && options.method.toLowerCase() !== 'get') {
      options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
    }
    const req = options.request || (options.response ? options.response.req : null);
    if (req) {
      // wrap jwt token AUTH_TOKEN
      if (req.cookies['AUTH_TOKEN']) {
        options.headers['Authorization'] = `bearer ${req.cookies['AUTH_TOKEN']}`;
      } else if (req.headers['Authorization']) {
        options.headers['Authorization'] = req.headers['Authorization'];
      }
    }
    options.credentials = 'same-origin'; // 保证传送cookie
    return options;
  }

  status(response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    } else if (response.status === 404) {
      throw 'Api not found';
    }
    throw response;
  };

  request(options) {
    options = options || {};
    options = this._wrap_options(options);
    options = this._wrap_header(options);
    const req = options.request || (options.response ? options.response.req : null);
    const logger = (req && req.logger) || global.logger;
    logger.debug('start request url: %s, params: %j, data: %j', options.url, options.params, options.data);
    return new Promise((resolve, reject) => {
      axios.request(options)
        .then(rsp => {
          this._wrap_resp_cookie(rsp, options);
          if (rsp.status === 200) {
            logger.debug('http response url: %s, params: %j, data: %j, result: %j', options.url, options.params, options.data, rsp.data);
            resolve(rsp);
          } else {
            reject('rsp http status error', rsp);
          }
        })
        .catch(e => {
          let error = new Date() + ' ' + e;
          if (e.response && e.response.data && e.response.data.message) {
            error = util.format('Remote Api Failed: path: %s message: %s', e.request ? e.request.path : '', e.response.data.message);
            logger.error('failed to post request url: %s, params: %j, data: %j, error: %s', options.url, options.params, options.data, error);
            return reject(e.response.data);
          }
          logger.error('failed to post request url: %s, params: %j, data: %j, error: %s', options.url, options.params, options.data, error);
          if (e && e.message) {
            if (e.response && e.response.data) {
              e.message = e.message + ',' + JSON.stringify(e.response.data);
            }
          }
          reject(e);
        });
    });
  };

  get(url, params, options) {
    options = options || {};
    options.method = 'GET';
    options.url = url;
    options.params = params || {};
    options.params['ts'] = new Date().getTime();
    return this.request(options);
  };

  post(url, data, options) {
    options = options || {};
    options.method = 'POST';
    options.url = url;
    options.data = data;
    return this.request(options);
  };

  postQuery(url, data, params, options) {
    if (params) {
      var getParams = this._paramify(params);
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

  delete(url, options, params) {
    if (params) {
      var getParams = this._paramify(params);
      url += `?${getParams}`;
    }
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
    options.data = this._paramify(data);
    return this.request(options);
  };

  download(url, data, option) {
    options = options || {};
    options.method = 'POST';
    options.headers = {'Content-Type': 'application/octet-stream; charset=utf-8'};
    options.url = url;
    options.data = data;
    return this.request(options);
  };
};

module.exports = ServiceClient;


