var {JsonResult, JsonResultFailed} = require('../models');
const shortid = require('js-shortid');

const _isJsonFailed = function(obj) {
  return obj && obj.errcode;
};

const errGlobal = (opt = {view: 'errors/global'}) => {
  return (err, req, res, next) => {
    let errorCode = shortid.uuid();

    if (!_isJsonFailed(err) || err.errcode === 500) {
      req.logger.error('ErrorGlobal: ', errorCode, err, req.headers, req.cookies);
    } else {
      req.logger.warn(err);
    }

    res.status(500);

    // respond with json
    if (req.xhr) {
      if (err && err.code === 'EBADCSRFTOKEN') {
        var rst = new JsonResultFailed(err);
        rst.errcode = 990;
        return res.json(rst);
        // res.json_error(err, 990);
      } else {
        var errcode = err.hasOwnProperty('errcode') ? err.errcode : -1;
        var rst = new JsonResultFailed(err);
        rst.errcode = errcode;
        res.status(errcode.toString() === '-1' ? 500 : 200);
        res.json(rst);
        // res.json_error(err, status);
      }
    } else if (req.accepts('html')) {
      // res.render_tpl('home/exception', {title: 'Exception', errors: err});
      return res.render(opt.view, {
        message: errorCode,
        error: err
      });
    } else {
      res.type('txt').send(err);
    }
  }
};

const err404 = (opt = {view: 'errors/404'}) => {
  return (req, res, next) => {
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
      // res.render_tpl('errors/404', {title: 'Page Not Found'});
      res.render(opt.view, {title: 'Page Not Found'});
      return;
    }

    // respond with json
    if (req.xhr || req.accepts('json')) {
      var rst = new JsonResult(404, 'Not Found');
      return res.json(rst);
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
  }
}

exports.global = errGlobal;
exports.pageNotFound = err404;