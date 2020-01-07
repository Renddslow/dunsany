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

export type RelationshipTypes = typeof RELATIONSHIP_TYPES;
export default RELATIONSHIP_TYPES;
