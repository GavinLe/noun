/**
 * Created by clude on 4/26/17.
 */

class JsonResult {
  constructor(message, data, errcode) {
    this.message = null;
    this.data = null;
    this.errcode = 0;

    if (message) this.message = message;
    if (data) this.data = data;
    if (errcode) this.errcode = errcode;
  }
}

class JsonResultSuccess extends JsonResult {
  constructor(data) {
    super(null, data, 0);
  }
}

class JsonResultFailed extends JsonResult {
  constructor(err) {
    super(null, null, -1);

    if (typeof (err) === 'object') {
      if (err.code) this.errcode = err.code;
      // if(err.status) this.status = err.status;
      if (err.message) this.message = err.message;
    } else {
      this.message = err;
    }
  }
}

exports.JsonResult = JsonResult;
exports.JsonResultSuccess = JsonResultSuccess;
exports.JsonResultFailed = JsonResultFailed;
