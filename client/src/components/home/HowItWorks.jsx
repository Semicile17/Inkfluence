import { Link } from 'react-router-dom';
import { ArrowRight, PenLine, Sparkles, Users } from 'lucide-react';
import { buttonStyles } from '../ui/Button.jsx';
import { Asterisk, Scribble } from '../ui/Doodles.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { openMuse } from '../../lib/utils.js';

const steps = [
  {
    number: '01',
    icon: PenLine,
    title: 'Make a little room',
    text: 'Create a free account. Pick a name, add a sentence about yourself, and leave the rest for later.',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'Write like yourself',
    text: 'A calm markdown editor, live preview and drafts that wait for you. Publish when it feels ready — not before.',
  },
  {
    number: '03',
    icon: Users,
    title: 'Find your people',
    text: 'Readers can follow, like, save and talk back. Muse helps the right story find the right person.',
  },
];

export default function HowItWorks() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-lime-400 p-6 sm:rounded-[2.5rem] sm:p-10 lg:p-14">
      <Asterisk className="absolute -right-8 -top-8 h-36 w-36 text-ink/10" />
      <Scribble className="absolute bottom-5 right-8 hidden w-40 text-ink/20 lg:block" />

      <div className="relative grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-12">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white/60 px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-ink/60">
            For writers
          </span>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-4xl lg:text-[3rem]">
            A quieter place
            <br />
            to publish.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/65">
            No follower-count anxiety. No algorithm to appease. Just a good editor,
            a growing library and people who actually read.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link to={isAuthenticated ? '/write' : '/register'} className={buttonStyles('dark', 'md')}>
              {isAuthenticated ? 'Write a story' : 'Join free'}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => openMuse('Which story should I read before I start writing?')}
              className={buttonStyles('outline', 'md', 'bg-white/40')}
            >
              Ask Muse
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="group flex flex-col rounded-2xl border border-ink/10 bg-cream/95 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-soft"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-ink/30">{step.number}</span>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-lime-400 transition duration-300 group-hover:rotate-12">
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <h3 className="mt-6 font-display text-lg font-semibold leading-tight">{step.title}</h3>
                <p className="mt-2 text-[11.5px] leading-relaxed text-ink/50">{step.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
