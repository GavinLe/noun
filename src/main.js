// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';

import ElementUI from 'element-ui';
import './assets/css/element-variables.scss';
import './assets/css/style.scss';
// import './assets/css/fonts.css';

import store from './vuex/store';
import Vuex from 'vuex';
import VueCookie from 'vue-cookie';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import supports from './supports';
import * as filters from './supports/filter';
import router from './router';

// 实例化Vue的filter
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));

NProgress.configure({ showSpinner: false });
Vue.config.productionTip = false;

Vue.use(Vuex);
Vue.use(VueCookie);
Vue.use(ElementUI);
Vue.use(supports);

const CreateApp = () => {
  /* eslint-disable no-new */
  return new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app');
};

store.dispatch('doInitSession')
  .then(rst => {
    CreateApp();
  })
  .catch(e => {
    CreateApp();
  });
