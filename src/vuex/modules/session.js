import userApi from 'src/api/user';

import $vx from 'supports/util/vx';
import { enums } from 'supports/settings';
import {$listener, LSN} from 'supports/service/events';

class Menu {
  id = '';
  path = '';
  leaf = false;
  iconcls = '';
  name = '';
  children = '';

  build(sm) {
    this.id = sm.id;
    this.path = sm.request;
    this.iconcls = sm.iconcls;
    this.name = sm.menuName;
    this.leaf = !!sm.leaf;
  }
};

const createMenus = function(sourceMenus) {
  return sourceMenus.map(sm => {
    let m = new Menu();
    m.build(sm);
    if (sm.menuBeans && sm.menuBeans.length > 0) {
      m.children = createMenus(sm.menuBeans);
    }
    return m;
  });
};

const createSelectCompanyInfo = function (companyInfo) {
  return {
    companyCode: companyInfo.companyCode,
    companyName: companyInfo.companyName,
    companyShortName: companyInfo.companyShortName,
    logo: companyInfo.logo
  };
};

const isLogin = !!sessionStorage.getItem('user');

const state = {
  isInited: false,
  // 页面打开默认设置登录状态为否
  isLogin: isLogin,
  // 保存登录信息
  userInfo: {
    name: '',
    id: '',
    isInitialPwd: false
  },
  // oauth token
  authToken: {
    access_token: '',
    expires_in: '',
    timestamp: ''
  },
  refreshToken: {
    refresh_token: ''
  }
};

// getters
const getters = {
  isInited (state) {
    return state.isInited;
  },
  isLogin (state) {
    return state.isLogin;
  },
  getUserInfo (state) {
    return state.userInfo;
  },
  getCollapseStatus (state) {
    return state.collapseStatus;
  }
};

// actions
const actions = {
  async doInitSession(store) {
    if (store.state.isInited) {
      return true;
    }
    store.commit('SESSION_INIT');
  },

  async signIn(store, loginInfo) {
    const rst = await userApi.signIn(loginInfo);
    if (rst.data) {
      store.commit('SESSION_LOGIN');
    }
    return true;
  },

  async signOut(store) {
    const rst = await userApi.signOut();
    actions.clearSession(store);
    store.commit('DELETE_AUTH_TOKEN');
    return true;
  },

  setUserInfo({commit}, userInfo) {
    $vx.sessionStorage.setItem('user', userInfo);
    commit('SESSION_SET_USER', userInfo);
  }
};

// mutations
const mutations = {
  // 设置登录
  SESSION_INIT (state) {
    state.isInited = true;
  },
  // 设置登录
  SESSION_LOGIN (state) {
    state.isLogin = true;
  },
  // 退出登录
  SESSION_LOGOUT (state) {
    state.isLogin = false;
    state.userInfo = {};
  },
  // 设置登录用户信息
  SESSION_SET_USER (state, userInfo) {
    state.userInfo.name = userInfo.name;
    state.userInfo.id = userInfo.id;
    state.userInfo.logo = userInfo.logo;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
