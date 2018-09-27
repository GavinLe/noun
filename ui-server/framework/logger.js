var winston = require('winston');
var _ = require('underscore');
var util = require('util');
var moment = require('moment');

const DEFAULT_OPTS = {
  type: 'Console',
  level: 'info',
  json: false,
  timestamp: false,
  formatter: (options) => {
    return util.format(
      '%s\t%s\t%s %s',
      options.timestamp ? options.timestamp() : moment().format('YYYY-MM-DD hh:mm:ss'),
      options.level.toUpperCase(),
      options.message || '',
      options.meta && Object.keys(options.meta).length ? (options.meta.stack || JSON.stringify(options.meta)) : ''
    );
  }
};

class Logger {
  constructor(transportOpts) {
    const opts = transportOpts || [ DEFAULT_OPTS ];
    this.default = this.build(opts);
  };
  /**
   * @param opts ( value format like DEFAULT_OPTS )
   *
   * opt.type can be 'Console' or 'File'
   */
  buildTransport(opt) {
    opt.type = opt.type || 'Console';
    const newOpts = _.extend({}, DEFAULT_OPTS, opt);
    // if(newOpts.json) {
    //   newOpts.formatter = false;
    //   // newOpts.timestamp = true;
    // }
    return new (winston.transports[opt.type])(newOpts);
  };

  build(transportOpts) {
    const self = this;
    const transports = _.map(transportOpts, (opt) => {
      return self.buildTransport(opt);
    });

    return winston.createLogger({
      transports: transports
      // exitOnError: false
    });
  };

  buildRawFileLogger(opts) {
    var defaultOpts = {
      level: 'info',
      filename: './out.log',
      timestamp: false,
      maxsize: 10485760,
      maxFiles: 10,
      showLevel: false,
      json: false,
      formatter: function(options) {
        return options.message;
      }
    };

    var newOpts = _.extend(defaultOpts, opts);

    return new (winston.Logger)({
      transports: [
        new (winston.transports.File)(newOpts)
      ]
    });
  };
}

module.exports = new Logger();
