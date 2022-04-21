const { validateToken } = require('../utils/jwt.utils');

/**
 * middleware to check whether user has access to a specific endpoint
 *
 * @param allowedAccessTypes list of allowed access types of a specific endpoint
 */
const authorize = (allowedAccessTypes) => async (req, res, next) => {
  try {
    let jwt = req.headers.authorization;
    if (!allowedAccessTypes.length) {
      next()
      return
    }

    // verify request has token
    if (!jwt) {
      return res.status(401).json({ message: 'Invalid token ' });
    }

    // remove Bearer if using Bearer Authorization mechanism
    if (jwt.toLowerCase().startsWith('bearer')) {
      jwt = jwt.slice('bearer'.length).trim();
    }

    // verify token hasn't expired yet
    const decodedToken = await validateToken(jwt);

  // Will be used when we have roles in User Table
    // const hasAccessToEndpoint = allowedAccessTypes.some(
    //   (at) => decodedToken.role === at
    // );

    // if (!hasAccessToEndpoint) {
    //   return res.status(401).json({ message: 'No enough privileges to access endpoint' });
    // }
    req.customer = decodedToken

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Expired token' });
      return;
    }
    res.status(500).json({ message: 'Failed to authenticate user' });
  }
};

exports.authorize = authorize
