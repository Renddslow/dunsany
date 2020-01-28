interface MinMax {
  max: number;
  min: number;
}

const getMinMax = (names: Array<string>): MinMax =>
  names.reduce(
    (acc, name) => {
      const len = name.length;
      if (acc.min === 0) acc.min = len;
      if (acc.max === 0) acc.max = len;
      acc.min = Math.min(acc.min, len);
      acc.max = Math.max(acc.max, len);

      return acc;
    },
    { max: 0, min: 0 },
  );

export default getMinMax;
