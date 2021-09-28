const { getRandom } = require('../helper/random');

module.exports = (req, res, next) => {
  const randomNumber = getRandom(0, 100);
  if (randomNumber <= 10) {
    res.status(404).json({
      message: 'UNKNOW ERROR',
      errorCode: 'UNKNOW_ERROR',
    });
    return;
  }
  next();
};
