import Logo from '../ui/Logo.jsx';
import BlogCover from '../ui/BlogCover.jsx';
import { Asterisk, Smiley, Sparkle } from '../ui/Doodles.jsx';

export default function AuthShell({ eyebrow, title, subtitle, children, footer, mode = 'login' }) {
  const isLogin = mode === 'login';

  return (
    <section className="container-ink py-8 sm:py-12 lg:py-16">
      <div className="grid overflow-hidden rounded-[2rem] border border-ink/10 bg-white shadow-soft lg:grid-cols-[1.02fr_0.98fr]">
        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-14 lg:px-14">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>

          <span className="eyebrow w-fit">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-500" />
            {eyebrow}
          </span>
          <h1 className="mt-4 font-display text-[clamp(2.2rem,4vw,3rem)] font-semibold leading-[1] tracking-[-0.05em]">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink/50">{subtitle}</p>

          <div className="mt-7">{children}</div>

          {footer && <div className="mt-6 text-sm text-ink/50">{footer}</div>}
        </div>

        <div className="relative hidden overflow-hidden bg-ink p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-lime-400" />
          <div className="pointer-events-none absolute -right-2 top-24 h-32 w-32 rounded-full border border-white/10" />
          <Asterisk className="absolute bottom-40 -left-8 h-40 w-40 text-white/[0.04]" />
          <Sparkle className="absolute bottom-10 right-10 h-10 w-10 text-lime-400/60" />

          <div className="relative">
            <Logo dark />
            <p className="mt-6 max-w-xs font-display text-2xl font-medium leading-snug tracking-[-0.02em] text-white/85">
              “{isLogin ? 'Pick up where you left off. The good sentences kept your place.' : 'Write the thing you keep meaning to write. We saved you a chair.'}”
            </p>
            <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">
              — the inkfluence manifesto, roughly
            </p>
          </div>

          <div className="relative mt-10">
            <div className="rotate-[-2deg] rounded-2xl border border-white/15 bg-white/[0.06] p-3 backdrop-blur">
              <div className="rounded-xl bg-cream p-3 text-ink">
                <BlogCover
                  theme={isLogin ? 'orbit' : 'lime'}
                  className="aspect-[16/8] rounded-lg"
                  title="A quiet place to read and write"
                  showLabel={false}
                />
                <div className="mt-3 flex items-center justify-between px-1 pb-1">
                  <div>
                    <p className="font-display text-sm font-bold">
                      {isLogin ? 'Your reading list is waiting' : 'Your first story starts here'}
                    </p>
                    <p className="mt-0.5 text-[10px] text-ink/40">
                      {isLogin ? '3 saved stories · 1 draft in progress' : 'Free forever · no card, no catch'}
                    </p>
                  </div>
                  <Smiley className="h-8 w-8" />
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5 text-[10px] text-white/40">
              <span className="flex flex-col gap-1">
                <span className="text-lg font-semibold text-lime-400">1.2k</span>
                curious readers
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-lg font-semibold text-lime-400">100%</span>
                free to write
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-lg font-semibold text-lime-400">∞</span>
                good sentences
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
