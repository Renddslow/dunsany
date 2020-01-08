import sower from 'sower';

import pick from './utils/pick';
import d from './utils/d';
import make from './utils/make';
import { createDeity, Deity } from './deity';
import { generateDisposition, Disposition } from './dispositions';

// TODO: workshop these. I like them conceptually, especially for competing
// pantheons, but need to think through implications/balance
const ages = ['ancient', 'new', 'old', 'original', 'young'] as const;

interface Pantheon {
  dispositions: Array<Disposition>;
  age: typeof ages[number];
  chief?: string; // deity.id
  deities: Array<Deity>;
  seed: string;
}

const createPantheon = (seed: string = sower.silly()): Pantheon => {
  const dispositions = make(3).map((_, idx) => generateDisposition(seed + (idx * 4.28).toString()));

  const chief = createDeity(seed + 'chief', dispositions, []);
  const sideBoard = make(10, seed).reduce((acc, _, idx) => {
    const currentArchs = [chief.archetype, ...acc.map(({ archetype }) => archetype)];
    acc.push(createDeity(seed + (idx * 3.14).toString() + 'sideboard', dispositions, currentArchs));
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

  console.log('CHIEF', chief);
  console.log('SPOUSE', spouse);
  console.log('CONSORTS', consorts);
  console.log(seed);

  return {
    deities: [],
    chief: chief.id,
    age: pick(ages, seed),
    dispositions,
    seed,
  };
};

createPantheon();
