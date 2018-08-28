
const ServiceClient = require('../yst-express').$services.ServiceClient;
const wrap = require('../yst-express').$vx.wrap;
const sc = new ServiceClient();

exports.pages = {

};

exports.apis = {
  ping: wrap(async function (req, res, next) {
    res.json_success('tong');
  })
};
