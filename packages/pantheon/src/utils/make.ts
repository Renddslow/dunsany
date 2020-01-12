import d from './d';

export default (number: number, random: boolean = false) =>
  random ? Array(d(number)).fill(null) : Array(number).fill(null);
