import cloneDeep from 'clone-deep';

import { Deity, Relationship } from './deity';
import d from './utils/d';

const RELATIONSHIP_TYPES = [
  'father',
  'mother',
  'son',
  'daughter',
  'sister',
  'brother',
  'nephew',
  'niece',
  'uncle',
  'aunt',
] as const;

export type RelationshipTypes = typeof RELATIONSHIP_TYPES[number];

const decimal = (seed) => (d(100, seed) - 1) / 100;

export const createRelationship = (type, deityId, consort, seed) => ({
  deityId,
  type,
  consort,
  eris: decimal(seed + 'eris'),
  eros: decimal(seed + 'eros'),
  philo: decimal(seed + 'philo'),
  agape: decimal(seed + 'agape'),
});

export const createSideboardRelationship = (chiefId: string, seed: string) => (
  deity: Deity,
): Deity => {
  const isRelated = d(4, seed + 'related' + deity.id) === 1;

  if (!isRelated) return deity;

  const isSibling = d(2, seed + 'sibling' + deity.id) === 1;

  let type;
  if (isSibling) {
    type = deity.gender !== 'female' ? 'brother' : 'sister';
  } else {
    type = deity.gender !== 'female' ? 'uncle' : 'aunt';
  }

  return {
    ...deity,
    relationships: [createRelationship(type, chiefId, false, seed + deity.id)],
  };
};

export const invertRelationship = (relationship: Relationship, deity: Deity): Relationship => {
  const newRelationship = cloneDeep(relationship);

  switch (relationship.type) {
    case 'aunt':
    case 'uncle':
      return {
        ...newRelationship,
        type: deity.gender !== 'female' ? 'nephew' : 'niece',
      };
    case 'sister':
    case 'brother':
      return {
        ...newRelationship,
        type: deity.gender !== 'female' ? 'brother' : 'sister',
      };
    case 'nephew':
    case 'niece':
      return {
        ...newRelationship,
        type: deity.gender !== 'female' ? 'uncle' : 'aunt',
      };
    case 'mother':
    case 'father':
      return {
        ...newRelationship,
        type: deity.gender !== 'female' ? 'son' : 'daughter',
      };
    case 'daughter':
    case 'son':
      return {
        ...newRelationship,
        type: deity.gender !== 'female' ? 'father' : 'mother',
      };
  }
};

export default RELATIONSHIP_TYPES;
