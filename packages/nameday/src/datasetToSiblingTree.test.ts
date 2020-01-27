import test from 'ava';

import datasetToSiblingTree from './datasetToSiblingTree';

test('datasetToSiblingTree - when no letters are present, a `con` and `vow` Array are still created', (t) => {
  const actual = datasetToSiblingTree({
    e: [],
  });
  t.deepEqual(actual, { e: { con: [], vow: [] } });
});

test('datasetToSiblingTree - when only vowels are present, vowels are grouped and con is an empty Array', (t) => {
  const expected = {
    e: {
      con: [],
      vow: ['a', 'e', 'o'],
    },
  };
  const actual = datasetToSiblingTree({
    e: ['a', 'e', 'o'],
  });
  t.deepEqual(actual, expected);
});

test('datasetToSiblingTree - when only consonants are present, consonants are grouped and vow is an empty Array', (t) => {
  const expected = {
    e: {
      con: ['t', 'k', 'g'],
      vow: [],
    },
  };
  const actual = datasetToSiblingTree({
    e: ['t', 'k', 'g'],
  });
  t.deepEqual(actual, expected);
});

test('datasetToSiblingTree - when both consonants and vowels are present, both vow and con Arrays are filled', (t) => {
  const expected = {
    e: {
      con: ['g', 'h', 'k', 'l', 'm', 'n', 's', 't', 'z'],
      vow: ['a', 'e', 'i', 'u'],
    },
  };
  const actual = datasetToSiblingTree({
    e: ['a', 'e', 'g', 'h', 'i', 'k', 'l', 'm', 'n', 's', 't', 'u', 'z'],
  });
  t.deepEqual(actual, expected);
});
