const zeroFill = (number, width) => {
  const padWidth = width - number.toString().length;
  if (width > 0) {
    return new Array(padWidth + (/\./.test(number) ? 2 : 1)).join('0') + number;
  }
  return number + ""; // always return a string
}

// https://stackoverflow.com/a/38327540
function groupBy(list, keyGetter) {
	const map = new Map();
	list.forEach((item) => {
		const key = keyGetter(item);
		const collection = map.get(key);
		if (!collection) {
			map.set(key, [item]);
		} else {
			collection.push(item);
		}
	});
	return map;
}

module.exports = {
  zeroFill: zeroFill,
  groupBy: groupBy
};
