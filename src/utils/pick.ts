import seedrandom from 'seedrandom';

export default (arr, seed) => {
  if (!Array.isArray(arr)) throw new Error('Expected array');
  return arr[Math.floor(seedrandom(seed)() * arr.length)];
};
