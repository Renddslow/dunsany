import sower from 'sower';

import pick from './utils/pick';
import d from './utils/d';
import make from './utils/make';
import { createDeity, Deity } from './deity';
import { generateDisposition, Disposition } from './dispositions';
import { createSideboardRelationship, invertRelationship } from './relationships';

// TODO: workshop these. I like them conceptually, especially for competing
// pantheons, but need to think through implications/balance
const ages = ['ancient', 'new', 'old', 'original', 'young'] as const;

interface Pantheon {
  dispositions: Array<Disposition>;
  age: typeof ages[number];
  chief?: string; // deity.id
  chiefSpouse?: string;
  deities: Array<Deity>;
  seed: string;
}

const createPantheon = (seed: string = sower.silly()): Pantheon => {
  const dispositions = make(3).map((_, idx) => generateDisposition(seed + (idx * 4.28).toString()));

  const chief = createDeity(seed + 'chief', dispositions, []);

  const sideBoard = make(10, seed)
    .reduce((acc, _, idx) => {
      const currentArchs = [chief.archetype, ...acc.map(({ archetype }) => archetype)];
      acc.push(
        createDeity(seed + (idx * 3.14).toString() + 'sideboard', dispositions, currentArchs),
      );
      return acc;
    }, [])
    .map(createSideboardRelationship(chief.id, seed));

  chief.relationships = sideBoard.reduce((acc, { id, relationships }) => {
    if (relationships.length) {
      acc.push(
        ...relationships.map((r) => {
          const rel = invertRelationship(r, chief);
          rel.deityId = id;
          return rel;
        }),
      );
    }
    return acc;
  }, []);

  const shouldBeMatriarch = chief.gender === 'female' && d(50, seed) === 50;
  const selfReproducing = shouldBeMatriarch || chief.gender === 'hermaphrodite';
  const spouse = selfReproducing
    ? { id: chief.id }
    : createDeity(seed + 'spouse', dispositions, []);

  const consorts = [
    { first: chief.id, second: spouse.id },
    ...make(8, seed + 'chief-consorts').map(() => ({ first: chief.id, second: 'anon' })),
    ...(selfReproducing
      ? []
      : make(8, seed + 'spouse-consorts').map(() => ({ first: spouse.id, second: 'anon' }))),
  ];

  console.log('SIDEBOARD', sideBoard);
  console.log('CHIEF', chief);
  console.log(seed);

  return {
    deities: [],
    chief: chief.id,
    chiefSpouse: !selfReproducing && spouse.id,
    age: pick(ages, seed),
    dispositions,
    seed,
  };
};

createPantheon();
