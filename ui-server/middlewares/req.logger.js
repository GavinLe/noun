/**
 * request wrapper
 */
const wrapLogger = (opt = {logger: null}) => {
  return (req, resp, next) => {
    if (req.logger) return next();
    try {
      const logger = opt.logger || global.logger;

      const _log = {
        _wrapMsg: (...msg) => {
          msg.push({
            'tid': req.header('X-B3-TraceId')
            // 'sid': 'bbbb' //req.header('x-b3-spanid')
          });
          return msg;
        },

        debug: (...msg) => logger.debug(..._log._wrapMsg(...msg)),
        info: (...msg) => logger.info(..._log._wrapMsg(...msg)),
        warn: (...msg) => logger.warn(..._log._wrapMsg(...msg)),
        error: (...msg) => logger.error(..._log._wrapMsg(...msg))
      };

      req.logger = _log;

      return next();
    } catch (e) {
      req.logger = global.logger;
    }
  };
};

exports.wrapLogger = wrapLogger;
