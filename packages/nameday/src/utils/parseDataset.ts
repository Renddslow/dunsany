import merge from 'deepmerge';
import uniq from 'uniq';

import parseName from './parseName';

const parseDataset = (data: Array<string>): object => {
  return merge.all(data.map(parseName), {
    arrayMerge: (target: any[], source: any[]): any[] => uniq([...target, ...source]),
  });
};

export default parseDataset;
