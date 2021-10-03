const jwt = require("jsonwebtoken");
const db = require("../db/db.json");

const verifyJwtToken = (token) => {
  let parsedToken = token;
  if (token.toLowerCase().startsWith("bearer")) {
    [, parsedToken] = token.split(" ");
  }
  const secret = process.env.JWT_SECRET;
  const decoded = jwt.verify(parsedToken, secret);
  return decoded;
};

module.exports = (req, res, next) => {
  if (req.url === "/login" || req.url === "/register") {
    next();
    return;
  }
  const authorization = req.headers["authorization"];
  if (!authorization) {
    res.status(401).send({
      errorCode: "AUTHORIZATION_ERROR",
      message: "No authorization provided",
    });
    return;
  }
  try {
    const { data: tokenUser } = verifyJwtToken(authorization);
    const user = db.users.find((u) => u.id === tokenUser.id);
    if (!user) {
      res.status(401).send({
        errorCode: "INVALID_TOKEN",
        message: "User not found",
      });
      return;
    }
    req.user = tokenUser;
  } catch (error) {
    res.status(401).send({
      errorCode: "INVALID_TOKEN",
      message: "invalid token",
    });
    return;
  }
  next();
};
