import make from './utils/make';
import { createDeity, Relationship } from './deity';
import { Disposition } from './dispositions';
import { Archetype } from './archetypes';
import d from './utils/d';
import { createRelationship } from './relationships';

const createParentalRelationships = (seed, deity, first, second) => {
  const firstRelationship = createRelationship(
    deity.gender !== 'female' ? 'son' : 'daughter',
    first,
    false,
    seed + first + deity.id,
  );
  return first === second || second === 'anon'
    ? [firstRelationship]
    : [
        firstRelationship,
        createRelationship(
          deity.gender !== 'female' ? 'son' : 'daughter',
          second,
          false,
          seed + second + deity.id,
        ),
      ];
};

export const reproduce = (
  seed: string,
  dispositions: Array<Disposition>,
  archetypes: Array<Archetype>,
) => ({
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

  const sower = (num) => seed + first + second + num.toString();
  const produceDeity = (s) => {
    const deity = createDeity(s, dispositions, archetypes);

    if (second === 'anon') {
      deity.archetype = 'demi';
    }

    deity.relationships = createParentalRelationships(seed, deity, first, second);
    parentalRelationships[first].push(
      createRelationship(
        firstGender !== 'female' ? 'father' : 'mother',
        deity.id,
        false,
        seed + first + deity.id,
      ),
    );

    if (secondGender) {
      parentalRelationships[second].push(
        createRelationship(
          secondGender !== 'female' ? 'father' : 'mother',
          deity.id,
          false,
          seed + second + deity.id,
        ),
      );
    }

    return deity;
  };

  const children = [];

  if (guarantee) {
    children.push(
      ...make(guarantee).map((_, idx) => produceDeity(sower(idx * new Date().getTime()))),
    );
  }

  let chance = 3 + children.length;

  while (true) {
    const canHaveKids = d(chance, sower(new Date().getTime() + 'can-have-kids')) === 3;

    if (!canHaveKids) break;

    const deity = produceDeity(sower(children.length * new Date().getTime()));
    children.push(deity);

    chance += 1;
  }

  return {
    parentalRelationships,
    children,
  };
};
