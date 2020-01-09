import cuid from 'cuid';

import archetypes, { Archetype } from './archetypes';
import { RelationshipTypes } from './relationships';
import generateName from './lib/generateName';
import d from './utils/d';
import pick from './utils/pick';
import { Disposition, getRandomAdjacentDisposition } from './dispositions';

const genders = ['male', 'female', 'hermaphrodite'] as const;

export interface Deity {
  name: string;
  archetype: Archetype;
  relationships?: Array<Relationship>;
  id: string;
  gender: typeof genders[number];
  characteristics: {
    real: boolean;
    reliability: number; // 0-1
    dead: boolean;
    // TODO: add more characteristics. Things like jovialness (?), drunkeness, etc.
  };
  disposition: Disposition;
}

export interface Relationship {
  type: RelationshipTypes;
  consort: boolean;
  eris: number; // 0-1
  eros: number; // 0-1
  philo: number; // 0-1
  agape: number; // 0-1
  deityId: string;
}

const getGender = (seed) => {
  const genderRoll = d(100, seed);

  if (genderRoll > 98) {
    return 'hermaphrodite';
  }

  return genderRoll % 2 ? 'male' : 'female';
};

export const createDeity = (
  seed: string,
  dispositions: Array<Disposition>,
  currentArchetypes: Array<Archetype>,
): Deity => {
  const canHaveRival = d(30, seed) === 30;
  const availableArchetypes = canHaveRival
    ? archetypes
    : archetypes.filter((a) => !currentArchetypes.includes(a));
  const archetype = pick(availableArchetypes, seed);

  return {
    name: generateName(seed),
    gender: getGender(seed),
    archetype,
    relationships: [],
    id: cuid(),
    characteristics: {
      real: d(50, seed) !== 50,
      reliability: Math.random(),
      dead: d(100, seed) === 100,
    },
    disposition: getRandomAdjacentDisposition(seed, dispositions),
  };
};
