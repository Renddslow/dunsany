import sower from 'sower';
import seedrandom from 'seedrandom';

import pick from './utils/pick';
import d from './utils/d';
import make from './utils/make';
import mediator from './utils/mediator';

import { createDeity, Deity } from './deity';
import { generateDisposition, Disposition } from './dispositions';
import {
  createRelationship,
  createSideboardRelationship,
  invertRelationship,
} from './relationships';
import { reproduce } from './reproduce';

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
  // seed our random number generator
  mediator.provide('random', seedrandom(seed));

  const deities = [];
  const dispositions = make(3).map((_, idx) => generateDisposition());

  // Step 1: Create a chief deity
  const chief = createDeity(dispositions, []);

  // Step 2: Create a "sideboard" of deities. These are
  // potential suitors for the second generation and potential
  // relatives of the chief, children of titans and eldritch horrors.
  const sideBoard = make(10)
    .reduce((acc, _, idx) => {
      const currentArchs = [chief.archetype, ...acc.map(({ archetype }) => archetype)];
      acc.push(createDeity(dispositions, currentArchs));
      return acc;
    }, [])
    .map(createSideboardRelationship(chief.id)); // Step 3: Create relationships between chief and sideboards

  // Step 4. Assign created relationships back to the chief
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

  // Step 5. Determine if the chief should be matriarchal and self-procreating
  // if the chief is a hermaphrodite, he will also be selfReproducing.
  // Based on this, a spouse will either be created or the chief assigned
  // as spouse.
  const shouldBeMatriarch = chief.gender === 'female' && d(50) === 50;
  const selfReproducing = shouldBeMatriarch || chief.gender === 'hermaphrodite';
  const spouse = selfReproducing
    ? { id: chief.id, gender: chief.gender, relationships: [] }
    : createDeity(dispositions, []);

  spouse.relationships.push(
    createRelationship(spouse.gender !== 'female' ? 'husband' : 'wife', chief.id, true),
  );
  chief.relationships.push(
    createRelationship(chief.gender !== 'female' ? 'husband' : 'wife', spouse.id, true),
  );

  // Step 6. Put the first generation into the pantheon. This will simplify
  // looking them up for changes to relationships.
  deities.push(chief, spouse, ...sideBoard);

  // Step 7. Generate consort relationships. These are randomly created, with the chief
  // and chief's spouse being guaranteed. Anon are mortal (or animal) consorts
  // that will produce demigods.
  const consorts = [
    {
      first: chief.id,
      firstGender: chief.gender,
      second: spouse.id,
      secondGender: spouse.gender,
      guarantee: 3,
    },
    ...make(8).map(() => ({
      first: chief.id,
      firstGender: chief.gender,
      second: 'anon',
    })),
    ...(selfReproducing
      ? []
      : make(8).map(() => ({
          first: spouse.id,
          firstGender: chief.gender,
          second: 'anon',
        }))),
  ];

  // Step 8. Make babies
  const secondGeneration = consorts
    .map(
      reproduce(
        dispositions,
        deities.map(({ archetype }) => archetype),
      ),
    )
    .reduce((acc, { parentalRelationships, children }) => {
      if (!children.length) return acc;

      Object.keys(parentalRelationships)
        .filter((k) => k !== 'anon')
        .forEach((k) => {
          const idx = deities.findIndex(({ id }) => id === k);
          deities[idx].relationships.push(...parentalRelationships[k]);
        });

      acc.push(...children);
      return acc;
    }, []);

  // TODO: step 9. create consorts for all non-demigods from gen-2 against
  // all non-demigods in the pantheon.

  // TODO: step 10. make babies

  const result = {
    deities,
    chief: chief.id,
    chiefSpouse: !selfReproducing && spouse.id,
    age: pick(ages),
    dispositions,
    seed,
  };

  console.log(result);

  return result;
};

createPantheon('trevor');
