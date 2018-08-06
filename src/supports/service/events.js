/**
 * Created by gavin on 18/8/4.
 */
import Vue from 'vue';

const LSN = {
  USER_SIGN_IN: 'LSN_USER_SIGN_IN',
  USER_SIGN_OUT: 'LSN_USER_SIGN_OUT',
  SESSION_EXPIRED: 'LSN_SESSION_EXPIRED',
  COMPANY_CHANGE: 'LSN_COMPANY_CHANGE',
  LSN_SESSION_TIME_OUT: 'LSN_SESSION_TIME_OUT'
};
// 全局 bus $listener
let $listener = window.$listener = new Vue();

export {
  $listener, LSN
};
