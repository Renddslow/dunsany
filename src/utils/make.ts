import d from './d';

export default (number: number, seed?: string) =>
  seed ? Array(d(number, seed)).fill(null) : Array(number).fill(null);
