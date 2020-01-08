import cuid from 'cuid';

import archetypes, { Archetype } from './archetypes';
import { RelationshipTypes } from './relationships';
import generateName from './lib/generateName';
import d from './utils/d';

const genders = ['male', 'female', 'hermaphrodite', 'none'] as const;

export interface Deity {
  name: string;
  archetype: Archetype;
  relationships?: Array<Relationship>;
  backstory: string;
  id: string;
  gender: typeof genders[number];
  characteristics: {
    real: boolean;
    reliability: number; // 0-1
    dead: boolean;
    // TODO: add more characteristics. Things like jovialness (?), drunkeness, etc.
  };
}

export interface Relationship {
  type: RelationshipTypes;
  eris: number; // 0-1
  eros: number; // 0-1
  philo: number; // 0-1
  agape: number; // 0-1
  deityId: string;
}

export const createDeity = (seed: string, currentArchetypes: Array<Archetype>): Deity => {
  // TODO: seed
  const canHaveRival = d(30, seed) === 30;
  const availableArchetypes = canHaveRival
    ? archetypes
    : archetypes.filter((a) => !currentArchetypes.includes(a));
  const archetype = availableArchetypes[d(availableArchetypes.length, seed) - 1];

  // TODO: create backstory

  return {
    name: generateName(seed),
    gender: genders[d(4, seed) - 1],
    archetype,
    relationships: [],
    id: cuid(),
    backstory: '',
    characteristics: {
      real: d(50, seed) !== 50,
      reliability: Math.random(),
      dead: d(100, seed) === 100,
    },
  };
};
