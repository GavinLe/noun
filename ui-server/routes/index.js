/**
 * Created by clude on 4/17/18.
 */
const express = require('express');
const bodyParser = require('body-parser');

const mwFileDownload = require('../middlewares/file.download');
const {getGoTo, postGoTo, postQueryGoTo, simpleGoTo} = require('../middlewares/proxy');
const {ACL, accessLevel} = require('../middlewares/auth');
const proxyAuth = require('./proxy-auth');

/**
 * 导出nsp api 相关路由
 * @param app
 */
module.exports = function (app) {
  const bodyParserJson = bodyParser.json({limit: '1000kb'});
  const bodyParserUrlEncoded = bodyParser.urlencoded({extended: false, limit: '1000kb'});

  //api
  app.use('/api', bodyParserJson, bodyParserUrlEncoded, preauth(), apiRouter());
};

const apiRouter = function () {
  const router = express.Router();
  router.get('/ping', vcUser.apis.ping); // 测试接口是否通
  return router;
};
