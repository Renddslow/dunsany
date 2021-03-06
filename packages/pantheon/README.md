# Pantheon [![npm](https://img.shields.io/npm/v/@dunsany/pantheon)](https://npmjs.org/package/~dunsany/pantheon) ![GitHub issues by-label](https://img.shields.io/github/issues/Renddslow/dunsany/pantheon)

> A procedural pantheon generator.

Generate a list of deities with archetypes, powers, characteristics, and relationships.

This is built as the basis for a procedural high fantasy, soft magic system, online strategy game.

## In-Game Information

### Pantheons

A pantheon is a list of deities with a chief (when the pantheon is `> 2`), a collective disposition toward humans, and an age.

```typescript
interface Pantheon {
  disposition: typeof dispositions[number];
  age: typeof ages[number];
  chief?: string; // deity.id
  deities: Array<Deity>;
  seed: string;
}
```

### Deities

Deities each have a single archetype (god of war, goddess of storms, etc). This archetype helps define their backstory, a short snippet designed to open up stories of these deities' mighty feats.

Like the gods of old, these deities are gendered, being one of four: male, female, hermaphrodite, and none. This will affect their relationships with other gods and goddesses of the pantheon.

Each deity starts with a pre-defined list of relationships which will likely connect all deities in a smaller pantheon and most in a larger one.

Those relationships will ebb and flow, reaching points of deep love and other times deep hatred. These are indicated by the `eris`, `eros`, `philo`, and `agape` indicators on the relationship edge.

```typescript
interface Deity {
  name: string;
  archetype: Archetype;
  relationships?: Array<Relationship>;
  backstory: string;
  id: string;
  gender: typeof genders[number];
  characteristics: {
    real: boolean;
    reliability: number; // 0-1
    dead: boolean;
    // TODO: add more characteristics. Things like jovialness (?), drunkeness, etc.
  };
}
```

## Todo

- [ ] Add better linguistic rules to name generation
- [ ] Add more characteristics that weight a deity's personality, effectiveness, and worship

### Notes

We had discussed monotheism/dualism systems. Since these would technically be self-contained "pantheons" and we've discussed the idea of competing pantheons, I think it better to allow the chance for a 1-2 deity pantheon, expecting that a culture will pick up on this fact and consider all other competing pantheons false.
