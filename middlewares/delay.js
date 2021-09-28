const { getRandom } = require('../helper/random');

const sleep = (milliseconds) => {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
};
module.exports = (req, res, next) => {
  const time = getRandom(0, 5000);
  sleep(time);
  next();
};
