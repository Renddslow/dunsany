import pick from './utils/pick';
import d from './utils/d';
import { createDeity, Deity } from './deity';
import { createRelationships } from './relationships';

// TODO: workshop these. I like them conceptually, especially for competing
// pantheons, but need to think through implications/balance
const dispositions = ['malevolent', 'dismissive', 'needy', 'caring'] as const;
const ages = ['ancient', 'new', 'old', 'original', 'young'] as const;

interface Pantheon {
  disposition: typeof dispositions[number];
  age: typeof ages[number];
  chief?: string; // deity.id
  deities: Array<Deity>;
  seed: string;
}

const createPantheon = (seed: string): Pantheon => {
  const pantheonSize = d(50, seed); // This is a nice round number just under the number of archetypes

  const deities = Array(pantheonSize)
    .fill(null)
    .reduce((acc, _, idx) => {
      const currentArchs = acc.map(({ archetype }) => archetype);
      acc.push(createDeity(seed + (idx * 3.14).toString(), currentArchs));
      return acc;
    }, []);

  const chief: Deity = pick(deities, seed);

  createRelationships(deities, seed);

  return {
    deities,
    chief: deities.length > 2 ? chief.id : null, // @ts-ignore
    age: pick(ages, seed),
    disposition: pick(dispositions, seed),
    seed,
  };
};

console.log(createPantheon('cowboy-chicken-chainsaw'));
