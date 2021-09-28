const jwt = require('jsonwebtoken');

const createJwtToken = (data) => {
  const secret = process.env.JWT_SECRET;
  console.log(secret);
  const token = jwt.sign({ data }, secret, null);
  return token;
};
module.exports = { createJwtToken };
