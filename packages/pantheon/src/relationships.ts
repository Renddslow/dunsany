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

const decimal = () => (d(100) - 1) / 100;

export const createRelationship = (type, deityId, consort) => ({
  deityId,
  type,
  consort,
  eris: decimal(),
  eros: decimal(),
  philo: decimal(),
  agape: decimal(),
});

export const createSideboardRelationship = (chiefId: string) => (deity: Deity): Deity => {
  const isRelated = d(4) === 1;

  if (!isRelated) return deity;

  const isSibling = d(2) === 1;

  let type;
  if (isSibling) {
    type = deity.gender !== 'female' ? 'brother' : 'sister';
  } else {
    type = deity.gender !== 'female' ? 'uncle' : 'aunt';
  }

  return {
    ...deity,
    relationships: [createRelationship(type, chiefId, false)],
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
