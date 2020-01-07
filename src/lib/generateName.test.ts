import test from 'ava';

import generateName from './generateName';

test('stuff', (t) => {
  console.log(generateName());
  t.pass();
});
