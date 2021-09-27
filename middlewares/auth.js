const jwt = require('jsonwebtoken');

const verifyJwtToken = (token) => {
    let parsedToken = token;
    if (token.toLowerCase().startsWith('bearer')) {
      [, parsedToken] = token.split(' ');
    }
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(parsedToken, secret);
    return decoded;
};

module.exports = (req, res, next) => {
    if (req.url === '/login' || req.url === '/register') {
        next();
        return;
    }
    const authorization = req.headers['authorization'];
    if (!authorization) {
      res.status(401).send({
        message: 'no authorization provided',
        errorCode: 'AUTHORIZATION_ERROR',
      });
      return;
    }
    try {
        verifyJwtToken(authorization);
    } catch (error) {
        res.status(401).send({
            message: 'invalid token',
            errorCode: 'INVALID_TOKEN'
        });
        return;
    }
    next();
};
