const getRandomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min;
};

module.exports = (req, res, next) => {
    const randomNumber = getRandomArbitrary(0, 100);
    if (randomNumber <= 15) {
        res.status(404).json({
          message: 'UNKNOW ERROR',
          errorCode: 'UNKNOW_ERROR',
        });
        return;
    }
  next();
};
