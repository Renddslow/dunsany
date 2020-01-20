import test from 'ava';

import query from './query';

// TODO
test('Gets the keys', () => {
  query(
    [],
    [],
  )({
    from: {
      id: 'abc',
    },
    to: {
      type: 'human',
      attributes: {
        characteristics: {
          joviality: (utils) => utils.gt(0.5),
        },
      },
    },
    weights: {
      eros: (utils) => utils.gt(0.8),
    },
  });
});
