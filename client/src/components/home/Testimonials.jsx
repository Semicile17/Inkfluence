import { Star } from 'lucide-react';
import Avatar from '../ui/Avatar.jsx';

const testimonials = [
  {
    quote:
      'It feels like a well-designed reading room, not a slot machine. I came for one essay and stayed for an hour — then wrote my own.',
    name: 'Aisha Rahman',
    role: 'Reader & new writer',
    tone: 'bg-ink text-white',
  },
  {
    quote:
      'Muse actually found me a story about freelance money when I typed “I am terrified of invoices.” Ten out of ten, unsettlingly seen.',
    name: 'Tom Becker',
    role: 'Freelance illustrator',
    tone: 'bg-lime-400 text-ink',
  },
  {
    quote:
      'The editor is the first one I have not abandoned by the second paragraph. Drafts, preview, publish — no ceremony, no clutter.',
    name: 'Priya Nair',
    role: 'Writes about product & people',
    tone: 'bg-white text-ink',
  },
];

export default function Testimonials() {
  return (
    <section className="container-ink pb-20">
      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="mb-4 inline-block rounded-lg bg-lime-400 px-2.5 py-1 font-display text-sm font-semibold">
            kind words
          </span>
          <h2 className="font-display text-3xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-4xl">
            Readers, being lovely.
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-3.5 w-3.5 fill-ink text-ink" />
            ))}
          </div>
          <span className="text-xs text-ink/40">4.9 from early readers</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <figure
            key={testimonial.name}
            className={`flex flex-col justify-between rounded-3xl border border-ink/10 p-6 sm:p-7 ${testimonial.tone}`}
          >
            <div>
              <span
                className={`font-display text-4xl leading-none ${
                  testimonial.tone.includes('bg-ink') ? 'text-lime-400' : 'text-ink/30'
                }`}
                aria-hidden="true"
              >
                “
              </span>
              <blockquote className="mt-2 text-[13.5px] leading-relaxed">
                {testimonial.quote}
              </blockquote>
            </div>
            <figcaption className="mt-7 flex items-center gap-2.5 border-t border-current/10 pt-4">
              <Avatar
                user={{ name: testimonial.name, username: testimonial.name }}
                size="sm"
                ring={false}
              />
              <div>
                <p className="text-xs font-semibold">{testimonial.name}</p>
                <p
                  className={`text-[10px] ${
                    testimonial.tone.includes('bg-ink') ? 'text-white/40' : 'text-ink/45'
                  }`}
                >
                  {testimonial.role}
                </p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
