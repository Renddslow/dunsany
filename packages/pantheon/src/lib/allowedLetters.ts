// TODO: This phonics guide was largely built just from eyeballing
// https://infogalactic.com/info/Ancient_Semitic_religion for letter pairs
// This could be honed further to catch more edge cases.

export const ALLOWED_SIBLINGS = {
  a: {
    con: ['k', 'g', 'q', 'p', 'b', 't', 'm', 'n', 's', '1', 'r', 'h', 'l', '2'],
    vow: ['a', 'o', 'e'],
  },
  b: {
    con: ['r', 's'],
    vow: ['e'],
  },
  '2': {
    // ch
    con: ['r'],
    vow: ['a', 'e', 'i', 'o', 'u'],
  },
  d: {
    con: ['r', 's'],
    vow: ['e', 'a', 'u'],
  },
  e: {
    con: ['k', 'g', 'q', 'p', 'b', 't', 'm', 'n', 's', '1', 'r', 'h', 'l', '2'],
    vow: ['a', 'o'],
  },
  g: {
    con: ['d', 'r'],
    vow: ['a', 'e', 'o', 'i'],
  },
  h: {
    con: ['t'],
    vow: ['a', 'o', 'e', 'i', 'u'],
  },
  i: {
    con: ['l', 'n'],
    vow: ['o'],
  },
  k: {
    con: ['k'],
    vow: ['u', 'i'],
  },
  l: {
    con: ['l', 'k', 't', '2'],
    vow: ['i'],
  },
  m: {
    con: ['m', 'n'],
    vow: ['a', 'e', 'i', 'o', 'u'],
  },
  n: {
    con: ['l', 't', 'b'],
    vow: ['i', 'u', 'o'],
  },
  o: {
    con: ['k', 'g', 'q', 'p', 'b', 't', 'm', 'n', 's', '1', 'r', 'h', 'l', '2'],
    vow: ['a'],
  },
  p: {
    con: ['h', 'l', 'r', 'n'],
    vow: ['a', 'e', 'u'],
  },
  q: {
    con: ['r', 's', '1'],
    vow: ['o', 'a'],
  },
  r: {
    con: ['g', 'b', 't', 'p', 'h', 'm', 'n', 's', '1', '2'],
    vow: ['o', 'a', 'e'],
  },
  s: {
    con: ['h'],
    vow: ['i', 'a', 'u'],
  },
  t: {
    con: ['t'],
    vow: ['a', 'e', 'i', 'o', 'u'],
  },
  u: {
    con: ['n', 'z', 'r', 'h'],
    vow: ['u'],
  },
  '1': {
    // tz
    con: [],
    vow: ['u', 'i', 'a'],
  },
  z: {
    con: [],
    vow: ['u'],
  },
};
