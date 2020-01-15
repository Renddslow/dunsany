import pick from './utils/pick';

export const REALMS = ['cosmic', 'nation', 'race', 'city', 'guild', 'individual'] as const;
export const INVOLVEMENT = [
  'non-involvement',
  'equilibrium',
  'miraculous',
  'proxy',
  'direct',
  'incarnate',
] as const;

export type Disposition = [typeof REALMS[number], typeof INVOLVEMENT[number]];

export const generateDisposition = (): Disposition => [pick(REALMS), pick(INVOLVEMENT)];

export const getRandomAdjacentDisposition = (dispositions: Array<Disposition>): Disposition => {
  const available = dispositions
    .map(([realm, involvement]) => [
      REALMS.findIndex((r) => r === realm),
      INVOLVEMENT.findIndex((i) => i === involvement),
    ])
    .reduce((acc, [r, i]: [number, number]) => {
      const neighbors = [];

      if (i > 0) neighbors.push([r, i - 1]);
      if (i < INVOLVEMENT.length - 1) neighbors.push([r, i + 1]);
      if (r > 0) neighbors.push([r - 1, i]);
      if (r < REALMS.length - 1) neighbors.push([r + 1, i]);

      neighbors.push([r, i]);
      acc.push(...neighbors);
      return acc;
    }, []);

  const [realmIdx, involvementIdx] = pick(available);
  return [REALMS[realmIdx], INVOLVEMENT[involvementIdx]];
};
