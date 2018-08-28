/**
 * Created by gavin on 17/6/16.
 */
const express     = require('express');
const expressExt  = require('./middlewares/express.ext');
const bodyParser  = require('body-parser');
const morgan      = require('morgan');
const mongoose    = require('mongoose');
const jwt         = require('jsonwebtoken'); // 使用jwt签名
const mwError     = require('./middlewares/error');
const fileUpload  = require('express-fileupload');
const routes      = require('./routes');
const logger = require('./framework').$logger;

const conf = global.conf || require('./conf');
global.logger = logger.build(conf.log_setting.default);


let setupApp = function(conf) {
  conf = conf || require('./conf');
  global.conf = conf;
  global.logger = global.logger || logger.build(conf.log_setting.default);
  // 扩展Express方法
  expressExt(express);

  var app = express();

  // 设置全局环境变量，此参数可不比设置了
  app.set('env', conf.env);

  // 设置Web服务运行端口
  app.set('port', process.env.PORT || conf.port);

  // 配置模板引擎为EJS，并设置是否Cache模板，开发环境不cache模板，便于调试
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.engine('.ejs', require('ejs-mate'));
  if (conf.viewCache) {
    app.enable('view cache');
  }

  // 设置是否gzip压缩，开发环境由于不同过Nginx代理，使用node自己的压缩
  // uat, prd等环境由Nginx负责gzip压缩，node不再配置压缩功能
  if (conf.compression) {
    var compression = require('compression');
    app.use(compression());
  }

  // 设置favicon 和 静态文件路由， TODO: 为性能考虑，要考虑次路由放置的先后问题
  // app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(express.static(path.join(__dirname, 'public')));

  // 设置session处理的中间件
  // if (!conf.session.isRedisStore) {
  //   app.use(session({
  //     name: conf.session.cookieName,
  //     secret: conf.session.secret,
  //     cookie: {maxAge: conf.session.maxAge, httpOnly: conf.session.httpOnly},
  //     resave: false,
  //     saveUninitialized: false
  //   }));
  // } else {
  //   app.use(session({
  //     name: conf.session.cookieName,
  //     secret: conf.session.secret,
  //     store: new RedisStore(conf.session.redisOption),
  //     cookie: {maxAge: conf.session.maxAge, httpOnly: conf.session.httpOnly},
  //     resave: false, // set to false since connect-redis implements "Touch"
  //     saveUninitialized: false
  //   }));
  // }

  // 配置文件上传解析的中间件
  app.use(fileUpload());

  // 加载 routes
  routes(app);
  // !!! http代理在其他所有middleware之前完成 !!!
  // routes.wrap_proxy(app);
  wrap_proxy(app);

  app.use(mwError.global);

  app.use(mwError.pageNotFound);

  return app;
};

/**
 * @param app (express app)
 */
const startServer = function(app) {
  const _onError = (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  };

  const _onListening = () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log('app listening on', bind);
  };

  const port = getPort() || app.get('port') || 3000;
  app.set('port', port);
  const server = http.createServer(app);
  server.listen(port);
  server.on('error', _onError);
  server.on('listening', _onListening);
};

startServer(setupApp());

