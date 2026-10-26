import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Sparkles, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import api, { getApiError } from '../lib/api.js';
import BlogCard from '../components/ui/BlogCard.jsx';
import { BlogGridSkeleton } from '../components/ui/Skeleton.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Button, { buttonStyles } from '../components/ui/Button.jsx';
import { Asterisk, Sparkle } from '../components/ui/Doodles.jsx';
import { CATEGORIES } from '../lib/utils.js';
import clsx from 'clsx';
const sortOptions = [
  { value: 'latest', label: 'Latest first' },
  { value: 'popular', label: 'Most read' },
  { value: 'loved', label: 'Most loved' },
  { value: 'oldest', label: 'From the archive' },
];

function useDebounced(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [topic, setTopic] = useState(searchParams.get('tag') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'latest');
  const [blogs, setBlogs] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, hasMore: false });
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const requestRef = useRef(0);
  const q = useDebounced(input, 380);

  const categoryCounts = useMemo(
    () => Object.fromEntries(categories.map((entry) => [entry.name, entry.count])),
    [categories]
  );

  useEffect(() => {
    api
      .get('/blogs/tags')
      .then(({ data }) => {
        setTags(data.data.tags);
        setCategories(data.data.categories);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const params = {};
    if (q.trim()) params.q = q.trim();
    if (category) params.category = category;
    if (topic) params.tag = topic;
    if (sort !== 'latest') params.sort = sort;
    setSearchParams(params, { replace: true });
  }, [q, category, topic, sort, setSearchParams]);

  useEffect(() => {
    const requestId = ++requestRef.current;
    setLoading(true);
    setError('');

    api
      .get('/blogs', {
        params: {
          q: q.trim() || undefined,
          category: category || undefined,
          tag: topic || undefined,
          sort,
          page: 1,
          limit: 9,
        },
      })
      .then(({ data }) => {
        if (requestRef.current !== requestId) return;
        setBlogs(data.data.blogs);
        setMeta(data.meta);
      })
      .catch((requestError) => {
        if (requestRef.current !== requestId) return;
        setError(getApiError(requestError, 'Could not load the library'));
        setBlogs([]);
        setMeta({ total: 0, page: 1, hasMore: false });
      })
      .finally(() => {
        if (requestRef.current === requestId) setLoading(false);
      });
  }, [q, category, topic, sort, refreshKey]);

  const loadMore = async () => {
    if (loadingMore || !meta.hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = (meta.page || 1) + 1;
      const { data } = await api.get('/blogs', {
        params: {
          q: q.trim() || undefined,
          category: category || undefined,
          tag: topic || undefined,
          sort,
          page: nextPage,
          limit: 9,
        },
      });
      setBlogs((previous) => [...previous, ...data.data.blogs]);
      setMeta(data.meta);
    } catch (loadError) {
      toast.error(getApiError(loadError, 'Could not load more stories'));
    } finally {
      setLoadingMore(false);
    }
  };

  const clearFilters = () => {
    setInput('');
    setCategory('');
    setTopic('');
    setSort('latest');
  };

  const hasFilters = input || category || topic || sort !== 'latest';
  const activeFilterCount = [input, category, topic].filter(Boolean).length;

  return (
    <>
      <section className="relative overflow-hidden border-b border-ink/10 bg-paper/40">
        <Sparkle className="absolute -right-6 top-6 h-32 w-32 text-lime-400/70 sm:right-16 sm:h-44 sm:w-44" />
        <Asterisk className="absolute bottom-6 right-1/3 hidden h-10 w-10 text-ink/10 lg:block" />
        <div className="container-ink relative py-12 sm:py-16">
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-500" />
            The library
          </span>
          <h1 className="mt-4 max-w-2xl font-display text-[clamp(2.7rem,5.5vw,4.5rem)] font-semibold leading-[0.96] tracking-[-0.055em]">
            Find the <span className="mark">good stuff</span>.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/50 sm:text-base">
            Essays, field notes and small obsessions from writers who care about the
            sentence. Search by feeling, topic or whatever is nagging at you.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-[11px] text-ink/35">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-500" />
              {loading ? '...' : `${meta.total} stories`}
            </span>
            <span>Zero algorithms</span>
            <span>Zero paywalls</span>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('inkfluence:open-muse'))}
              className="inline-flex items-center gap-1 font-medium text-ink/60 transition hover:text-ink"
            >
              <Sparkles className="h-3 w-3" /> Or ask Muse
            </button>
          </div>
        </div>
      </section>

      <div className="container-ink py-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-10">
          <aside className="h-fit lg:sticky lg:top-24">
            <div className="rounded-3xl border border-ink/10 bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="inline-flex items-center gap-2 font-display text-sm font-semibold">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Refine
                  {activeFilterCount > 0 && (
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-lime-400 text-[9px] font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </h2>
                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-[10px] font-medium text-ink/40 transition hover:text-ink"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="relative mt-4">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
                <input
                  type="search"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Search stories..."
                  aria-label="Search stories"
                  className="input py-2.5 pl-10 pr-9 text-xs"
                />
                {input && (
                  <button
                    type="button"
                    onClick={() => setInput('')}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-ink/30 hover:text-ink"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="mt-5">
                <label htmlFor="sort" className="label">
                  Sort by
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="input py-2.5 text-xs"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-6 border-t border-ink/10 pt-5">
                <p className="label">Category</p>
                <div className="max-h-[280px] space-y-0.5 overflow-y-auto pr-1">
                  <button
                    type="button"
                    onClick={() => setCategory('')}
                    className={clsx(
                      'flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-xs transition',
                      !category ? 'bg-ink text-white' : 'text-ink/60 hover:bg-paper hover:text-ink'
                    )}
                  >
                    <span>All stories</span>
                  </button>
                  {(categories.length
                    ? categories.map((entry) => entry.name)
                    : CATEGORIES
                  ).map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setCategory(category === name ? '' : name)}
                      className={clsx(
                        'flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-xs transition',
                        category === name
                          ? 'bg-lime-400 font-semibold text-ink'
                          : 'text-ink/60 hover:bg-paper hover:text-ink'
                      )}
                    >
                      <span>{name}</span>
                      {categoryCounts[name] !== undefined && (
                        <span className={category === name ? 'text-ink/50' : 'text-ink/25'}>
                          {categoryCounts[name]}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-ink/10 pt-5">
                <p className="label">Topics</p>
                <div className="flex flex-wrap gap-1.5">
                  {tags.slice(0, 12).map((tag) => (
                    <button
                      key={tag.name}
                      type="button"
                      onClick={() => setTopic(topic === tag.name ? '' : tag.name)}
                      className={clsx(
                        'rounded-full border px-2.5 py-1 text-[10px] font-medium transition',
                        topic === tag.name
                          ? 'border-ink bg-ink text-lime-300'
                          : 'border-ink/10 bg-cream text-ink/50 hover:border-ink/30 hover:text-ink'
                      )}
                    >
                      #{tag.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 hidden rounded-3xl border border-ink/10 bg-ink p-5 text-white lg:block">
              <Sparkles className="h-5 w-5 text-lime-400" />
              <p className="mt-3 font-display text-sm font-semibold">Can’t find the vibe?</p>
              <p className="mt-1 text-[11px] leading-relaxed text-white/45">
                Describe your mood and let Muse dig through the shelves for you.
              </p>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('inkfluence:open-muse'))}
                className={buttonStyles('lime', 'sm', 'mt-3 w-full')}
              >
                Ask Muse
              </button>
            </div>
          </aside>

          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-ink/45">
                {loading
                  ? 'Wandering the shelves...'
                  : `${meta.total} ${meta.total === 1 ? 'story' : 'stories'} found`}
                {q && (
                  <>
                    {' '}
                    for <span className="font-medium text-ink">“{q}”</span>
                  </>
                )}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {category && (
                  <button
                    type="button"
                    onClick={() => setCategory('')}
                    className="inline-flex items-center gap-1 rounded-full bg-lime-400 px-2.5 py-1 text-[10px] font-semibold"
                  >
                    {category} <X className="h-3 w-3" />
                  </button>
                )}
                {topic && (
                  <button
                    type="button"
                    onClick={() => setTopic('')}
                    className="inline-flex items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold text-lime-300"
                  >
                    #{topic} <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <BlogGridSkeleton count={6} />
            ) : error ? (
              <EmptyState
                icon={<RefreshCw className="h-6 w-6" />}
                title="The shelf is stuck"
                description={error}
                actionLabel="Try again"
                onAction={() => setRefreshKey((key) => key + 1)}
              />
            ) : blogs.length === 0 ? (
              <EmptyState
                icon={<Search className="h-6 w-6" />}
                title="No stories match that (yet)"
                description="Try a wider search, a different category, or ask Muse to find something in the neighbourhood."
                actionLabel="Clear filters"
                onAction={clearFilters}
              >
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('inkfluence:open-muse'))}
                  className={buttonStyles('lime', 'md')}
                >
                  Ask Muse
                </button>
              </EmptyState>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2">
                  {blogs.map((blog) => (
                    <BlogCard key={blog._id} blog={blog} />
                  ))}
                </div>

                {meta.hasMore && (
                  <div className="mt-10 flex justify-center">
                    <Button variant="outline" size="lg" loading={loadingMore} onClick={loadMore}>
                      Load more stories
                    </Button>
                  </div>
                )}

                {!meta.hasMore && blogs.length > 6 && (
                  <p className="mt-10 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-ink/25">
                    ✳ that’s the whole shelf for this search ✳
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
