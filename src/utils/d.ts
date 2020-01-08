import seedrandom from 'seedrandom';

export default (d: number, seed: string): number =>
  Math.ceil(seedrandom(seed.padEnd(d, seed))() * d);
