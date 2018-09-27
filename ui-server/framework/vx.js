/**
 * Created by gavin on 18/8/24.
 */
;(function() {
  var vx = { version: '1.0' };

  vx.wrap = fn => (...args) => fn(...args).catch(args[2]);

  vx.promisify = fn => (...args) => {
    return new Promise(function (resolve, reject) {
      args.push(function (err, result) {
        if (err) reject(err);
        else resolve(result);
      });
      fn(...args);
    });
  };

  vx.sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = vx;
    }
    exports.vx = vx;
  }
}).call(this);
