import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import store from '../vuex/store';

import $vx from 'supports/util/vx';
import { gbs } from 'supports/settings/index';
import {$listener, LSN} from '../supports/service/events';

Vue.use(VueRouter);

let isInit = false;

var router = new VueRouter({
  mode: 'history',
  routes: routes
});
let UnAuthPath = [];

const routeFunc = (to, from, next) => {
  let isLogin = store.getters.isLogin;
  document.title = to.meta.title;
  // 不需要用户登录路径
  if (UnAuthPath.includes(to.path)) {
    next();
  } else {
    if (isLogin) { // 已登录
      if (to.path === '/login') {
        return next({path: '/home'})
      } else {
        return next({path: '/home'})
      }
    } else { // 未登录
      if (to.path != '/login') {
        next('/login');
      } else {
        next();
      }
    }
  }
};

router.beforeEach((to, from, next) => {
  let isSessionInit = store.getters.isInited;
  if (isSessionInit) {
    routeFunc(to, from, next);
  } else {
    store.dispatch('doInitSession')
      .then(rst => {
        routeFunc(to, from, next);
      })
      .catch(e => {
        next();
      });
  }
});

$listener.$on(LSN.SESSION_EXPIRED, (data) => {
  let next;
  if (window.location.search) {
    next = window.location.pathname + window.location.search;
  } else {
    if (window.location.href.indexOf('next') <= -1) {
      if (window.location.href.indexOf('login') <= -1) {
        next = window.location.href.replace(window.location.origin, '');
      }
    } else {
      next = window.location.pathname;
    }
  }
  if (next) {
    router.push({path: '/login', query: { next: next }});
  } else {
    router.push({path: '/login'});
  }
});

export default router;
