const ServiceClient = require('../framework').$ServiceClient;
const sc = new ServiceClient();
const url = require('url');

const _wrap = fn => (req, res, next) => fn(req, res, next).catch((e) => {
  if (e.response && e.response.data) {
    const tmp = e.response.data;
    const eRst = {
      errcode: tmp.errcode || 1,
      message: tmp.message || 'failed!'
    };
    res.json(eRst);
  } else {
    res.send(e);
  }
});
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

const simpleProxy = (targetUrl, options) => {
  return _wrap(async (req, res, next) => {
    var method = req.method.toUpperCase();
    const search = url.parse(req.url).search;
    const data = (method == 'POST' || method == 'PUT' || method == 'PATCH') ? req.body : null;
    let opt = {
      method: method,
      url: `${targetUrl.replace(/\/$/, '')}/${search}`,
      data: data,
      response: res
    };
    const rst = await sc.request(opt);
    return res.json(rst);
  });
};

// exports.wrap = _wrap;

const simpleGoTo = (targetUrl) => {
  return _wrap(async (req, res, next) => {
    const user = req.user.name;
    const params = {companyCode: user};
    const rst = await sc.postQuery(targetUrl, req.body, params, {response: res});
    return res.json(rst);
  });
}

const getGoTo = (targetUrl) => {
  return _wrap(async (req, res, next) => {
    const param = req.query;
    const rst = await sc.get(targetUrl, param, { response: res });
    return res.send(rst);
  });
}

const postGoTo = (targetUrl) => {
  return _wrap(async (req, res, next) => {
    const data = req.body;
    const rst = await sc.post(targetUrl, data, { response: res });
    return res.json(rst);
  });
}

const postQueryGoTo = (targetUrl) => {
  return _wrap(async (req, res, next) => {
    const params = req.query;
    const data = req.body;
    const rst = await sc.postQuery(targetUrl, data, params, { response: res });
    return res.json(rst);
  });
}

module.exports = {
  wrap: _wrap,
  simpleGoTo,
  getGoTo,
  postGoTo,
  postQueryGoTo
};
