## Introduction

**Introduce me an Adam (I am Kermit, he is the Hecklers)**

## Motivation

I recently became the software engineering manager for web and mobile devs at my company. We're in the process of a massive modernization effort that would move us away from a Windows-based thick-client UI to building a native-web single page app.

[Show Agility]

So my third day in the role I had basically a full day of touchbases with the team I was now leading. Get to my second touchbase and she was maybe 30 seconds late, but she apologizes for being late, telling me that she was in a massive discussion with her husband over the lack of a fantasy-based grand strategy game. Specifically why there wasn't one based in Tolkien's legendarium.

So I naturally picked up where they had left off. The specific concerns I had, and I'm sure you're all thinking this, what sort of magic system would you use. Tolkien had an incredibly soft-magic system complicated by the fact that people using magic in those stories were semi-divine. Gandalf is basically an semi-mortal angel. My team member's husband argued that magic develops through a tech tree. I almost threw up in my mouth.

[CK2]

Now we did eventually get to the actual touchbase. Don't worry about that.

That conversation led to a GitHub repo, half-a-dozen GitHub issues, several out-of-work conversations, and another member of my team hopping on outside of work to help out.

What we're building is a grand strategy based on a massive relationship graph of procedurally generated elements all starting with a pantheon.

((You're auto-generating this?))
[Parthenon]
No, that's the Parthenon

((Right, sorry. Parthenon is in Greece. So, this?))
[Pantheon]
Well, thats The Pantheon in Rome, I'm talking about a bunch of Gods and how they're related.

((Oooooooooh!))
[Family Tree of Gods]
Yes.

So that's what we'll spend the time together on, discussing how we're breaking down a massive problem like this into small digestable pieces using Node.js, npm, and monorepos.

## Background

So let me run through what we're building and I'm gonna rapid fire through this because I don't wanna bore you and Adam's gonna kill me if I walk through our repo line-by-line (again). If you dig it and want to hear more, myself or Trevor, who's also here today, can talk your ear off for 5 hours about it. In fact, if you wanna blow off your team and just come to our sponsor table and talk for 10 hours about deities relationships to one another, hit us up.

((If you want to change your project to just work on this, you'll almost certainly win our sponsor prize.))

So what we wanted was a game that has a massive relationship graph, think like Facebook, but it has all the deities, and the pantheons the deities belong to, and governments, and characters, and nations, and races, and magic users, and how certain pantheons feel about magic and maybe other pantheons hate it.

And to do all that, we felt like the basis of the world, politics, religion, and magic would really rely on the pantheon. So we started with a pantheon.

So here's how it works. You start with a chief. Now if the chief is male, he's gonna need a dedicated spouse. If the chief is female, there's a chance she may be "matriarchal" in nature and just create the next generation of gods. If the chief is a hermaphrodite, he will beget the next generation uhhhmm.... (act awkward) through himself. [Adam jokes]

[Chief slide]

Now if any of you have spent any time with the Classics, you'll know that the gods were not very chaste ((or choosey)). So we added in the concept of anonymous mortal mates (cows, women, men, mountains, the usual) that both the chief and the chief's spouse will hook up with, creating a generation of demigods.

[Chief relationship slide]

Now we also create a side board of up to 10 or so deities who may be related to the chief either as a sibling or as an aunt or uncle. But they may have no relation at all. This helps prevent us having a **completely** inbred pantheon. This will be important in a minute.

((Pretty sure its important now, then, and always. But, continue.))

[Sideboard slide]

So next up, we create the second generation of deities/demigods based on relationships between the gods. This second generation is only created from the chief, the chief's anonymous consorts, and perhaps the chief's spouse and his or her anonymous consorts.

[Second generation slide]

So now we've got a second generation and they need to have kids. ((That's THEIR choice, thank you.)) So they will literally hook up with anyone, cuz gods are weird ((Sex-positive isn't weird.)). So we randomly pick out pairings, only preventing pairings with demigods. But this could be anyone. We call these edges "Consorts". Consorts are what create children. ((You need to take Biology class again.))

So now that we've hooked up all the gods ((all the gods have hooked up)), they have kids. And this is where the setup stops. We now have a pantheon of gods, related across 3 generations.

[Demo]

## Breakdown

So what we want to do is breakdown how we tackle a problem like this, especially when we know that the pantheon isn't the only thing we need to build.

((What else do you need to build))
[Matt says some stuff about countries, tribes, or whatever.]


### Be a little administrative

The first thing we did was make a GitHub repo and Slack workspace for this where we could keep track of ideas and slice out work. I know that seems pretty basic, but trust me, it pays dividends. Keeping records of decisions and clearly defining work is the best way to start breaking down work.

[GitHub and Slack slide]

### Single Responsibility

Next we're all really big believers in the Single Responsibility Principle. At the micro level, the idea is that any given unit of code is responsible for only one thing. It shouldn't have side-effects and should ideally have unit tests.

At the macro-level we really dig monorepos. A monorepo is a single repository with all the packages you need for a given project in one place. Monorepos allow you to share dependencies across the project. So if all your packages use the same version of lodash or babel, we can share those dependencies across the project. [Adam: might need to expand on this, I might ask you some follow-ups to clarify.]

Another huge value of monorepos is that interdependent packages get integration tested on every push. So if `package-a` (which obviously has unit tests) depends on `package-b` (which also has unit tests), when you push your changes to `package-b`, `package-a` will get integration tested immediately. So if package-b had a breaking change, you'll know before it hits production.

[Agility repo file-tree]

((Uh...what? Give me an example.))

This is a pattern that several big players run with. Google for instance might have Angular in the same monorepo as several of their other frontend projects, let's say for instance, and I can't verify this so don't tout it to your buddies as a fact, search. So when someone pushes a change to an Angular API, search gets unit tested to account for those changes. If the Angular team broke an API that search relies on, they have the opportunity to fix it before they ever push that change into production.

[Angular monorepo]

So from a single-responsibility perspective, we like the idea of having small manageable npm packages that each do one scoped thing. In the case I described earlier we have all of that[Adam: all of what?] scoped to a single package. The idea is that the pantheon package is only responsible for creating a randomly-generated, seed-based pantheon of deities. ((A what what?random who now?)) Nothing more. When it comes to building the relationship graph between deities, another package gets to worry about that. Think atomic design [Adam: Literally no one will know what you mean by Atomic Deasign] but for data generation.

[Pantheon package on npm]

### TypeScript

Okay, I want to be clear. This is not a TypeScript talk. Nor will it become one. But when you're using a whole bunch of tiny or tiny-adjacent packages that all output some sort of data structure, you want some tool at your side that makes documentation, discovery, and intellisense easy.

((And Typescript does that for you? What is Typescript?))

[Types for Pantheon]

So all of our data structures are strongly typed with TypeScript and exported with the package. 

((Because JavaScript doesn't have types. AHHHH I get it.))

### Publishing

I alluded to this before, but I think its a potentially undervalued piece of this process. Publishing your small packages on npm. In our case, we scoped our packages to an organization called `@dunsany`, it's a deep cut. Scoping our packages allows us to guarantee that our name is available, [Adam: I don't think that's very clear, what do you mean by name available. are you talking about @dunsany is not taken by someone else.] let's us add team members to the whole project, and makes it easy to hunt down all the packages [Adam: Why does adding members make it easy to hund down packages?].

This allows us to clearly version each of our packages and keep them somewhere in a bundled state.

At DMSi, we do this with everything from our design system all the way up to our actual chunked apart production application.

[WedgeKit]

[Adam: We are gonna need to spend some time hitting home on this, I think. This part is pretty quick and assumes a lot of knowledge.]

## Tasty Treat

So I wanted to spend a few minutes walking through something I am especially proud of. Y'all may have noticed in the screen shot of the Pantheon output that each of the gods have a unique name. So I'm gonna unpack how we did that.

First of all, we started with a predefined set of letters. Eventually we'd like to have pantheons whose names sound Greek, or Norse, or Latin, or Mayan, or what have you. For now, we started with a "dataset" of Akkadian deity names. And when I say dataset, I mean we went to some ancient languages wiki and found a list of Akkadian deities and then with our eyeballs, mapped out letter pairings. I also have spent a teeny bit of time on in ancient Hebrew with my educational background, and since Akkadian and Hebrew are both semitic, I also borrowed from what I knew of common letter pairings in Hebrew.

((Akkadian, uh... riffing and questioning on WTF you're talking about.))

So what we wind up with is this:

[Letter pairings image]

We start by picking a max length of word. Then pick a letter from the approved list as the start of a reducer function. We reduce over a null-filled array of our max-length, and use the previous letter to inform the next level.

[Adam: I think you want a graphic here illustrating your algorithm youre describing.]

Now we made a couple of rules that weren't really based on any linguistic knowledge, but just to aid pronunciation. So we only allow two vowels and two consonants as direct siblings. This prevents having some weird name unpronouncable name.

[Mister Mxyzptlk]

Now this, as far as I can tell, is not native to Akkadian, but aids to the ancient feel and pronouncability of the name: we will potentially add a random apostrophe in the middle of the word. Not at the beginning and not at the very end, and maybe not at all.

((To Audience: This is THE ONLY time you are allowed to randomly insert apostrophes))

[Karen's Bit's Bob's. Magic Price's]

Then we decide if the next letter should be a vowel or consonant, and randomly pick what the next letter should be based on the allowed siblings.

[more code]

Now one problem we ran into is that in semitic languages,((Which are....what again?)) there are a few phonemes that we don't have in English that we, and by we I mean English, represent as letter pairs when transliterating. The two in particular we, and by we I mean my team, used were the voiceless uvular fricative (chet) ((Bless you, and WTF) and the voiceless alveolar affricate (tsade) ((Now you're just showing off)). We're still working on a good solution for this. Because we're doing a look back to the previous token, it's hard to assign a single letter. For now, we used numbers that just get string replaced before the name is output. If you have a better idea, come up to the DMSi table and let me know, or submit a PR. [Adam: This will need more explanation, that's very fast introduction of concepts of language switching into talking about how to parse/look back etc which is a technology problem]

[slide showing chet and tsade]

So in the end, what this generates is a name for each deity. Here's a few I generated this morning. (Stumble over pronunciation)
