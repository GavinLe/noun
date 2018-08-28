exports.ajaxDownload = function(download_param) {
  // 此值需要与jquery ajax download 插件设置的一致
  const input_param = download_param || 'download_param';

  return function(req, res, next) {
    let param = req.body[input_param];
    let params = JSON.parse(param);
    req.body = params;

    // 设置jquery ajax download插件需要的cookie
    res.cookie('fileDownload', 'true', {httpOnly: false});
    return next();
  };
};
