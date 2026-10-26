import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import BlogCover from '../ui/BlogCover.jsx';
import Avatar from '../ui/Avatar.jsx';
import { buttonStyles } from '../ui/Button.jsx';
import { Asterisk, GridDots, Smiley, Sparkle } from '../ui/Doodles.jsx';
import { categoryTone, formatNumber, openMuse } from '../../lib/utils.js';
import { useAuth } from '../../context/AuthContext.jsx';

function HeroArt({ featured }) {
  const fallback = {
    title: 'The Quiet Power of Doing One Thing at a Time',
    slug: 'the-quiet-power-of-doing-one-thing-at-a-time',
    coverTheme: 'lime',
    category: 'Life',
    readTime: 3,
    author: { name: 'Maya Chen', username: 'maya' },
  };
  const story = featured || fallback;

  return (
    <div className="relative mx-auto w-full max-w-[500px]">
      <div className="absolute left-1/2 top-1/2 h-[86%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-400/80 blur-[1px]" />
      <GridDots className="absolute -left-4 top-10 hidden h-20 w-20 text-ink/20 sm:block" />
      <Asterisk className="absolute -right-3 -top-2 h-16 w-16 rotate-12 text-ink sm:h-20 sm:w-20" />
      <span className="absolute -right-2 top-28 hidden rounded-full border border-ink/15 bg-white px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-ink/55 shadow-sm sm:block">
        no paywalls ✳ ever
      </span>

      <div className="relative rotate-[-2.5deg] rounded-[1.8rem] border border-ink/15 bg-cream p-2.5 shadow-lift transition-transform duration-500 hover:rotate-0 sm:p-3">
        <div className="overflow-hidden rounded-[1.35rem] border border-ink/10 bg-white">
          <div className="flex items-center justify-between border-b border-ink/10 px-3 py-2">
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-ink/20" />
              <span className="h-1.5 w-1.5 rounded-full bg-ink/20" />
              <span className="h-1.5 w-1.5 rounded-full bg-ink/20" />
            </div>
            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-ink/35">
              inkfluence / today
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-lime-500" />
          </div>

          <Link to={`/blog/${story.slug}`} className="group block">
            <BlogCover
              theme={story.coverTheme}
              coverImage={story.coverImage}
              title={story.title}
              className="aspect-[16/9]"
            />
            <div className="p-4 sm:p-5">
              <div className="flex items-center gap-2 text-[10px] font-medium text-ink/45">
                <span
                  className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider ${
                    categoryTone[story.category] || 'bg-paper text-ink'
                  }`}
                >
                  {story.category}
                </span>
                <span>{story.readTime || 3} min read</span>
              </div>
              <h2 className="mt-2 font-display text-lg font-semibold leading-tight tracking-tight text-ink transition-colors group-hover:text-ink/70 sm:text-xl">
                {story.title}
              </h2>
              <div className="mt-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Avatar user={story.author} size="xs" />
                  <span className="text-[10px] font-medium text-ink/55">{story.author?.name}</span>
                </span>
                <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-lime-400 transition group-hover:bg-ink-700">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="absolute -bottom-5 -left-2 flex items-center gap-2.5 rounded-2xl border border-ink/10 bg-white px-3 py-2.5 shadow-soft sm:-left-8">
        <Smiley className="h-9 w-9" />
        <div>
          <p className="font-display text-xs font-bold leading-none">{formatNumber(1200)}+ readers</p>
          <p className="mt-1 text-[9px] text-ink/40">found their next favourite</p>
        </div>
      </div>

      <div className="absolute -bottom-2 -right-1 hidden rotate-6 rounded-full border border-ink/15 bg-lime-300 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-ink shadow-sm sm:block">
        slow living ✳ design
      </div>

      <span className="absolute right-10 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-ink/15 bg-white text-ink shadow-sm md:grid">
        <Sparkles className="h-5 w-5" />
      </span>
    </div>
  );
}

function StatsBar({ stats, loading }) {
  const items = [
    { label: 'stories growing here', value: stats?.stories, suffix: '' },
    { label: 'curious readers', value: stats?.reads, suffix: '' },
    { label: 'writers in residence', value: stats?.writers, suffix: '' },
    { label: 'nice comments', value: stats?.comments, suffix: '' },
  ];

  return (
    <div className="mt-16 grid grid-cols-2 gap-y-7 rounded-3xl border border-ink/10 bg-white px-6 py-7 sm:grid-cols-4 sm:gap-y-0 sm:divide-x sm:divide-ink/10 sm:px-3">
      {items.map((item) => (
        <div key={item.label} className="px-2 text-center sm:px-5">
          <p className="font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            {loading || item.value === undefined ? (
              <span className="inline-block h-8 w-16 animate-pulse rounded-lg bg-ink/[0.07] align-middle" />
            ) : (
              <>{formatNumber(item.value)}{item.suffix}</>
            )}
          </p>
          <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-ink/35">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function Hero({ featured, stats, loading }) {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-40 top-10 h-80 w-80 rounded-full bg-lime-200/40 blur-3xl" />
      <div className="container-ink relative pb-10 pt-10 sm:pt-14 lg:pb-14 lg:pt-20">
        <div className="grid items-center gap-14 lg:grid-cols-[1.04fr_0.96fr] lg:gap-10">
          <div className="animate-fade-up">
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-500" />
              A home for curious minds
            </span>

            <h1 className="mt-5 font-display text-[clamp(2.9rem,6.3vw,5.25rem)] font-semibold leading-[0.95] tracking-[-0.055em] text-ink">
              Ideas worth
              <br />
              <span className="relative inline-block">
                <span className="mark">getting lost</span>
                <Sparkle className="absolute -right-7 -top-3 h-7 w-7 text-ink/80 sm:-right-9 sm:h-9 sm:w-9" />
              </span>{' '}
              in.
            </h1>

            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink/55 sm:text-base">
              A quieter corner of the internet for essays, field notes and small
              obsessions. Read something that stays with you — then write the thing
              you keep meaning to write.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/explore" className={buttonStyles('dark', 'lg')}>
                Find your next read
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to={isAuthenticated ? '/write' : '/register'} className={buttonStyles('outline', 'lg')}>
                Start writing
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-ink/40">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-lime-500" /> No paywalls
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-lime-500" /> No rage-bait
              </span>
              <button
                type="button"
                onClick={() => openMuse()}
                className="inline-flex items-center gap-1.5 font-medium text-ink/60 transition hover:text-ink"
              >
                <Sparkles className="h-3 w-3" /> Meet Muse, the AI reading buddy
              </button>
            </div>
          </div>

          <div className="relative animate-fade-up [animation-delay:120ms]">
            <HeroArt featured={featured} />
          </div>
        </div>

        <StatsBar stats={stats} loading={loading} />
      </div>
    </section>
  );
}
