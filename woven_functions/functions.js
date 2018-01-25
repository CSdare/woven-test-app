const addTen = (num) => {
  return num + 10;
}

const nthFib = (num) => {
  if (num === 0) return 0;
  if (num === 1) return 1;
  return nthFib(num - 1) + nthFib(num - 2);
}

const generateRandomColor = () => {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);

  return { red, green, blue };
};

module.exports = { addTen, nthFib, generateRandomColor };
