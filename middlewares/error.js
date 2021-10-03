const { getRandom } = require("../helper/random");

module.exports = (req, res, next) => {
  const randomNumber = getRandom(0, 100);
  if (randomNumber <= 10) {
    res.status(500).json({
      message: "CONTROLLED ERROR",
      errorCode: "CONTROLLED_ERROR",
    });
    return;
  }
  next();
};
