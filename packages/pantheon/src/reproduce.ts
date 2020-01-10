import make from './utils/make';
import { createDeity, Relationship } from './deity';
import { Disposition } from './dispositions';
import { Archetype } from './archetypes';
import d from './utils/d';
import { createRelationship } from './relationships';

const createParentalRelationships = (deity, first, second) => {
  const firstRelationship = createRelationship(
    deity.gender !== 'female' ? 'son' : 'daughter',
    first,
    false,
  );
  return first === second || second === 'anon'
    ? [firstRelationship]
    : [
        firstRelationship,
        createRelationship(deity.gender !== 'female' ? 'son' : 'daughter', second, false),
      ];
};

export const reproduce = (dispositions: Array<Disposition>, archetypes: Array<Archetype>) => ({
  first,
  firstGender,
  second,
  secondGender,
  guarantee,
}): { children: Array<Relationship>; parentalRelationships: any } => {
  const parentalRelationships = {
    [first]: [],
    [second]: [],
  };

  const produceDeity = () => {
    const deity = createDeity(dispositions, archetypes);

    if (second === 'anon') {
      deity.archetype = 'demi';
    }

    deity.relationships = createParentalRelationships(deity, first, second);
    parentalRelationships[first].push(
      createRelationship(firstGender !== 'female' ? 'father' : 'mother', deity.id, false),
    );

    if (secondGender) {
      parentalRelationships[second].push(
        createRelationship(secondGender !== 'female' ? 'father' : 'mother', deity.id, false),
      );
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
    parentalRelationships,
    children,
  };
};
