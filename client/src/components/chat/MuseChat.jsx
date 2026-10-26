import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Loader2, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';
import api, { getApiError } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Avatar from '../ui/Avatar.jsx';
import BlogCover from '../ui/BlogCover.jsx';
import { Sparkle, Smiley } from '../ui/Doodles.jsx';
import { categoryTone } from '../../lib/utils.js';

const suggestions = [
  'Something calm for a Sunday',
  'I want to understand startups',
  'Help me get better at design',
  'A story about money & freelancing',
];

let messageId = 0;
const nextId = () => {
  messageId += 1;
  return `${Date.now()}-${messageId}`;
};

const initialMessages = [
  {
    id: 'greeting',
    role: 'assistant',
    text: "Hi, I'm Muse — your reading-sidekick around here. Tell me a mood, a topic, or the kind of day you're having and I'll find a story for it.",
  },
];

function MiniBlog({ blog }) {
  return (
    <Link
      to={`/blog/${blog.slug}`}
      className="group flex gap-3 rounded-2xl border border-ink/10 bg-white p-2.5 transition hover:border-ink/30 hover:shadow-sm"
    >
      <BlogCover
        theme={blog.coverTheme}
        coverImage={blog.coverImage}
        title={blog.title}
        className="h-[58px] w-[72px] shrink-0 rounded-xl"
        showLabel={false}
      />
      <div className="min-w-0 flex-1 py-0.5">
        <span
          className={`inline-flex rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${
            categoryTone[blog.category] || 'bg-paper text-ink'
          }`}
        >
          {blog.category}
        </span>
        <p className="mt-1 line-clamp-2 font-display text-[12.5px] font-semibold leading-snug text-ink group-hover:underline group-hover:decoration-lime-400 group-hover:decoration-2 group-hover:underline-offset-2">
          {blog.title}
        </p>
        <p className="mt-0.5 text-[10px] text-ink/40">
          {blog.readTime} min · {blog.author?.name?.split(' ')[0]}
        </p>
      </div>
    </Link>
  );
}

export default function MuseChat() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const sendRef = useRef(null);

  useEffect(() => {
    api
      .get('/ai/status')
      .then(({ data }) => setProvider(data.data))
      .catch(() => setProvider({ configured: false, label: 'On-device matching' }));
  }, []);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
      scrollToBottom();
    }
  }, [open, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const sendMessage = useCallback(
    async (rawMessage) => {
      const message = (rawMessage ?? input).trim();
      if (!message || loading) return;

      setMessages((previous) => [...previous, { id: nextId(), role: 'user', text: message }]);
      setInput('');
      setLoading(true);

      try {
        const { data } = await api.post('/ai/recommend', { message });
        const result = data.data;
        setMessages((previous) => [
          ...previous,
          {
            id: nextId(),
            role: 'assistant',
            text: result.reply,
            blogs: result.blogs,
            source: result.source,
          },
        ]);
      } catch (error) {
        setMessages((previous) => [
          ...previous,
          {
            id: nextId(),
            role: 'assistant',
            text: "My train of thought just left the station. Try again in a moment — or browse the library while I find my ticket.",
            error: true,
          },
        ]);
        toast.error(getApiError(error, 'Muse could not answer just now'));
      } finally {
        setLoading(false);
      }
    },
    [input, loading]
  );

  useEffect(() => {
    sendRef.current = sendMessage;
  }, [sendMessage]);

  useEffect(() => {
    const handleOpen = (event) => {
      setOpen(true);
      const prompt = event.detail?.prompt;
      if (prompt) {
        setTimeout(() => sendRef.current?.(prompt), 250);
      }
    };
    window.addEventListener('inkfluence:open-muse', handleOpen);
    return () => window.removeEventListener('inkfluence:open-muse', handleOpen);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? 'Close Muse, the reading assistant' : 'Ask Muse for a story recommendation'}
        className="group fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full border border-ink/15 bg-ink p-0 text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-ink-700 sm:bottom-7 sm:right-7 sm:w-auto sm:justify-start sm:gap-2.5 sm:pl-2 sm:pr-5"
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-lime-400 text-ink transition-transform duration-300 group-hover:rotate-12">
          {open ? <X className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block font-display text-sm font-semibold leading-none">Ask Muse</span>
          <span className="mt-1 flex items-center gap-1 text-[9px] uppercase tracking-[0.16em] text-lime-300/80">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-400" /> free AI
          </span>
        </span>
      </button>

      {open && (
        <section
          role="dialog"
          aria-label="Muse reading assistant"
          className="fixed bottom-[5.75rem] right-3 z-[60] flex h-[min(620px,calc(100dvh-7rem))] w-[calc(100vw-1.5rem)] max-w-[410px] flex-col overflow-hidden rounded-[1.75rem] border border-ink/15 bg-cream shadow-lift animate-pop-in sm:bottom-28 sm:right-7"
        >
          <header className="relative overflow-hidden border-b border-ink/10 bg-ink px-5 py-4 text-white">
            <Sparkle className="absolute -right-3 -top-5 h-20 w-20 text-lime-400/20" />
            <div className="relative flex items-center gap-3">
              <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-lime-400 text-ink">
                <Smiley className="h-7 w-7" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-ink bg-lime-400" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-lg font-semibold leading-none">Muse</h2>
                <p className="mt-1 text-[11px] text-white/45">
                  Story-finder · replies in seconds
                </p>
              </div>
              <span className="rounded-full border border-white/15 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-lime-300">
                {provider?.configured ? provider.provider : 'AI-ish'}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
                aria-label="Close Muse"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5" aria-live="polite">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2.5 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {message.role === 'assistant' ? (
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-lime-400">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                ) : (
                  <Avatar user={user || { name: 'You' }} size="xs" ring={false} className="mt-0.5" />
                )}

                <div className={`max-w-[82%] space-y-2 ${message.role === 'user' ? 'items-end' : ''}`}>
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      message.role === 'user'
                        ? 'rounded-tr-md bg-ink text-white'
                        : 'rounded-tl-md border border-ink/10 bg-white text-ink/75'
                    }`}
                  >
                    {message.text}
                  </div>

                  {message.blogs?.length > 0 && (
                    <div className="space-y-2">
                      {message.blogs.map((blog) => (
                        <MiniBlog key={blog._id} blog={blog} />
                      ))}
                    </div>
                  )}

                  {message.role === 'assistant' && message.blogs?.length > 0 && (
                    <p className="pl-1 text-[9px] uppercase tracking-[0.12em] text-ink/25">
                      {message.source === 'local' ? 'matched from the library' : `picked by ${message.source}`}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-lime-400">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-ink/10 bg-white px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/30 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/30 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/30" />
                  <span className="ml-1 text-[11px] text-ink/35">wandering the shelves...</span>
                </div>
              </div>
            )}

            {messages.length === 1 && (
              <div className="pt-1">
                <p className="mb-2 pl-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/30">
                  Try asking
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => sendMessage(suggestion)}
                      className="rounded-full border border-ink/10 bg-white px-3 py-1.5 text-left text-[11px] text-ink/60 transition hover:border-ink/30 hover:text-ink"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-ink/10 bg-white p-3">
            <div className="flex items-end gap-2 rounded-2xl border border-ink/15 bg-cream p-1.5 pl-3 focus-within:border-ink/40 focus-within:ring-2 focus-within:ring-lime-400/50">
              <label htmlFor="muse-input" className="sr-only">
                Ask Muse for a recommendation
              </label>
              <textarea
                id="muse-input"
                ref={inputRef}
                rows={1}
                value={input}
                maxLength={400}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What are you in the mood for?"
                className="max-h-24 min-h-[36px] flex-1 resize-none bg-transparent py-2 text-[13px] text-ink placeholder:text-ink/35 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send message to Muse"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-lime-400 transition hover:bg-ink-700 disabled:opacity-35"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
              </button>
            </div>
            <div className="mt-1.5 flex items-center justify-between px-1">
              <span className="text-[9px] text-ink/30">Enter to send · Shift + Enter for a new line</span>
              <span className="inline-flex items-center gap-1 text-[9px] text-ink/30">
                <span className="h-1 w-1 rounded-full bg-lime-500" />
                {provider?.label || 'Free AI'}
              </span>
            </div>
          </form>
        </section>
      )}
    </>
  );
}
