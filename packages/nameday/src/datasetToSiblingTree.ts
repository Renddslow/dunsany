interface SiblingNode {
  con: Array<string>;
  vow: Array<string>;
}

const VOWELS = ['a', 'e', 'i', 'o', 'u'];

const datasetToSiblingTree = (
  dataset: Record<string, Array<string>>,
): Record<string, SiblingNode> => {
  return Object.keys(dataset).reduce((acc, k) => {
    if (typeof acc[k] !== 'object') {
      acc[k] = {
        con: [],
        vow: [],
      };
    }

    dataset[k].forEach((d) => {
      if (VOWELS.includes(d)) {
        acc[k].vow.push(d);
      } else {
        acc[k].con.push(d);
      }
    });

    return acc;
  }, {});
};

export default datasetToSiblingTree;
