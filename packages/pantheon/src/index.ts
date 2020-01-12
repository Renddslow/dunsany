import sower from 'sower';
import seedrandom from 'seedrandom';

import pick from './utils/pick';
import d from './utils/d';
import make from './utils/make';
import mediator from './utils/mediator';

import { createDeity, Deity } from './deity';
import { generateDisposition, Disposition } from './dispositions';
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
  const dispositions = make(3).map(() => generateDisposition());
  const relationships = [];

  // Step 1: Create a chief deity
  const chief = createDeity(dispositions, []);
  relationships.push({
    first: 'anon-chronos',
    second: chief.id,
    action: 'beget',
  });

  // Step 2: Create a "sideboard" of deities. These are
  // potential suitors for the second generation and potential
  // relatives of the chief, children of titans and eldritch horrors.
  const sideBoard = make(10, true).reduce((acc, _, idx) => {
    const currentArchs = [chief.archetype, ...acc.map(({ archetype }) => archetype)];
    const deity = createDeity(dispositions, currentArchs);

    if (d(10) === 8) {
      relationships.push({
        first: d(2) === 1 ? 'anon-chronos' : 'anon-uranus',
        second: deity.id,
        action: 'beget',
      });
    }

    acc.push(deity);
    return acc;
  }, []);

  // Step 3. Determine if the chief should be matriarchal and self-procreating
  // If the chief is a hermaphrodite, he will also be selfReproducing.
  // Based on this, a spouse will either be created or the chief assigned
  // as spouse.
  const shouldBeMatriarch = chief.gender === 'female' && d(50) === 50;
  const selfReproducing = shouldBeMatriarch || chief.gender === 'hermaphrodite';
  const spouse = selfReproducing
    ? { id: chief.id, gender: chief.gender, relationships: [] }
    : createDeity(dispositions, []);

  deities.push(...[chief, spouse, ...sideBoard]);

  // Step 4. Generate consort relationships. These are randomly created, with the chief
  // and chief's spouse being guaranteed. Anon are mortal (or animal) consorts
  // that will produce demigods.
  const consorts = [
    {
      first: chief.id,
      second: spouse.id,
      guarantee: 3,
    },
    ...make(8, true).map(() => ({
      first: chief.id,
      second: 'anon',
    })),
    ...(selfReproducing
      ? []
      : make(8, true).map(() => ({
          first: spouse.id,
          second: 'anon',
        }))),
  ];

  const unpackGeneration = (acc, { relationships: generatedRelationships, children }) => {
    if (!children.length) return acc;

    relationships.push(...generatedRelationships);
    acc.push(...children);
    return acc;
  };

  // Step 5. Make babies
  const secondGeneration = consorts
    .map(
      reproduce(
        dispositions,
        deities.map(({ archetype }) => archetype),
      ),
    )
    .reduce(unpackGeneration, []);
  deities.push(...secondGeneration);

  const availableConsorts = deities.filter((d) => {
    const hasTwoParents = relationships.filter(({ second }) => second === d.id);

    return hasTwoParents.length === 2;
  });

  // step 6. create consorts for all non-demigods from gen-2 against
  // all non-demigods in the pantheon.
  const secondGenConsorts = secondGeneration.reduce((acc, deity) => {
    if (d(2) !== 1) return acc;

    availableConsorts.forEach((potentialSuitor) => {
      if (potentialSuitor.id === deity.id) return;

      if (d(3) === 1) {
        acc.push({
          first: deity.id,
          second: potentialSuitor.id,
          guarantee: d(2),
        });
      }
    });

    acc.push(
      ...make(d(6), true).map(() => ({
        first: deity.id,
        second: 'anon',
      })),
    );

    return acc;
  }, []);

  deities.push(
    ...secondGenConsorts
      .map(
        reproduce(
          dispositions,
          deities.map(({ archetype }) => archetype),
        ),
      )
      .reduce(unpackGeneration, []),
  );

  // TODO: step 10. make babies

  const result = {
    deities,
    chief: chief.id,
    chiefSpouse: !selfReproducing && spouse.id,
    age: pick(ages),
    dispositions,
    seed,
    relationships,
  };

  console.log(result);

  return result;
};

// TODO: remove this call;
createPantheon(process.argv.slice(2)[0]);

export default createPantheon;
