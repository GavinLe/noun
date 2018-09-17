const util = require('util');
const {JsonResultSuccess, JsonResultFailed} = require('../models');

const isJsonFailed = function(obj) {
  return obj && obj.errcode;
};

const extendExpress = (express, fn_set_locals) => {
  const setup_global_locals = fn_set_locals || (() => {});

  // extend express/lib/response render method
  express.response.render = function(view, opt, fn) {
    var self = this;
    let options = opt || {};
    let req = this.req;
    let app = req.app;
    // support callback function as second arg
    if ('function' == typeof opt) {
      fn = opt;
      options = {};
    }
    setup_global_locals(req, self);

    // merge res.locals
    options._locals = self.locals;

    // default callback to respond
    fn = fn || function(err, str) {
        if (err) return req.next(err);
        self.send(str);
      };
    // render
    app.render(view, options, fn);
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
      logger.error(error);
    } else {
      logger.warn(error);
    }
    if (isNaN(code)) {
      code = 1;
    }
    var rst = new JsonResultFailed(error);

    this.status(code.toString() == '-1' ? 500 : 200);
    rst.errcode = code;
    this.json(rst);
  };
};

module.exports = extendExpress;
