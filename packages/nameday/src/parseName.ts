const parseName = (name: string): Record<string, Array<string>> => {
  const tree: Record<string, Array<string>> = {};
  name = name.toLowerCase();

  name.split('').forEach((token, idx) => {
    if (!tree[token]) {
      tree[token] = [];
    }
    if (idx < name.length - 1) {
      const sibling = name.slice(idx + 1, idx + 2);
      if (!tree[token].includes(sibling)) {
        tree[token].push(sibling);
      }
    }
  });

  return tree;
};

export default parseName;
