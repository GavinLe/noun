/**
 * Created by gavin on 18/4/17.
 */
// 基础模块
const Login = resolve => require(['../views/auth/Login.vue'], resolve);
const ResetPassword = resolve => require(['../views/auth/ResetPassword.vue'], resolve);
const Layout = resolve => require(['../views/_layouts/MainContainer.vue'], resolve);
const NotFound = resolve => require(['../views/error/404.vue'], resolve);
// 首页
const Home = resolve => require(['../views/Home.vue'], resolve);
// router view
const RouterViewLayout = resolve => require(['../views/_layouts/RouterView.vue'], resolve);

let routes = [
  {
    path: '/login',
    component: Login,
    name: '登录',
    meta: {title: '登录'}
  },
  {
    path: '/reset/password',
    component: ResetPassword,
    name: '重置密码',
    meta: {title: '重置密码'}
  },
  {
    path: '/',
    component: Layout,
    name: '',
    children: [
      {path: '/home', component: Home, name: '首页', meta: {title: '首页'}}
    ],
    meta: {title: '首页'}
  },
  {
    path: '/404',
    component: NotFound,
    name: '',
    hidden: true,
    meta: {title: '404'}
  },
  {
    path: '*',
    hidden: true,
    redirect: {path: '/404'},
    meta: {title: '404'}
  }
];

export default routes;
