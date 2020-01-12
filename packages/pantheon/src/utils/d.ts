import mediator from './mediator';

export default (d: number): number => Math.ceil(mediator.call('random') * d);
