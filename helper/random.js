const getRandom = (min, max) => {
  return Math.random() * (max - min) + min;
};

module.exports = { getRandom };
