import test from 'ava';

import getMinMax from './getMinMax';

test('getMinMax - returns 0 when no names are provided', (t) => {
  t.deepEqual(getMinMax([]), { min: 0, max: 0 });
});

test('getMinMax - return min/max when names are provided', (t) => {
  const minMax = getMinMax([
    'meme',
    'bau',
    'ninisina',
    'ishkur',
    'adad',
    'istaran',
    'nanshe',
    'ninazu',
    'ningal',
    'nikkal',
    'ningishzida',
  ]);
  t.deepEqual(minMax, { min: 3, max: 11 });
});
