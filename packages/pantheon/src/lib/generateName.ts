import titleize from 'titleize';

import d from '../utils/d';
import pick from '../utils/pick';
import { ALLOWED_SIBLINGS } from './allowedLetters';

const VOWELS = ['a', 'e', 'i', 'o', 'u'];

const getSiblingKey = (must: boolean, could: boolean) => {
  if (must) return 'vow';

  if (could) {
    return d(2) === 1 ? 'vow' : 'con';
  }

  return 'con';
};

const getNextLetter = (max: number) => (name: string, _: any, idx: number): string => {
  const couldBeApostrophe = !name.includes(`'`);

  if (couldBeApostrophe && d(40) === 40 && idx < max - 3 && idx > 2) return `${name}'`;

  const nameSegments = name.toLowerCase().split('');
  const prev = nameSegments.slice(-1)[0];

  if (prev === `'`) {
    const allowedLetters = Object.keys(ALLOWED_SIBLINGS);
    const next = pick(allowedLetters);
    return name + next;
  }

  const couldBeVowel =
    nameSegments.length > 1 ? !nameSegments.slice(-2).every((l) => VOWELS.includes(l)) : true;
  const mustBeVowel =
    nameSegments.length > 1 ? nameSegments.slice(-2).every((l) => !VOWELS.includes(l)) : false;

  let siblingKey = getSiblingKey(mustBeVowel, couldBeVowel);

  // if the array is empty, flip the key
  if (!ALLOWED_SIBLINGS[prev][siblingKey].length) {
    siblingKey = siblingKey === 'vow' ? 'con' : 'vow';
  }

  const siblingOptions = ALLOWED_SIBLINGS[prev][siblingKey];

  if (!siblingOptions.length) return name;

  const next = pick(siblingOptions) || '';

  return name + next;
};

const generateName = (): string => {
  const max = d(8) + 3;

  const allowedLetters = Object.keys(ALLOWED_SIBLINGS);
  const firstLetter = pick(allowedLetters).toUpperCase();

  const name = Array(max)
    .fill(null)
    .reduce(getNextLetter(max), firstLetter);
  return titleize(name.replace(/1/g, 'tz').replace(/2/g, 'ch'));
};

export default generateName;
