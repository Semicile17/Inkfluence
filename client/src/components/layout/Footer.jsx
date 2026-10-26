import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Instagram, Mail, Twitter, Globe, ArrowUp, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import api, { getApiError } from '../../lib/api.js';
import Logo from '../ui/Logo.jsx';
import Button from '../ui/Button.jsx';
import { Asterisk } from '../ui/Doodles.jsx';

const year = new Date().getFullYear();

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const subscribe = async (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post('/newsletter', { email });
      toast.success(data.message);
      setEmail('');
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative mt-24 overflow-hidden rounded-t-[2.5rem] bg-ink text-white">
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-lime-400/10" />
      <div className="pointer-events-none absolute -right-8 -top-10 h-48 w-48 rounded-full border border-lime-400/10" />
      <Asterisk className="pointer-events-none absolute right-12 top-14 hidden h-16 w-16 text-lime-400/20 lg:block" />

      <div className="container-ink relative py-14 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.7fr_0.7fr_1.25fr]">
          <div>
            <Logo dark />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/50">
              A modern home for curious writers and their readers. No noise, no
              infinite scroll — just stories worth your attention.
            </p>
            <div className="mt-6 flex gap-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Inkfluence on Instagram"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/60 transition hover:border-lime-400 hover:text-lime-400"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Inkfluence on X"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/60 transition hover:border-lime-400 hover:text-lime-400"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="mailto:hello@inkfluence.app"
                aria-label="Email Inkfluence"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/60 transition hover:border-lime-400 hover:text-lime-400"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-lime-400">
              Read
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/55">
              <li>
                <Link to="/explore" className="transition hover:text-white">
                  Explore stories
                </Link>
              </li>
              <li>
                <Link to="/explore?sort=popular" className="transition hover:text-white">
                  Most loved
                </Link>
              </li>
              <li>
                <Link to="/explore?sort=latest" className="transition hover:text-white">
                  Fresh off the press
                </Link>
              </li>
              <li>
                <Link to="/bookmarks" className="transition hover:text-white">
                  Your reading list
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-lime-400">
              Write
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/55">
              <li>
                <Link to="/write" className="transition hover:text-white">
                  Start a story
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="transition hover:text-white">
                  Writer dashboard
                </Link>
              </li>
              <li>
                <Link to="/register" className="transition hover:text-white">
                  Create an account
                </Link>
              </li>
              <li>
                <a href="/#write-with-us" className="transition hover:text-white">
                  Our writing ethos
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-lime-400">
              The Sunday Letter
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              One thoughtful email every other Sunday. New stories, good sentences,
              absolutely no growth hacks.
            </p>
            <form onSubmit={subscribe} className="mt-4">
              <div className="flex flex-col gap-2 sm:flex-row">
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-lime-400 focus:outline-none"
                />
                <Button type="submit" variant="lime" size="md" loading={loading} className="shrink-0">
                  Subscribe
                </Button>
              </div>
              <p className="mt-2.5 flex items-center gap-1.5 text-[10px] text-white/30">
                <Sparkles className="h-3 w-3" /> No spam. Unsubscribe whenever.
              </p>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/35">
            © {year} Inkfluence. Made slowly, with good sentences.
          </p>
          <div className="flex flex-wrap items-center gap-5 text-xs text-white/35">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
              Free AI reading buddy
            </span>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="transition hover:text-white">
              <Globe className="mr-1 inline h-3 w-3" /> Open source spirit
            </a>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 transition hover:border-lime-400 hover:text-lime-400"
            >
              Back to top <ArrowUp className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/[0.06] px-5 py-5">
        <div className="container-ink flex items-center justify-between gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/20">
            inkfluence ✳ words with influence
          </span>
          <Link
            to="/explore"
            className="hidden items-center gap-1 text-[11px] font-medium text-lime-400/70 transition hover:text-lime-400 sm:inline-flex"
          >
            Find something to read <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
