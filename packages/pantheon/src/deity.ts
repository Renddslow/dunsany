import cuid from 'cuid';

import archetypes, { Archetype } from './archetypes';
import generateName from './lib/generateName';
import d from './utils/d';
import pick from './utils/pick';
import { Disposition, getRandomAdjacentDisposition } from './dispositions';

const genders = ['male', 'female', 'hermaphrodite'] as const;

export interface Deity {
  name: string;
  archetype: Archetype;
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

const getGender = () => {
  const genderRoll = d(100);

  if (genderRoll > 98) {
    return 'hermaphrodite';
  }

  return genderRoll % 2 ? 'male' : 'female';
};

export const createDeity = (
  dispositions: Array<Disposition>,
  currentArchetypes: Array<Archetype>,
): Deity => {
  const canHaveRival = d(30) === 30;
  const availableArchetypes = canHaveRival
    ? archetypes
    : archetypes.filter((a) => !currentArchetypes.includes(a));
  const archetype = pick(availableArchetypes);

  return {
    name: generateName(),
    gender: getGender(),
    archetype,
    id: cuid(), // TODO: instead of CUID's create something repeatable
    characteristics: {
      real: d(50) !== 50,
      reliability: Math.random(),
      dead: d(100) === 100,
    },
    disposition: getRandomAdjacentDisposition(dispositions),
  };
};
