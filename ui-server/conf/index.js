const env = (process.env.NODE_ENV || 'dev').toLowerCase();
const envConf = require('./setting.' + env);
module.exports = envConf;
