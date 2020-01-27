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
      if (name.length > acc.max) acc.max = len;
      if (name.length < acc.min) acc.min = len;

      return acc;
    },
    { max: 0, min: 0 },
  );

export default getMinMax;
