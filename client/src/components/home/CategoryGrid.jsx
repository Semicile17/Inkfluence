import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Sparkle } from '../ui/Doodles.jsx';

const blurbs = {
  Technology: 'Code, craft and the things we build.',
  Design: 'Taste, interfaces and tiny details.',
  Life: 'Attention, habits and ordinary days.',
  Career: 'Work, pivots and the messy middle.',
  Travel: 'Slow routes and side streets.',
  Culture: 'Belonging, food and being human.',
  Wellness: 'Rest, rituals and gentler rhythms.',
  Business: 'Building things that matter.',
  Creativity: 'Ideas, drafts and creative courage.',
  Finance: 'Money, minus the mystery.',
};

const tones = [
  'bg-lime-400 text-ink',
  'bg-ink text-white',
  'bg-white text-ink',
  'bg-white text-ink',
  'bg-lime-200 text-ink',
  'bg-ink text-white',
];

export default function CategoryGrid({ categories = [] }) {
  const display = categories.slice(0, 6);
  if (!display.length) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {display.map((category, index) => {
        const tone = tones[index % tones.length];
        const isLime = tone.includes('lime');
        const isDark = tone.includes('bg-ink');

        return (
          <Link
            key={category.name}
            to={`/explore?category=${encodeURIComponent(category.name)}`}
            className={`group relative flex min-h-[165px] flex-col justify-between overflow-hidden rounded-3xl border border-ink/10 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-soft sm:p-6 ${tone}`}
          >
            <div className="flex items-start justify-between">
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                  isDark ? 'bg-white/10 text-white/60' : 'bg-ink/[0.06] text-ink/50'
                }`}
              >
                {category.count} {category.count === 1 ? 'story' : 'stories'}
              </span>
              <span
                className={`grid h-8 w-8 place-items-center rounded-full transition-transform duration-300 group-hover:rotate-45 ${
                  isDark
                    ? 'bg-lime-400 text-ink'
                    : isLime
                      ? 'bg-ink text-lime-400'
                      : 'border border-ink/15 text-ink'
                }`}
              >
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>

            <div className="relative">
              <h3 className="font-display text-2xl font-semibold tracking-[-0.03em] sm:text-[1.7rem]">
                {category.name}
              </h3>
              <p className={`mt-1 max-w-[230px] text-xs leading-relaxed ${isDark ? 'text-white/45' : 'text-ink/45'}`}>
                {blurbs[category.name] || 'Stories worth your attention.'}
              </p>
              <Sparkle
                className={`absolute -bottom-5 -right-3 h-16 w-16 opacity-0 transition duration-300 group-hover:opacity-20 ${
                  isDark ? 'text-lime-400' : 'text-ink'
                }`}
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
