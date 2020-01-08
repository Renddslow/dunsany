import titleize from 'titleize';

import d from '../utils/d';
import random from '../utils/pick';
import { ALLOWED_SIBLINGS } from './allowedLetters';

const VOWELS = ['a', 'e', 'i', 'o', 'u'];

const getSiblingKey = (must: boolean, could: boolean, seed: string) => {
  if (must) return 'vow';

  if (could) {
    return d(2, seed) === 1 ? 'vow' : 'con';
  }

  return 'con';
};

const getNextLetter = (max: number, seed: string) => (
  name: string,
  _: any,
  idx: number,
): string => {
  const couldBeApostrophe = !name.includes(`'`);

  if (couldBeApostrophe && d(40, seed) === 40 && idx < max - 3 && idx > 2) return `${name}'`;

  const nameSegments = name.toLowerCase().split('');
  const prev = nameSegments.slice(-1)[0];

  if (prev === `'`) {
    const allowedLetters = Object.keys(ALLOWED_SIBLINGS);
    const next = random(allowedLetters, seed);
    return name + next;
  }

  const couldBeVowel =
    nameSegments.length > 1 ? !nameSegments.slice(-2).every((l) => VOWELS.includes(l)) : true;
  const mustBeVowel =
    nameSegments.length > 1 ? nameSegments.slice(-2).every((l) => !VOWELS.includes(l)) : false;

  let siblingKey = getSiblingKey(mustBeVowel, couldBeVowel, seed);

  // if the array is empty, flip the key
  if (!ALLOWED_SIBLINGS[prev][siblingKey].length) {
    siblingKey = siblingKey === 'vow' ? 'con' : 'vow';
  }

  const siblingOptions = ALLOWED_SIBLINGS[prev][siblingKey];

  if (!siblingOptions.length) return name;

  const next = random(siblingOptions, seed) || '';

  return name + next;
};

const generateName = (seed): string => {
  const max = d(8, seed) + 3;

  const allowedLetters = Object.keys(ALLOWED_SIBLINGS);
  const firstLetter = random(allowedLetters, seed).toUpperCase();

  const name = Array(max)
    .fill(null)
    .reduce(getNextLetter(max, seed), firstLetter);
  return titleize(name.replace(/1/g, 'tz').replace(/2/g, 'ch'));
};

export default generateName;
