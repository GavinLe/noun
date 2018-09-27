const LSN = {
};

var isCluster = false;

/**
 * Module Exports.
 * 系统事件和广播中心
 * @public
 */
module.exports = (function() {
  var events = {};
  var lsnCenter = {
    /**
         * 触发已注册的事件
         * @public
         */
    trigger: function(key, data) {
      var func = events[key];
      if (func) {
        return func(data);
      }
    },
    /**
         * Cluster运行模式下注册监听事件, 注册的进程都会收到事件信息
         * @public
         */
    registerCluster: function(proc) {
      isCluster = true;
      proc.on('message', function (msg) {
        if (msg.cmd) {
          lsnCenter.trigger(msg.cmd, msg.data || null);
        }
      });
    },
    /**
         * 注册监听事件及对应的回调方法
         * @public
         */
    register: function(key, callback) {
      events[key] = callback;
    },

    /**
         * 触发事件, 集群模式下需通过进程发布事件
         * @public
         */
    fire: function(key, data) {
      if (isCluster) {
        process.send({cmd: key, data: data});
      } else {
        lsnCenter.trigger(key, data);
      }
    }
  };
  return {
    LSN: LSN,
    LsnCenter: lsnCenter
  };
})();
