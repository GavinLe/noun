const util = require('util');
const {JsonResultSuccess, JsonResultFailed} = require('../models');

const isJsonFailed = function(obj) {
  return obj && obj.errcode;
};

const extendExpress = (express, fn_set_locals) => {
  const setup_global_locals = fn_set_locals || (() => {});

  // extend express/lib/response render method
  express.response.render = function(view, options, fn){
    var self = this
      , options = options || {}
      , req = this.req
      , app = req.app;
    // support callback function as second arg
    if ('function' == typeof options) {
      fn = options, options = {};
    }

    setup_global_locals(req, self);

    // merge res.locals
    options._locals = self.locals;

    // default callback to respond
    fn = fn || function(err, str){
        if (err) return req.next(err);
        self.send(str);
      };
    // render
    app.render(view, options, fn);
  };


  express.response.render_tpl = function(tpl, options, fn) {
    options = options || {};
    options = util._extend(options, {tpl_path: tpl});
    this.render('masterpage/tpl_base', options, fn);
  };

  express.response.render_error = function(errors, options, fn) {
    options = options || {};
    options = util._extend(options, {errors: errors});
    this.render('home/exception', options, fn);
  };

  express.response.json_success = function(data, code) {
    if (isNaN(code)) {
      code = 0;
    }

    var rst = new JsonResultSuccess(data);
    rst.errcode = code;

    this.json(rst);
  };

  express.response.json_error = function(error, code) {
    if (!isJsonFailed(error) || error.errcode === 500) {
      this.req.logger.error(error);
    } else {
      this.req.logger.warn(error);
    }
    if (isNaN(code)) {
      code = 1;
    }
    // var msg = this.req.i18n.__(code);
    var rst = new JsonResultFailed(error);

    this.status(code.toString() == '-1' ? 500 : 200);
    rst.errcode = code;
    this.json(rst);
  };
}

module.exports = extendExpress;
