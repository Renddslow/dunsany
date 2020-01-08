import { Deity } from './deity';

const RELATIONSHIP_TYPES = [
  'father',
  'mother',
  'sister',
  'brother',
  'nephew',
  'niece',
  'uncle',
  'aunt',
  'spouse',
  'consort',
  'friend',
  'rival',
  'nemesis',
] as const;

export type RelationshipTypes = typeof RELATIONSHIP_TYPES[number];

const relTree = {
  family: {
    female: ['sister', 'mother', 'niece', 'aunt', 'spouse'],
    male: ['father', 'brother', 'nephew', 'uncle', 'spouse'],
  },
  positive: ['consort', 'friend'],
  negative: ['rival', 'nemesis'],
};

export const createRelationships = (deities: Array<Deity>, seed: string) => {
  const relationships = {};

  // Identify all the men
  const potentialFathers = deities.filter(({ gender }) => gender === 'male');
  console.log(potentialFathers);

  // start off with the family so we don't accidentally get overlaps
  // commit family nodes

  // randomly pick out consorts, friends, rivals, and nemeses
  // limit based on the size of the pantheon
};

export default RELATIONSHIP_TYPES;
