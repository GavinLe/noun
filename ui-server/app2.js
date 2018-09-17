const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const conf = require('./conf');
const logger = require('./framework/logger');
global.conf = conf;
global.logger = logger.build(conf.log_setting.default);
const mwError = require('./middlewares/error');
const routes = require('./routes');
const wrap_proxy = require('./routes/proxy');
const expressExt = require('./middlewares/express.ext');

// 扩展Express方法
expressExt(express);

const app = express();

// view engine setup
// 配置模板引擎为EJS，并设置是否Cache模板，开发环境不cache模板，便于调试
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('.ejs', require('ejs-mate'));

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

// routers 配置
routes(app);

// routes.wrap_proxy(app);
wrap_proxy(app);

app.use(mwError.global);
app.use(mwError.pageNotFound);

module.exports = app;
