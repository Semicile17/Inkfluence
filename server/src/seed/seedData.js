export const demoPassword = 'demo1234';

export const seedUsers = [
  {
    name: 'Maya Chen',
    username: 'maya',
    email: 'demo@inkfluence.app',
    password: demoPassword,
    bio: 'Essayist, design optimist and recovering tab-hoarder. I write about attention, taste and making things that feel human.',
    socials: { website: 'https://example.com/maya', twitter: 'mayawrites', instagram: 'maya.makes' },
  },
  {
    name: 'Arjun Mehta',
    username: 'arjun',
    email: 'arjun@inkfluence.app',
    password: demoPassword,
    bio: 'Product tinkerer. Writing about the messy middle of building things, one honest update at a time.',
    socials: { website: '', twitter: 'arjunbuilds', instagram: '' },
  },
  {
    name: 'Sofia Reyes',
    username: 'sofia',
    email: 'sofia@inkfluence.app',
    password: demoPassword,
    bio: 'Travel writer with a soft spot for side streets, second coffees and cities that refuse to be rushed.',
    socials: { website: 'https://example.com/sofia', twitter: '', instagram: 'sofiawanders' },
  },
  {
    name: 'Noah Williams',
    username: 'noah',
    email: 'noah@inkfluence.app',
    password: demoPassword,
    bio: 'Frontend developer, CSS apologist and weekend side-project collector. Usually somewhere near a browser tab.',
    socials: { website: 'https://example.com/noah', twitter: 'noahcodes', instagram: '' },
  },
  {
    name: 'Lena Fischer',
    username: 'lena',
    email: 'lena@inkfluence.app',
    password: demoPassword,
    bio: 'Slow-living enthusiast and unapologetic Sunday person. Notes on rest, rituals and paying gentle attention.',
    socials: { website: '', twitter: 'lenamakes', instagram: 'lena.slowly' },
  },
  {
    name: 'Dev Patel',
    username: 'dev',
    email: 'dev@inkfluence.app',
    password: demoPassword,
    bio: 'Freelance writer and spreadsheet convert. Making money, books and the freelance life feel less mysterious.',
    socials: { website: 'https://example.com/dev', twitter: 'devreflects', instagram: '' },
  },
];

export const followMap = {
  maya: ['arjun', 'sofia', 'lena'],
  arjun: ['maya', 'noah', 'dev'],
  sofia: ['maya', 'lena', 'dev'],
  noah: ['arjun', 'maya'],
  lena: ['sofia', 'dev', 'maya'],
  dev: ['maya', 'arjun', 'lena'],
};

export const bookmarkMap = {
  maya: ['css-is-having-a-moment', 'slow-travel-a-love-letter-to-getting-lost'],
  arjun: ['the-quiet-power-of-doing-one-thing-at-a-time', 'a-freelancers-honest-guide-to-money'],
  sofia: ['tiny-joys-big-impact-a-case-for-noticing', 'your-idea-is-allowed-to-change'],
  noah: ['designing-for-delight-not-dopamine', 'the-art-of-the-sunday-reset'],
  lena: ['how-to-read-more-without-making-it-a-chore', 'the-first-90-days-of-learning-to-code'],
  dev: ['building-in-public-for-beginners', 'what-i-learned-from-deleting-10000-lines-of-code'],
};

export const seedBlogs = [
  {
    title: 'The Quiet Power of Doing One Thing at a Time',
    slug: 'the-quiet-power-of-doing-one-thing-at-a-time',
    author: 'maya',
    excerpt:
      'A love letter to single-tasking, deep attention and the strangely radical act of finishing one thing before starting the next.',
    category: 'Life',
    tags: ['focus', 'productivity', 'slow living'],
    coverTheme: 'lime',
    featured: true,
    daysAgo: 3,
    views: 4820,
    likes: ['arjun', 'sofia', 'noah', 'lena', 'dev'],
    content: `There is a particular kind of tiredness that has nothing to do with sleep. It is the tiredness of a brain with too many tabs open — the half-written reply, the podcast paused at 12 minutes, the article you saved to read later in three different apps. Nothing is finished, so nothing gets to feel finished.

I spent years calling this productivity. It was closer to a magic trick: keep enough things in motion and no one notices you are not actually moving.

## The myth of background noise

We tell ourselves that we can listen to a podcast, answer a message and "just quickly check" something else while doing focused work. Researchers call the cost of this switching "attention residue": part of your mind stays stuck on the task you left behind, even after you have moved on. You are not doing three things. You are doing one thing badly while mourning two others.

The first time I tried single-tasking, it felt almost embarrassing. One document. One browser window. A timer. For forty minutes I did exactly one thing, and when the timer went off I had the odd sensation of having been somewhere. Not just having processed something, but having been present for it.

## One tab, one thought

I began with a small, unglamorous experiment: a single-task rule for the first ninety minutes of the day. No inbox, no group chat, no "just checking" anything. I chose the one thing that would make the day feel decent if it were the only thing I finished.

The results were not cinematic. I did not write a novel before breakfast. But I did notice three changes:

1. Starting got easier, because there was only one starting line.
2. My work got a little more interesting, because I stayed with it past the boring middle.
3. I stopped ending the day with the vague feeling that I had forgotten something important.

> Attention is not a resource you spend. It is a place you choose to live for a while.

## A small practice

If you want to try this, keep it embarrassingly small. Pick one task. Put your phone in another room, not just face-down on the desk. Set a timer for twenty-five minutes. When your mind wanders — and it will — return without a lecture. The returning is the practice.

At the end of the session, write down the next tiny step before you stop. That way tomorrow's start has a handle on it.

The deeper reward is not efficiency. It is the texture of your own day. A day spent darting between fragments is hard to remember. A day with even one long, quiet stretch of attention has a centre of gravity. You can hold it in your hands.

We are not machines with a queue. We are people with a life. One thing at a time is not a productivity hack; it is a way of showing up for your own hours.`,
  },
  {
    title: 'A Beginner’s Guide to Building in Public (Without Losing Your Mind)',
    slug: 'building-in-public-for-beginners',
    author: 'arjun',
    excerpt:
      'Sharing the messy middle can be generous, useful and surprisingly good for your work. It can also eat your whole weekend. Here is a gentler way in.',
    category: 'Business',
    tags: ['startup', 'building in public', 'career'],
    coverTheme: 'ink',
    featured: true,
    daysAgo: 6,
    views: 3120,
    likes: ['maya', 'sofia', 'noah', 'dev'],
    content: `The first time I posted a revenue number, I stared at the tweet button for eleven minutes. It was not a big number. It was barely a number at all. But putting it where people could see felt like taking off a coat in public.

Building in public has become a genre, complete with hero shots of dashboards and threads about "lessons learned". Strip away the performance and there is something genuinely useful underneath: you are letting people watch the work happen, not just the result.

## Start with the things only you know

You do not need a strategy document. You need a small answer to a simple question: what did I learn this week that might save someone else an hour?

For me, the first useful post was not about strategy. It was a screenshot of a signup flow with the caption, "We lost 18 of 20 testers at this step — here's the fix we tried." That post brought three useful conversations and zero applause. It was the most useful thing I wrote all month.

## The messy-middle rule

A good public build log has three ingredients:

- **A specific problem.** "Marketing is hard" is a mood. "People abandon the form when we ask for their company size" is a post.
- **What you actually did.** Include the attempt, not just the tidy conclusion.
- **What you still do not know.** This is where readers become collaborators.

Notice what is missing: a grand narrative in which you were right all along. The mess is the point.

## Draw your own boundaries

You are allowed to keep things private. Revenue, health, family, a client's name, the particular crunchy detail of a falling-out — none of these are owed to an audience. I use a simple test before posting: would I be comfortable if this were forwarded to every client I have? It is a low bar and occasionally a very clarifying one.

I also batch. One hour on Thursday to write a short update, one hour on Sunday to answer replies. Outside that, the public thing stays in its box. An audience is not a manager; it should not set the rhythm of your whole week.

## The compounding, quiet part

The internet rewards loudness, but trust compounds quietly. After a year of imperfect updates, I had a small group of people who remembered what I was building, sent me thoughtful corrections and told their friends when something finally shipped. That was never the goal. It was better than the goal.

If you are waiting to start until the work looks impressive, here is your permission slip: it does not need to look impressive. It needs to be true, specific and slightly unfinished. That is what a build actually looks like.`,
  },
  {
    title: 'Slow Travel: A Love Letter to Getting Lost',
    slug: 'slow-travel-a-love-letter-to-getting-lost',
    author: 'sofia',
    excerpt:
      'The best parts of my trips were never on the itinerary. A case for loose plans, long lunches and letting a city show you its own pace.',
    category: 'Travel',
    tags: ['travel', 'slow living', 'culture'],
    coverTheme: 'bloom',
    featured: true,
    daysAgo: 9,
    views: 2760,
    likes: ['maya', 'lena', 'dev', 'noah'],
    content: `In Lisbon I made a list of nine things to see. I saw five of them and spent an entire afternoon sitting on the same square watching a man repair the soles of shoes. The square is what I remember.

We treat travel like a checklist with weather. Four cities in seven days. The famous museum, the famous sandwich, the spot where the famous photo was taken. We come home with a camera roll and the faint suspicion that we were never quite there.

## The itinerary is not the trip

I am not against planning. A loose plan is a kindness to future you: somewhere to sleep, a rough sense of direction, one or two things you would be sad to miss. What I have stopped doing is assigning every hour a job.

The alternative is not chaos. It is leaving space for the thing you could not have known about. The bakery that only sells one cake and closes when it is gone. The neighbourhood that looks better after it rains. The stranger who draws you a map on the back of a receipt, then insists you take the tram instead.

## A few rules for wandering

When I travel now, I give myself three small constraints:

1. **One anchor a day.** Not one sight per hour. One thing worth leaving the apartment for.
2. **Walk the wrong way at least once.** Deliberately. Drink something. Turn back when you feel like it.
3. **Learn five words.** Please, thank you, hello, excuse me, and "the bill, please". They are little keys, and the locks are everywhere.

The rest of the schedule is room to be a person in an unfamiliar place.

> The best souvenir is not an object. It is the particular way your afternoon slowed down.

## The gift of being an amateur

There is a specific freedom in not knowing where you are. You have to ask. You have to look up. You have to trust the person at the bus stop who says it is easier to walk. On the fourth day of a slow trip, I notice I stop narrating the trip in my head for an audience. I become, briefly, an amateur observer again.

That is the thing I am actually chasing. Not the perfect café, not the hidden beach. The feeling of being curious without being efficient.

So here is my invitation: wherever you are going next, leave one afternoon blank. Do not save it for a rainy day. Do not fill it if someone suggests something better. Just go outside with no destination and let the city make its case. You can always see the museum tomorrow. Tomorrow's memory might be the shoe repairman.`,
  },
  {
    title: 'Designing for Delight, Not Dopamine',
    slug: 'designing-for-delight-not-dopamine',
    author: 'maya',
    excerpt:
      'The difference between a product that makes you feel good and one that keeps you from feeling anything at all. A field guide for kinder interfaces.',
    category: 'Design',
    tags: ['design', 'ethics', 'technology'],
    coverTheme: 'grid',
    daysAgo: 12,
    views: 3900,
    likes: ['arjun', 'noah', 'dev', 'lena'],
    content: `There is a small, specific joy in a good light switch. You reach for it without thinking; the room changes. It does not ask you twice. It does not send a notification. It does not make you open it three more times before bed.

Good design is often quiet like that. But somewhere along the way, delight became something louder. Confetti. Streaks. A little red dot where a number used to be. We started designing loops that keep people in a product, rather than experiences they can happily leave.

## Delight is on your side

I think of delight as the feeling of being unexpectedly understood. It is the extra half-second of easing. The empty state that says something reassuring. A save button that stays saved without a follow-up email asking if you still remember it.

Dopamine, in the blunt way we use the word, is different. It is the promise of satisfaction rather than the thing itself. The slot-machine pull. Infinite feeds. "You're on a 14-day streak!" — a sentence that turns rest into a failure state. It does not respect the person using it. It sees a session length.

## Three questions for the design review

When a feature is described as "engaging", I try to ask three questions:

- **What does this ask of the person?** Their attention? Their worry? Their evening?
- **What happens when they leave?** Does the product support a natural ending, or punish it?
- **Would I be comfortable explaining this mechanic to the person it affects?** Not the investor deck. The person.

None of this requires a philosophy degree. It requires a pause and a little imagination.

## A tiny example

A writing app I love does one small thing well. When you close a document, it shows a quiet line: "Saved. You can go." There is no unsaved-state anxiety, no "before you go" modal, no three-step exit interview. It treats leaving as a normal thing that people do.

That is not anti-engagement. I recommend it to everyone I know. Goodwill is a real growth loop. It is just slower and harder to put on a dashboard.

> The most generous interface is the one that lets you have a life outside of it.

## Making room for quiet

Not every moment needs confetti. Not every achievement needs a share sheet. Sometimes the kindest design is the one that gets out of the way and lets the work speak.

The next time you are tempted to add a notification, a badge or a tiny animation designed to pull people back, try the light-switch test. Does it help the person do the thing they came to do? Does it feel like a trick? Would you be happy if it were used on someone you love, every day, for a decade?

Design for the answer you would be proud of. Delight can be quiet. It can still be the reason someone tells a friend about you.`,
  },
  {
    title: 'Your Side Project Deserves a Weekend, Not a Decade',
    slug: 'your-side-project-deserves-a-weekend',
    author: 'noah',
    excerpt:
      'A small, complete thing beats a beautiful unfinished thing. On lowering the bar, shipping early and giving your idea a chance to surprise you.',
    category: 'Creativity',
    tags: ['side project', 'creativity', 'startup'],
    coverTheme: 'orbit',
    daysAgo: 15,
    views: 2040,
    likes: ['arjun', 'maya', 'dev'],
    content: `I have a folder of side projects that looks like a graveyard for my self-esteem. There is the app with no name, the newsletter with one issue, the clever database schema for a thing I'm no longer sure anyone needs. Each one represents a weekend I spent getting it 80 percent right, and then never finishing.

The problem was not ambition. It was that I kept confusing a project with a monument. I wanted it to be impressive, durable, complete on every axis. I wanted to be able to point at it and say: there. Look how serious I am.

## The weekend rule

Here is the rule that unstuck me: if it cannot be made real in a weekend, make it smaller until it can.

Not a worse version. A smaller version. One user. One workflow. One page. The goal is not to prove you can build anything. It is to find out whether the thing is worth building at all.

A finished small thing teaches you something a beautiful unfinished thing never will: what people actually do with it.

## What "done" can mean

For a weekend project, done can be extremely modest:

- A landing page with a waitlist and one clear sentence.
- A single script that saves you twenty minutes a week.
- Three chapters of the thing, posted somewhere public.
- A clickable prototype you can put in front of two humans.

None of these need a logo. None of them need an authentication system with password reset. None of them need the word "platform".

## The surprising part

The first weekend project I actually shipped was a tiny tool that converted my meeting notes into a checklist. It took six hours, including a coffee break. I put it on the internet with a clumsy tweet and went for a walk.

Seven people used it. Two of them sent me notes. One of them asked, "Could it also do this?" That question was worth more than six months of speculative building. It gave me the next weekend's job, and it did not require me to fall in love with a plan.

> A finished small thing is a conversation. An unfinished big thing is only a monologue.

## Permission to keep it small

You do not owe the world your magnum opus. You are allowed to make something useful, a little rough, and entirely yours. You are allowed to ship it before it feels ready — especially if "ready" is a moving target that keeps you from the fun part.

So take the project that has been sitting in your tabs. Cut it in half. Cut it in half again. Give it a weekend and a name that doesn't sound like a startup. Then press publish.

You can always make it bigger later. You can never make an unfinished thing useful.`,
  },
  {
    title: 'The Art of the Sunday Reset',
    slug: 'the-art-of-the-sunday-reset',
    author: 'lena',
    excerpt:
      'Not a productivity system. Not a 27-step routine. Just a gentle hour to put your week back where you can find it.',
    category: 'Wellness',
    tags: ['wellness', 'routine', 'mindfulness'],
    coverTheme: 'paper',
    daysAgo: 18,
    views: 3310,
    likes: ['maya', 'sofia', 'dev', 'noah', 'arjun'],
    content: `My Sunday reset began as a punishment. A list of everything I had failed to do that week, rewritten in tidier handwriting. The laundry mountain. The unanswered emails. The version of myself I was supposed to be by Monday.

It did not make me feel ready. It made me feel like a project manager with a bad client.

So I tried something else: one hour, three questions, no self-improvement. It sounds almost too soft to work. It has become the most reliable ritual I have.

## The hour

I make tea. I put my phone in another room. I sit with a notebook and ask:

1. **What is taking up space in my head?** Not a priority list. A brain dump. The thing I am avoiding, the thing I am excited about, the small worry that keeps showing up.
2. **What does next week actually need from me?** Not what would look good on a calendar. The three or four things that would make the week feel okay.
3. **What can I take off my plate?** Cancel it. Delegate it. Shrink it. Admit it is not happening. This question is the whole reset.

Then I close the notebook. I do not spend the rest of the day colour-coding it.

## The unglamorous details

A reset is mostly about physical friction. I put clean sheets on the bed, because Monday-me is a different person with lower standards. I make a big pot of something that will be lunch on Tuesday. I put my shoes by the door. I water the plants and notice whether the leaves are trying to tell me something.

These are not productivity hacks. They are small acts of kindness across time. Future-you is not a machine to optimise; they are a person you have not met yet, and they will be tired.

> Rest is not the reward for finishing. It is part of how finishing becomes possible.

## When I skip it

Some weekends I do not reset anything. I travel, I see people, I lie on the sofa and read four hundred pages of a mystery. The ritual is not a debt. It is an invitation.

That is the difference now. The Sunday reset is not a performance review. It is a weekly appointment with my own life: a chance to notice what I am carrying and decide, gently, what to put down.

Monday still arrives. But it arrives into a slightly less crowded room.`,
  },
  {
    title: 'CSS Is Having a Moment (Again)',
    slug: 'css-is-having-a-moment',
    author: 'noah',
    excerpt:
      'Container queries, :has(), nesting and the quiet joy of needing less JavaScript. A love letter to the language we all take for granted.',
    category: 'Technology',
    tags: ['css', 'technology', 'design'],
    coverTheme: 'ink',
    daysAgo: 21,
    views: 4410,
    likes: ['arjun', 'maya', 'dev', 'sofia'],
    content: `Every few years we declare that CSS is finally good. Then we spend two years building a worse version of it in JavaScript. Then a new feature lands, someone posts a demo, and we all remember: right, the browser can do that now.

This time it is not just one feature. The language has quietly become capable of things that used to require a framework and a small prayer.

## :has() changes how you think

For most of my career, CSS could style a child based on its parent, but not a parent based on its child. Now :has() lets you say: if this card contains an image, give it this layout. If this form field has an invalid input, style the label. If the page has a dark hero, change the nav.

It sounds small. It removes a whole category of "just add a class in JS" workarounds. That is the best kind of feature: it makes the simple thing simple again.

## Container queries, not screen queries

Media queries ask, "How wide is the window?" Component-driven design really needs to ask, "How wide is the space this card lives in?" Container queries finally let a component respond to its container, not the viewport.

This is the difference between a design system that only works in one column and one that survives being dropped into a sidebar. It also means fewer breakpoint arguments disguised as design conversations.

## Nesting: use it kindly

Native nesting is here. It is lovely. It is also a temptation to recreate the deepest, most haunted SCSS of your youth. I have a personal rule: if I have to scroll to find where a selector starts, it is time to split the file.

> Modern CSS is not a competition to use every feature. It is permission to delete code you never enjoyed writing.

## What this means for teams

A few practical shifts:

- Reach for a class before reaching for state. DOM structure can do more than we remember.
- Keep animations in CSS when they are decoration; use JS when they carry meaning.
- Test the new features where they matter, but do not turn every layout into a demo.
- Prefer the platform's behaviour over a library's approximation.

The best frontend code I have written lately has fewer dependencies and more confidence in the browser. That is not a nostalgia trip. It is the steady, unglamorous work of learning the tool in your hands.

CSS is old enough to be familiar and young enough to keep surprising us. I hope it never stops.`,
  },
  {
    title: 'What Moving to a New City Taught Me About Belonging',
    slug: 'what-moving-taught-me-about-belonging',
    author: 'sofia',
    excerpt:
      'The year I lived out of one suitcase, said yes to too many dinners and learned that belonging is built in small, repeated gestures.',
    category: 'Culture',
    tags: ['belonging', 'culture', 'life'],
    coverTheme: 'bloom',
    daysAgo: 24,
    views: 1980,
    likes: ['maya', 'lena', 'arjun'],
    content: `The first month in a new city is a performance. You are a person with a plan: the right grocery store, the running route, a favourite café you can recommend. You are not lost. You are definitely not lonely. You are simply new.

The second month is where the performance falls apart. The café is fine, but nobody there knows your name. The running route is beautiful, but you keep passing the same couple having a better evening than you. You begin to notice how much of belonging is invisible until it is missing.

## Belonging is not a personality trait

I used to think some people were just good at cities. They had a gift for dinner parties, for remembering names, for being at the centre of a warm group by week three. I had a gift for declining things and calling it independence.

It turns out belonging is mostly logistics. You show up the second time. And the fourth time. And the time it is raining and you are tired and you almost stay home. The tiny, unglamorous repetition is the whole magic trick.

## The 20-minute rule

For a year I had a rule: say yes to anything within a twenty-minute walk or a twenty-minute effort. A gallery opening. A bad band. A neighbour's dog walk. A stranger's invitation to a board game night with the mysterious promise of "snacks".

Most of it was not magical. Some of it was awkward. A few things became the scaffolding of a life. I still think about the Portuguese grandmother who taught me to make the soup she made every Sunday. She was not my grandmother. That was the point.

> A city becomes yours when you have been seen there in your ordinary clothes.

## The slow stitches

There is no single moment when a place becomes home. It is an accumulation of small recognitions: the man at the market who saves you the good tomatoes, the neighbour who asks about your trip, the barista who starts making your coffee when you walk in. You did not earn these through charm. You earned them by being there.

One of the hardest parts of moving is that you cannot rush the stitching. You can only leave the house and give the place another chance to know you.

I live somewhere else now, but I carry the lesson with me. Wherever I land, I look for the people who will let me show up twice. I try to be one of those people for someone else. That is most of it. The rest is good soup.`,
  },
  {
    title: 'A Freelancer’s Honest Guide to Money',
    slug: 'a-freelancers-honest-guide-to-money',
    author: 'dev',
    excerpt:
      'Taxes, late invoices, feast-or-famine months and the spreadsheet that finally made me feel less afraid. Practical, boring, freeing.',
    category: 'Finance',
    tags: ['freelance', 'money', 'career'],
    coverTheme: 'grid',
    daysAgo: 27,
    views: 2560,
    likes: ['maya', 'arjun', 'lena', 'noah'],
    content: `The first invoice I sent as a freelancer had a typo in the amount. I noticed three days after sending it and spent an hour drafting an apology that made it sound like a deliberate rounding decision. The client paid it. I ate rice for a week and called it minimalism.

Freelance money is not hard because the numbers are complicated. It is hard because nobody schedules a meeting about it. You are the finance department, the collections team and the anxious person all at once.

## The three buckets

The single most useful change I made was to stop treating incoming money as spendable money. Every payment now gets split immediately:

- **Tax bucket (25–30%).** It is not yours. Moving it the day it arrives is the only way I have found to make peace with it.
- **Business bucket (10%).** Software, equipment, a course, the accountant. It has its own account and its own tiny dignity.
- **Life bucket.** Everything else, including the occasional expensive coffee.

The percentages are not doctrine. Pick numbers you can actually follow and adjust them when reality disagrees.

## Pay yourself a salary

The feast-or-famine cycle is exhausting because every good month feels like permission and every quiet month feels like failure. A fixed monthly transfer to yourself smooths both. Save the surplus in a buffer; if the buffer runs dry, pay yourself less next month. Just keep the rhythm.

I use a spreadsheet with three columns: **invoiced**, **expected**, **received**. "Expected" is the deal I am most likely to make, not the one I am dreaming about. The gap between expected and received is my real stress level. Now I can see it before it becomes a bad week.

## Invoices are tiny contracts

A few small habits that have saved me real money:

- Invoice the same day the work ships. Not "end of month". Not "when I get around to it".
- Put a due date and a late fee on every invoice. Most clients pay on time; the ones who do not, pay later.
- Chase politely at seven days, then again at fourteen. Block new work until the old work is paid.
- Keep a folder of signed agreements. "We agreed on a call" is not a folder.

## The part nobody says

You will have a month where it all goes wrong: a client disappears, a tax bill lands, the laptop dies. The goal is not to be immune. The goal is to have a buffer, a few repeat clients, and enough records that you can make a calm decision instead of a desperate one.

Money is not the measure of your worth as an artist. But knowing where it is going is part of the freedom you were promised. The spreadsheet is boring. The feeling of opening it without dread is not.`,
  },
  {
    title: 'Tiny Joys, Big Impact: A Case for Noticing',
    slug: 'tiny-joys-big-impact-a-case-for-noticing',
    author: 'lena',
    excerpt:
      'A handwritten note, a good ice cube, the first ten seconds of a favourite song. What happens when we stop saving joy for the big occasions.',
    category: 'Wellness',
    tags: ['mindfulness', 'gratitude', 'lifestyle'],
    coverTheme: 'paper',
    daysAgo: 30,
    views: 3010,
    likes: ['sofia', 'maya', 'noah'],
    content: `The other morning I watched a woman at the bus stop carefully peel an orange. She had a system: score the skin in four, peel it in one piece, divide the segments into a small tin. For ninety seconds she was completely absorbed in the task. It was, in the most ordinary way, beautiful.

I have a bad habit of saving my attention for the big things. The trip, the launch, the once-in-a-lifetime sunset. Everything else is transit. But most of a life is transit. If I only show up for the highlights, I miss the actual thing.

## Joy is not the same as happiness

Happiness is a weather condition. Joy, the tiny kind, is more like a practice of noticing. It does not require the day to be good. It requires you to be there when something small goes right.

A few from my own list:

- The first sip of water after a long walk.
- The sound of a page turning in a quiet room.
- Finding money in a coat pocket. Even one euro. Irrationally good.
- The specific silence of fresh snow.
- A message from a friend that says nothing more than "thinking of you".
- The smell of a stationers when you walk in.

## The noticing muscle

Like any muscle, it needs use. I keep a note in my phone called "small good things". It has one rule: no big events. No promotions, no birthdays, no holidays. Only the ordinary kind, logged when I catch them.

The effect is not that my life becomes endless delight. It is that the balance shifts. On a hard day, I can scroll through that note and find evidence that the day also contained something soft. The evidence was there all along. I just had not been collecting it.

> You do not need a better life to have a more vivid one. You need a little more attention.

## A gentler ambition

This is not an argument against big dreams. Have them. Build the thing. Take the trip. But do not make joy conditional on them. The big moments are rare and often arrive with logistics attached. The small ones are everywhere, and they are free.

Tonight, before you close your eyes, try to find one thing that was quietly good. Not the whole day. One thing. The texture of a blanket, the taste of the last biscuit, the way someone said your name. That is not a small life. That is a life, noticed.`,
  },
  {
    title: 'The First 90 Days of Learning to Code',
    slug: 'the-first-90-days-of-learning-to-code',
    author: 'arjun',
    excerpt:
      'What actually helped, what was a waste of time, and how to keep going when the tutorials arrange themselves into a wall.',
    category: 'Career',
    tags: ['learning', 'code', 'career'],
    coverTheme: 'lime',
    daysAgo: 33,
    views: 3670,
    likes: ['maya', 'noah', 'dev', 'lena'],
    content: `On day one, I opened a code editor, typed my name into a console and felt like a wizard. On day forty, I sat in front of a tutorial for two hours and understood nothing. On day eighty-nine, I shipped a tiny website and sent it to my sister. She replied with a heart emoji. It was enough.

Learning to code in the beginning is less like climbing a staircase and more like walking through a forest that keeps rearranging itself. Here is what I wish someone had told me.

## Days 1–30: make things visible

Do not start with a six-hundred-page book or a course that promises a job in twelve weeks. Start with output. Small pages, small buttons, small changes you can see.

The first month is about cause and effect. You change a line, the page changes. You write a loop, five boxes appear. That feedback loop is the engine; protect it.

- Pick one language and stay there. JavaScript or Python are friendly first doors.
- Build three tiny things: a to-do list, a quote generator, a page about something you love.
- Learn to read error messages out loud. They are not insults. They are directions.
- Finish one thing. The ego boost is part of the curriculum.

## Days 31–60: get uncomfortable

This is where tutorials stop working, because tutorials are a warm bath. You need the cold shock of building something without a script.

Take a thing you use and make a small, worse version. A weather page. A recipe list. A calculator for splitting the bill. You will get stuck. Good. That is the actual subject matter.

When you are stuck for more than forty minutes, pause and write the problem in one sentence. Then search that sentence. Then ask a human. The skill of asking a good technical question is more valuable than memorising syntax.

## Days 61–90: learn in public

Share what you are making. Not because it is impressive — most of it will not be — but because explaining a thing is the fastest way to find the holes in your understanding. A short post, a screenshot, a note in a community. The feedback is often kinder than you expect.

Also, learn just enough Git to be dangerous. Commit often. A messy history is better than a panic-inducing folder called "final-final-2".

> The point of the first ninety days is not to be good. It is to become someone who keeps going.

## What I would skip

I spent too long comparing frameworks, organising folders and watching setup videos. None of it was harmful, exactly, but none of it made me better at thinking like a programmer. I would skip the perfect setup and write something ugly instead.

I also wish I had rested more. Burnout is not a badge. The people who last are not the ones who sprint through the first three months; they are the ones who build a life where learning can continue.

Ninety days will not make you an expert. It will make you a beginner with momentum. That is a remarkable thing to be.`,
  },
  {
    title: 'How to Read More Without Making It a Chore',
    slug: 'how-to-read-more-without-making-it-a-chore',
    author: 'dev',
    excerpt:
      'Ditch the reading goals, allow the abandoned books and keep something delicious by the bed. A gentle approach to a lifelong habit.',
    category: 'Life',
    tags: ['books', 'reading', 'habits'],
    coverTheme: 'paper',
    daysAgo: 36,
    views: 2230,
    likes: ['maya', 'lena', 'sofia'],
    content: `Every January I used to set a reading goal. Fifty books. Fifty-two. A nice round number with no relationship to my actual life. By March I would be fifty pages into a book I did not like, refusing to start anything else because the goal was watching.

The year I stopped counting, I read more than ever. Not because I am disciplined. Because I accidentally made reading pleasant again.

## Let books be a mood, not a task

The first change was permission to abandon. Life is short and books are plentiful. If a book has not given me a reason to come back after fifty pages, it is not a moral failure to put it down. It is a library getting a little more honest.

I keep three kinds of books around: one that is delicious (a mystery, a memoir, something with plot), one that is slow and nourishing (essays, nature writing), and one that is useful (a craft book I can dip into). I pick up whichever matches the day. No guilt about the one I am not reading.

## Put it where your hands already are

This is the whole trick, if there is one. Reading happens when the book is closer than the phone.

I have a book on the sofa, one by the bed and one in my bag. Not a fancy system. Just proximity. When I make tea, I read a page while the water boils. When I am waiting for a friend, I read instead of scrolling. Those little pockets add up to a real habit.

## The five-page rule

If I want to read but feel restless, I use a five-page rule: just five pages, then I can stop.

I almost never stop at five. The hardest part of reading is the transition from doing to sitting still. Five pages is a small enough door to walk through. Once inside, the room is quiet.

> A reading habit is not built by finishing books. It is built by returning to them.

## Let go of the finish line

Some books take months. Some are read in two feverish days. Some are never finished, and still change the way I think. The number on the cover is not a contract.

The older I get, the more I care about the texture of reading: the sentence I underlined, the idea I repeated to a friend, the evening that disappeared into a story. That is the actual library I am building.

So here is my very unambitious advice: put a good book somewhere you will bump into it, lower the stakes, and read five pages. Then see what happens.`,
  },
  {
    title: 'Your Idea Is Allowed to Change',
    slug: 'your-idea-is-allowed-to-change',
    author: 'maya',
    excerpt:
      'The project you started is not a promise you made to your past self. Notes on creative evolution, sunk costs and the courage to follow the interesting part.',
    category: 'Creativity',
    tags: ['creativity', 'ideas', 'writing'],
    coverTheme: 'orbit',
    daysAgo: 40,
    views: 1840,
    likes: ['arjun', 'lena', 'noah'],
    content: `I once spent six months writing an essay about one thing, only to discover on the final edit that it was really about something else. The original idea was not wrong. It was a stepping stone that had been wearing a very convincing costume.

The temptation was to force it back. I had outlined it. I had told people about it. I had a folder named after it. Changing course felt like admitting I had wasted six months.

But creative work is not a train timetable. An idea is a living thing; if it never changes, it is probably not alive.

## Sunk costs are not a compass

The phrase "I have come too far to stop" is one of the most expensive sentences in creative life. It sounds like commitment. Often it is just accounting.

The time you spent is not a reason to keep spending time. The only question that matters is: is the thing in front of me still interesting? If yes, continue. If no, what is lying just underneath it that is?

## Follow the heat

A teacher of mine used to say: follow the heat. When you are making something, notice which parts you are excited to get back to. Which paragraphs you rewrite with energy. Which scene you keep describing to friends.

That heat is data. It is not always comfortable; sometimes it points to the part you are afraid of writing. But it is more trustworthy than a plan made by a less-informed version of you.

## Practical permission slips

If you are stuck in a project that has outgrown its original shape, try this:

- Write a one-line description of the project as it is right now. Not as it was supposed to be.
- Circle the part that still feels alive. Build the next week around that.
- Give yourself a ceremonial release from the old outline. Rename the file. Literally. A new name helps.
- Tell one person the new version out loud. Notice where you stumble.

> The work does not owe your original plan a loyalty oath.

## Keep the evidence

I still have the notes from that six-month essay. The final piece is in a folder with a different name, and the original concept lives inside it like a fossil. I like that. It reminds me that the detour was not a failure; it was the route.

Whatever you are making, let it become the thing it wants to be. You can always keep a small shrine to the first idea. Just do not let it hold the new one hostage.`,
  },
  {
    title: 'The Case for the Unpolished Draft',
    slug: 'the-case-for-the-unpolished-draft',
    author: 'lena',
    excerpt:
      'We are told to find our voice before we speak. A softer approach: write badly, on purpose, and let the voice find you.',
    category: 'Creativity',
    tags: ['writing', 'creativity', 'drafts'],
    coverTheme: 'ink',
    daysAgo: 44,
    views: 1520,
    likes: ['maya', 'dev', 'arjun'],
    content: `My first drafts are bad in a very specific way. They are over-explained, they begin three times before they begin, and they contain at least one metaphor I would not defend in court. I used to think this was evidence that I was not a natural writer.

Now I think it is evidence that I am writing.

## The polished voice is a myth

We are sold a story about writers who sit down and produce a voice fully formed, like Athena from the head of Zeus. The truth is less photogenic. Voice is what remains after you have written a lot of sentences that are not your voice and crossed most of them out.

You cannot edit a blank page. You can only edit something. The unpolished draft is not the embarrassing part before the real work. It is the raw material that makes the real work possible.

## The terrible-first-sentence rule

When I am stuck, I write the most obvious, clunky sentence I can manage and keep going. "I want to write about how I feel on Sundays." It is not good. It is true, and it is moving. That is enough to start.

I also write notes to myself in the margins: "This sounds fake. Why? Maybe because the real feeling is X." The notes are often more alive than the paragraph. Later, they become the paragraph.

## Drafts are for you; revisions are for a reader

A useful shift: a first draft is an argument with yourself. Revisions are where you hold the door open for someone else. They do not need to be the same activity. In fact, trying to do both at once is why so many of us freeze.

So I write warm and messy. Then I leave it alone for a day. Then I come back with a cold eye and a warm heart: cut the explanation, keep the image, find the sentence that made me feel something, and build the next one next to it.

> Your voice is not the thing you find before you write. It is the thing that survives your revisions.

## An invitation to write badly

If you have been waiting to feel ready, consider this your very low bar: write one paragraph that you do not intend to show anyone. Let it be sentimental. Let it be contradictory. Let it have a typo.

Notice that the world does not end. Notice that, somewhere in the mess, there is a sentence only you would have written. That sentence is the beginning of the real thing.

You can polish it tomorrow. Today, just get it down.`,
  },
  {
    title: 'What I Learned From Deleting 10,000 Lines of Code',
    slug: 'what-i-learned-from-deleting-10000-lines-of-code',
    author: 'arjun',
    excerpt:
      'A failed rebuild turned into the best thing that happened to our codebase. Notes on simplicity, ego and the relief of letting go.',
    category: 'Technology',
    tags: ['code', 'career', 'learning'],
    coverTheme: 'grid',
    daysAgo: 50,
    views: 2870,
    likes: ['noah', 'maya', 'dev'],
    content: `The pull request was titled "cleanup". It was not a cleanup. It was a controlled demolition: 10,000 lines removed, 3,000 added, four services collapsed into one. I clicked merge on a Friday afternoon and spent the weekend waiting for a disaster that never came.

Six months later, our deploy time was down from eleven minutes to under two. The pager was quieter. New engineers could hold the architecture in their heads. Nothing had been lost except a great deal of code I had once been proud of.

## How the mess gets built

Almost none of the code we deleted was written by a careless person. It was written by people like me, solving a real problem under real pressure, one small abstraction at a time. Each piece made sense locally. The whole did not.

We had built a factory inside a bakery. There were queues, pipelines and a small event bus for things that happened exactly once a day because, at the time, "what if we need to scale?" felt like a serious question.

## The simplification test

The change that helped most was not technical. We started asking, in every design review, "What is the simplest thing that could possibly work for the next six months?"

Not forever. Not at ten times the traffic. Just the next six months, with the information we actually had. The question made us admit that most of our complexity was a bet on a future we had not earned yet.

> Code is a liability with excellent marketing. Features are the asset.

## What we kept

Simplicity is not minimalism for its own sake. We kept the database, the tests that caught real bugs, the boring error handling and the one abstraction that truly reduced duplication. We deleted the clever bits: the custom cache, the generic plugin system, the homegrown queue.

We also kept a document called "why we deleted it", because future us would need the reasoning more than the implementation. That document is now the most-read page in our internal wiki.

## The ego part

Deleting my own code felt like admitting I had been wrong. Some of it, I was. But the more honest lesson is that I had been right for a moment that had passed. The context changed. The code did not.

Good engineering is not a monument to your past decisions. It is a practice of leaving the next person — often future you — a smaller, clearer room to work in.

Ten thousand lines is not a record. It is a reminder. The best code is the code you do not have to read at 2am.`,
  },
  {
    title: 'A Field Guide to Eating Alone (and Loving It)',
    slug: 'a-field-guide-to-eating-alone',
    author: 'sofia',
    excerpt:
      'The awkward first ten minutes, the joy of ordering exactly what you want, and why a table for one is one of travel’s great pleasures.',
    category: 'Culture',
    tags: ['food', 'culture', 'travel'],
    coverTheme: 'lime',
    daysAgo: 55,
    views: 1740,
    likes: ['maya', 'lena', 'dev', 'noah'],
    content: `The first time I ate alone in a restaurant, I brought a book as a shield. I read the same paragraph four times, ordered the safest thing on the menu and left a tip large enough to apologise for my existence.

I have since eaten alone in roughly twenty cities. I am not brave. I have simply learned that a table for one is a different kind of table, and it has its own pleasures.

## The first ten minutes are the price

Let me be honest: the beginning is awkward. You are aware of your own posture. You wonder if the waiter feels sorry for you. You may check your phone with the intensity of someone defusing a bomb.

It passes. Order something. Look around. The restaurant is not a theatre in which you are the only act; most people are deeply involved in their own tables. This is one of the great consolations of adult life.

## What you get back

When the shield comes down, something opens up. You notice the food in a way that is harder with company. You can order the strange thing. You can take twenty minutes longer than anyone would want to. You can eavesdrop, gently, on the couple next to you arguing about a sofa. You can leave when you are done.

> Eating alone is not a test of confidence. It is a chance to be excellent company to yourself.

## Practical, unglamorous advice

- **Sit at the bar.** It is the friendliest seat in the house, and you can watch the kitchen work.
- **Bring a notebook, not just a phone.** Writing is a softer shield and often turns into the best part of the meal.
- **Order one thing that is a little unusual.** The whole point is that you do not have to negotiate.
- **Do not rush.** The restaurant is not waiting for you to finish. That is the luxury.

## A seat by the window

There was a tiny place in Porto where I ate alone three nights in a row. The owner started bringing me a small extra thing without asking. On the last night, she sat down for a minute and asked where I was from. It was not a grand connection. It was a small, warm one, made possible by the fact that I had showed up as one person, willing to be there.

That is the thing travel keeps teaching me. You do not need a companion to have a full experience. Sometimes the table for one is where the whole city comes to sit with you.`,
  },
  {
    title: 'The Soft Art of Saying No',
    slug: 'the-soft-art-of-saying-no',
    author: 'maya',
    excerpt: 'A working draft on boundaries, generous honesty and making room for the things that matter.',
    category: 'Life',
    tags: ['boundaries', 'focus', 'wellness'],
    coverTheme: 'orbit',
    status: 'draft',
    daysAgo: 1,
    views: 0,
    likes: [],
    content: `This is a draft that I keep coming back to. There is a version of "no" that is not a wall but a door — a way of being honest about what I can hold without making the other person feel small.

I am collecting the sentences that have helped: "I can't take this on right now, but I hope it goes beautifully." "I need to check what I have room for." "I want to say yes, and I know I would be unreliable."

Maybe the essay is about the difference between withdrawing and being clear. Still figuring it out.`,
  },
  {
    title: 'Notes on a Paper Notebook',
    slug: 'notes-on-a-paper-notebook',
    author: 'maya',
    excerpt: 'What happens when the thinking tool cannot notify you.',
    category: 'Creativity',
    tags: ['writing', 'slow living', 'creativity'],
    coverTheme: 'paper',
    status: 'draft',
    daysAgo: 2,
    views: 0,
    likes: [],
    content: `A notebook does not sync. It does not have a search bar. It cannot remind me that I have not written in it for three days. These are supposed to be limitations, and most days I experience them as relief.

I want to write about the texture of thinking on paper: the way an idea looks different when it is not auto-corrected, the way a page ending tells you to stop. There is a rhythm to it that I keep forgetting and then rediscovering.

This is a draft. The ending is still somewhere in the middle.`,
  },
];

export const seedComments = [
  { slug: 'the-quiet-power-of-doing-one-thing-at-a-time', author: 'lena', content: 'The line about attention being a place you choose to live has stayed with me all week. I put my phone in a drawer yesterday and felt almost scandalous.', daysAgo: 2 },
  { slug: 'the-quiet-power-of-doing-one-thing-at-a-time', author: 'noah', content: 'I tried the 3-item starter list this morning. Finished two things before 10am. Immediately fought the urge to add five more.', daysAgo: 1 },
  { slug: 'building-in-public-for-beginners', author: 'maya', content: '“An audience is not a manager” should be framed. I needed this permission to keep my Sundays private.', daysAgo: 5 },
  { slug: 'building-in-public-for-beginners', author: 'dev', content: 'The specific-problem framing is so much better than another thread of vague lessons. Saving this for my next update.', daysAgo: 4 },
  { slug: 'slow-travel-a-love-letter-to-getting-lost', author: 'lena', content: 'The shoe repairman detail undid me. I am booking a train ticket with no plan this spring.', daysAgo: 8 },
  { slug: 'designing-for-delight-not-dopamine', author: 'noah', content: 'The light-switch test is going straight into our design review template. Especially the question about what happens when someone leaves.', daysAgo: 10 },
  { slug: 'designing-for-delight-not-dopamine', author: 'arjun', content: 'I have been guilty of the streak feature. This made me reconsider what we are actually optimising for.', daysAgo: 9 },
  { slug: 'your-side-project-deserves-a-weekend', author: 'maya', content: '“A finished small thing is a conversation” — yes. My folder of 80% ideas feels personally called out.', daysAgo: 13 },
  { slug: 'the-art-of-the-sunday-reset', author: 'sofia', content: 'What can I take off my plate is the only reset question I need. The rest is just admin with better lighting.', daysAgo: 16 },
  { slug: 'css-is-having-a-moment', author: 'arjun', content: 'Container queries genuinely changed how I structure components. The quiet deletion of JS workarounds is the real win.', daysAgo: 19 },
  { slug: 'css-is-having-a-moment', author: 'maya', content: 'The idea of modern CSS as permission to delete code is a lovely way to put it.', daysAgo: 18 },
  { slug: 'what-moving-taught-me-about-belonging', author: 'dev', content: 'Show up the second time. And the fourth. I moved last year and this is exactly the thing nobody tells you.', daysAgo: 22 },
  { slug: 'a-freelancers-honest-guide-to-money', author: 'lena', content: 'The tax bucket saved my December. I wish someone had explained the three-bucket split before my first invoice.', daysAgo: 25 },
  { slug: 'a-freelancers-honest-guide-to-money', author: 'noah', content: '“Invoices are tiny contracts” is the least glamorous and most useful sentence on the internet today.', daysAgo: 24 },
  { slug: 'tiny-joys-big-impact-a-case-for-noticing', author: 'maya', content: 'Started a small good things note after reading this. The first entry was a perfectly ripe pear. No regrets.', daysAgo: 27 },
  { slug: 'the-first-90-days-of-learning-to-code', author: 'noah', content: 'Day forty is so real. The tutorial wall is a rite of passage. I wish I had known to build ugly things sooner.', daysAgo: 31 },
  { slug: 'how-to-read-more-without-making-it-a-chore', author: 'lena', content: 'I abandoned two books this week with your blessing and immediately started a third. Feeling lighter already.', daysAgo: 34 },
  { slug: 'your-idea-is-allowed-to-change', author: 'lena', content: 'The sixth-month essay with a different name is such a comforting image. Thank you for this.', daysAgo: 38 },
  { slug: 'the-case-for-the-unpolished-draft', author: 'dev', content: 'Wrote a deliberately bad paragraph before breakfast. It was freeing and also slightly good?', daysAgo: 42 },
  { slug: 'what-i-learned-from-deleting-10000-lines-of-code', author: 'noah', content: 'A factory inside a bakery. I have worked in that building. The “why we deleted it” doc is a brilliant idea.', daysAgo: 47 },
  { slug: 'a-field-guide-to-eating-alone', author: 'maya', content: 'Sitting at the bar is the best travel advice in this whole piece. Also, the book-as-shield is deeply relatable.', daysAgo: 52 },
];
