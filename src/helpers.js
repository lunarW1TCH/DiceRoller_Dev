export const paths = function () {
  const iconD4 = require('./../img/dice-d4.png');
  const iconD6 = require('./../img/dice-d6.png');
  const iconD8 = require('./../img/dice-d8.png');
  const iconD10 = require('./../img/dice-d10.png');
  const iconD12 = require('./../img/dice-d12.png');
  const iconD20 = require('./../img/dice-d20.png');

  const paths = {
    4: iconD4,
    6: iconD6,
    8: iconD8,
    10: iconD10,
    12: iconD12,
    20: iconD20,
  };

  return paths;
};

export const convertIndexIntoDiceSides = function (index) {
  if (index === 0) return 4;
  if (index === 1) return 6;
  if (index === 2) return 8;
  if (index === 3) return 10;
  if (index === 4) return 12;
  if (index === 5) return 20;
  return 0;
};

export const getRandomInt = function (max) {
  return Math.floor(Math.random() * max) + 1;
};

export const sleep = function (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};
