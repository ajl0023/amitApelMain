const map = (x, a, b, c, d) => ((x - a) * (d - c)) / (b - a) + c;

// Linear interpolation
const lerp = (a, b, n) => (1 - n) * a + n * b;
const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
export { map, lerp, getRandomNumber };
