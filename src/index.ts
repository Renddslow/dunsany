import d from './utils/d';
import { createDeity } from './deity';

const createPantheon = (seed: string) => {
  const pantheonSize = d(50); // This is a nice round number just under the number of archetypes

  const pantheon = Array(pantheonSize)
    .fill(null)
    .reduce((acc) => {
      const currentArchs = acc.map(({ archetype }) => archetype);
      acc.push(createDeity(seed, currentArchs));
      return acc;
    }, []);

  console.log(pantheon);

  // TODO: create relationships between deities
};

createPantheon('');
