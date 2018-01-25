const addTen = (num) => {
  return num + 10;
}

const nthFib = (num) => {
  if (num === 0) return 0;
  if (num === 1) return 1;
  return nthFib(num - 1) + nthFib(num - 2);
}

module.exports = { addTen, nthFib };
