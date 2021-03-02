const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  // Get Token From Header
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No Token, Authorization Denied!!' });
  }
  try {
    const decoded = jwt.verify(token, config.get('secretKey'));
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token Is Not Valid!!!' });
  }
};
