import make from './utils/make';
import { createDeity, Deity } from './deity';
import { Disposition } from './dispositions';
import { Archetype } from './archetypes';
import d from './utils/d';

export const reproduce = (dispositions: Array<Disposition>, archetypes: Array<Archetype>) => ({
  first,
  second,
  guarantee,
}): { children: Array<Deity>; relationships: any } => {
  const relationships = [];

  const produceDeity = () => {
    const deity = createDeity(dispositions, archetypes);

    if (second === 'anon') {
      deity.archetype = 'demi';
    }

    relationships.push({
      first,
      second: deity.id,
      action: 'beget',
    });

    if (second !== 'anon') {
      relationships.push({
        first: second,
        second: deity.id,
        action: 'beget',
      });
    }

    return deity;
  };

  const children = [];

  if (guarantee) {
    children.push(...make(guarantee).map((_, idx) => produceDeity()));
  }

  let chance = 3 + children.length;

  while (true) {
    const canHaveKids = d(chance) === 3;

    if (!canHaveKids) break;

    const deity = produceDeity();
    children.push(deity);

    chance += 1;
  }

  return {
    relationships,
    children,
  };
};
