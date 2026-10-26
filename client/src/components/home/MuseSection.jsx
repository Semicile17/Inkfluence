import { ArrowRight, Sparkles, ArrowUpRight } from 'lucide-react';
import BlogCover from '../ui/BlogCover.jsx';
import { buttonStyles } from '../ui/Button.jsx';
import { Smiley, Sparkle } from '../ui/Doodles.jsx';
import { openMuse } from '../../lib/utils.js';

export default function MuseSection({ blog }) {
  const story = blog || {
    title: 'The Art of the Sunday Reset',
    coverTheme: 'paper',
    category: 'Wellness',
    slug: 'the-art-of-the-sunday-reset',
  };

  return (
    <section className="container-ink">
      <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-10 text-white sm:rounded-[2.5rem] sm:p-12 lg:p-16">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-lime-400/15" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full border border-lime-400/15" />
        <Sparkle className="absolute right-8 top-8 h-10 w-10 text-lime-400/40 sm:h-16 sm:w-16" />

        <div className="relative grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-lime-400 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-ink">
              <Sparkles className="h-3.5 w-3.5" />
              Meet Muse
            </span>
            <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-4xl lg:text-[3rem]">
              Can’t decide what to read?
              <br />
              <span className="text-lime-400">Ask a tiny AI</span> with good taste.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/50">
              Tell Muse the mood, the topic, or the kind of day you’re having. It
              searches the real Inkfluence library and hands you stories you can
              open right away. No prompts engineering. No paid subscription.
            </p>

            <ul className="mt-6 grid gap-2.5 text-[13px] text-white/60">
              <li className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
                Recommendations from real stories, not thin air
              </li>
              <li className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
                Works instantly with a free local fallback
              </li>
              <li className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
                One click straight into the article
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => openMuse()}
                className={buttonStyles('lime', 'lg')}
              >
                Ask Muse for a story <ArrowRight className="h-4 w-4" />
              </button>
              <span className="self-center font-mono text-[9px] uppercase tracking-[0.16em] text-white/30">
                free · forever
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-4 -top-4 hidden h-20 w-20 rounded-full bg-lime-400 sm:block" />
            <Smiley className="absolute -bottom-5 -right-3 z-10 hidden h-14 w-14 sm:block" />

            <div className="relative rounded-3xl border border-white/15 bg-white/[0.06] p-3 backdrop-blur sm:p-4">
              <div className="rounded-2xl bg-cream p-3.5 text-ink sm:p-5">
                <div className="flex items-center justify-between border-b border-ink/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-lime-400">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-display text-sm font-bold leading-none">Muse</p>
                      <p className="mt-0.5 flex items-center gap-1 text-[9px] text-ink/40">
                        <span className="h-1 w-1 rounded-full bg-lime-500" /> online · over-caffeinated
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full border border-ink/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider text-ink/35">
                    AI
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex justify-end">
                    <p className="max-w-[85%] rounded-2xl rounded-tr-md bg-ink px-3.5 py-2.5 text-[12px] leading-relaxed text-white/85">
                      I’m in a slow-living mood, but make it funny.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-lime-400">
                      <Sparkles className="h-3 w-3" />
                    </span>
                    <div className="space-y-2">
                      <p className="rounded-2xl rounded-tl-md border border-ink/10 bg-white px-3.5 py-2.5 text-[12px] leading-relaxed text-ink/70">
                        Say less. I’d start with a Sunday reset, then accidentally
                        read about eating alone. Both feel like a deep breath.
                      </p>
                      <a
                        href={`/blog/${story.slug}`}
                        className="group flex items-center gap-2.5 rounded-xl border border-ink/10 bg-white p-2 transition hover:border-ink/30"
                      >
                        <BlogCover
                          theme={story.coverTheme}
                          className="h-10 w-12 shrink-0 rounded-lg"
                          title={story.title}
                          showLabel={false}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-display text-[11px] font-semibold">{story.title}</p>
                          <p className="text-[9px] text-ink/40">{story.category} · 4 min</p>
                        </div>
                        <ArrowUpRight className="mr-1 h-3.5 w-3.5 text-ink/30 transition group-hover:text-ink" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-full border border-ink/10 bg-white px-3 py-2">
                  <span className="flex-1 text-[11px] text-ink/30">Ask for a mood, topic or vibe...</span>
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-lime-400">
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
