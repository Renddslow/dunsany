import mediator from './mediator';

export default (arr) => {
  if (!Array.isArray(arr)) throw new Error('Expected array');
  return arr[Math.floor(mediator.call('random') * arr.length)];
};
