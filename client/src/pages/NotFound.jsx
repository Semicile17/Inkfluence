import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { buttonStyles } from '../components/ui/Button.jsx';
import { Smiley, Sparkle, Asterisk } from '../components/ui/Doodles.jsx';

export default function NotFound() {
  return (
    <section className="container-ink py-16 sm:py-24">
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-ink/10 bg-white px-6 py-14 text-center sm:rounded-[2.5rem] sm:px-12 sm:py-20">
        <Sparkle className="absolute -right-6 -top-8 h-40 w-40 text-lime-400" />
        <Asterisk className="absolute -bottom-6 -left-6 h-28 w-28 text-ink/5" />

        <div className="relative">
          <Smiley className="mx-auto h-16 w-16" />
          <p className="mt-6 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-ink/35">
            error 404 · page not found
          </p>
          <h1 className="mt-4 font-display text-[clamp(3.5rem,12vw,7rem)] font-semibold leading-[0.8] tracking-[-0.07em]">
            Well,
            <br />
            <span className="mark">this is awkward.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-ink/50">
            The page you were looking for went for a walk, changed its name, or
            never existed. The stories, thankfully, are still right where we left
            them.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/" className={buttonStyles('dark', 'lg')}>
              <ArrowLeft className="h-4 w-4" /> Back home
            </Link>
            <Link to="/explore" className={buttonStyles('lime', 'lg')}>
              Browse stories <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
