/**
 * Created by gavin on 18/8/4.
 */

const gbs = {
  ttl: 30 * 60 * 1000 // 30 * 60 * 1000 半小时无操作弹提示
};

// 根据环境参数设置变量
if (process.env.NODE_ENV === 'production') {
  if (process.env.YS_ENV === 'uat') {
    gbs.ttl = 45 * 60 * 1000;
  } else {
    gbs.ttl = 60 * 60 * 1000;
  }
}

export {
  gbs
};
