/**
 * Created by clude on 5/2/17.
 */

const cors = (allowOrigin = '*') => {
  return (req, resp, next) => {
    res.header('Access-Control-Allow-Origin', allowOrigin);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    return next();
  };
};

exports.cors = cors;
