## Outline

1. Introduction
2. Motivation
3. Implementation
   1. Procedural generation
      1. Seeding
      2. "Rolling"
   2. Creation flow
      1. Starting with a chief
      2. Creating a chief spouse
      3. Sideboard
      4. Generating generations
   3. Name generation
4. Future
   1. Relationship graph
5. Conclusion

## Introduction/Motivation

I recently became the software engineering manager for web and mobile devs at my company. We're in the process of a massive modernization effort that would move us away from a Windows-based thick-client UI to building a native-web single page app.

So my third day in the role I had basically a full day of touchbases with the team I was now leading. Get to my second touchbase and she was maybe 30 seconds late, but she apologizes for being late, telling me that she was in a massive discussion with her husband over the lack of a fantasy-based grand strategy game. Specifically why there wasn't one based in Tolkien's legendarium.

So I naturally picked up where they had left off. The specific concerns I had, and I'm sure you're all thinking this, what sort of magic system would you use. Tolkien had an incredibly soft-magic system complicated by the fact that people using magic in those stories were semi-divine. Gandalf is basically an semi-mortal angel. My team member's husband argued that magic develops through a tech tree. I almost threw up in my mouth.

Now we did eventually get to the actual touchbase. Don't worry about that.

That conversation led to a GitHub repo, half-a-dozen GitHub issues, several out-of-work conversations, and another member of my team hopping on outside of work to help out.

What we're building is a grand strategy based on procedurally generated elements all starting with a pantheon. That's what our talk today is about. How we built a procedurally generated pantheon system and what we'll continue building going forward.
