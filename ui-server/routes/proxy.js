/**
 * Created by gavin on 18/4/17.
 */

const express = require('express');
const proxy = require('http-proxy-middleware');
const rocky = require('rocky');
const conf = global.conf;

var wrap_rocky = function(app) {
  if(!conf.proxyStatic) return;
  const proxyTargetHost = conf.app_host;

  var proxy = rocky()

  const proxyTable = {
  }

  Object.keys(proxyTable).forEach(function (context) {
    var options = proxyTable[context]
    if (typeof options === 'string') {
      proxy.post(context).forward(options);
    }
  })
  app.use(proxy.middleware())
}

var wrap_proxy = function(app){
  if(!conf.proxyStatic) return;

  const proxyTargetHost = conf.app_host;

  const proxyTable = {
    '/__webpack_hmr': conf.static_host,
    '/sockjs-node': conf.static_host.replace('http', 'ws'),
    '/static': conf.static_host,
    // '/uac': 'http://127.0.0.1:9991'
  }

  // proxy api requests
  Object.keys(proxyTable).forEach(function (context) {
    var options = proxyTable[context];
    if (typeof options === 'string') {
      options = {
        target: options,
        onProxyReq: function (proxyReq, req, res) {
          // add custom header to request
          if(req.cuser){
            proxyReq.setHeader('X-LE-AUTH-ID', req.cuser.id || '');
          }
        },
        changeOrigin: true
      }
    }
    app.use(proxy(options.filter || context, options))
  })
};

module.exports = wrap_proxy;
