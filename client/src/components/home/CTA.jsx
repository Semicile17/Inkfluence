import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { buttonStyles } from '../ui/Button.jsx';
import { Asterisk, Smiley, Sparkle } from '../ui/Doodles.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { openMuse } from '../../lib/utils.js';

export default function CTA() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="container-ink pb-20">
      <div className="relative overflow-hidden rounded-[2rem] bg-lime-400 px-6 py-12 sm:rounded-[2.5rem] sm:px-12 sm:py-16">
        <Asterisk className="absolute -left-10 -top-10 h-40 w-40 text-ink/10" />
        <Sparkle className="absolute bottom-8 left-1/2 h-8 w-8 text-ink/20" />
        <Smiley className="absolute -bottom-6 right-10 hidden h-28 w-28 rotate-12 sm:block" />
        <span className="absolute right-40 top-10 hidden h-20 w-20 rounded-full border border-ink/15 lg:block" />
        <span className="absolute right-28 top-24 hidden h-10 w-10 rounded-full border border-ink/15 lg:block" />

        <div className="relative max-w-2xl">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">
            come for the words
          </span>
          <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.7rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-ink">
            Your next favourite
            <br />
            sentence is waiting.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/65">
            Bring a curiosity, leave with a story. Or bring a story, and find the
            people who needed to read it.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/explore" className={buttonStyles('dark', 'lg')}>
              Start reading <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to={isAuthenticated ? '/write' : '/register'}
              className={buttonStyles('outline', 'lg', 'border-ink/20 bg-white/30')}
            >
              {isAuthenticated ? 'Write something' : 'Create your account'}
            </Link>
            <button
              type="button"
              onClick={() => openMuse('Surprise me with a story')}
              className="inline-flex items-center gap-1.5 self-center rounded-full px-3 py-2 text-sm font-medium text-ink/60 transition hover:text-ink"
            >
              <Sparkles className="h-4 w-4" /> Surprise me
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
