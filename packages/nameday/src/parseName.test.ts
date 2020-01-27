import test from 'ava';

import parseName from './parseName';

test('parse - returns empty object when no name provided', (t) => {
  const response = parseName('');
  t.deepEqual(response, {});
});

test('parse - returns valid sibling object when name provided with no-dupe siblings', (t) => {
  const response = parseName('enlil');
  t.deepEqual(response, {
    e: ['n'],
    n: ['l'],
    l: ['i'],
    i: ['l'],
  });
});

test('parse - returns valid sibling object when name provided with dupe siblings', (t) => {
  const response = parseName('enlili');
  t.deepEqual(response, {
    e: ['n'],
    n: ['l'],
    l: ['i'],
    i: ['l'],
  });
});
