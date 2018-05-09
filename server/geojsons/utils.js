const zeroFill = (number, width) => {
  const padWidth = width - number.toString().length;
  if (width > 0) {
    return new Array(padWidth + (/\./.test(number) ? 2 : 1)).join('0') + number;
  }
  return number + ""; // always return a string
}

module.exports = {
  zeroFill: zeroFill
};
