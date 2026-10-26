import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  PenLine,
  Share2,
  Tag,
} from 'lucide-react';
import { toast } from 'sonner';
import api, { getApiError } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import BlogCover from '../components/ui/BlogCover.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import BlogCard from '../components/ui/BlogCard.jsx';
import CommentSection from '../components/blog/CommentSection.jsx';
import ArticleBody from '../components/blog/ArticleBody.jsx';
import { ArticleSkeleton } from '../components/ui/Skeleton.jsx';
import { buttonStyles } from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { categoryTone, formatDate, formatNumber, timeAgo } from '../lib/utils.js';
import { extractHeadings } from '../lib/markdown.js';
import clsx from 'clsx';

export default function BlogDetail() {
  const { slug } = useParams();
  const { user, isAuthenticated, toggleBookmarkLocal } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [likeLoading, setLikeLoading] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const headings = useMemo(() => (blog ? extractHeadings(blog.content) : []), [blog]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setBlog(null);

    api
      .get(`/blogs/${slug}`)
      .then(({ data }) => {
        if (!active) return;
        setBlog(data.data.blog);
        setRelated(data.data.related || []);
        setLiked(data.data.liked);
        setBookmarked(data.data.bookmarked);
        setIsOwner(data.data.isOwner);
        document.title = `${data.data.blog.title} — Inkfluence`;
      })
      .catch((requestError) => {
        if (!active) return;
        setError(getApiError(requestError, 'That story could not be found'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      document.title = 'Inkfluence — words with influence';
    };
  }, [slug]);

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [blog]);

  const requireAuth = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return false;
    }
    return true;
  };

  const toggleLike = async () => {
    if (!requireAuth() || likeLoading) return;
    setLikeLoading(true);
    try {
      const { data } = await api.post(`/blogs/${blog._id}/like`);
      setLiked(data.data.liked);
      setBlog((previous) => ({ ...previous, likesCount: data.data.likesCount }));
    } catch (requestError) {
      toast.error(getApiError(requestError));
    } finally {
      setLikeLoading(false);
    }
  };

  const toggleBookmark = async () => {
    if (!requireAuth() || bookmarkLoading) return;
    setBookmarkLoading(true);
    try {
      const { data } = await api.post(`/blogs/${blog._id}/bookmark`);
      setBookmarked(data.data.bookmarked);
      toggleBookmarkLocal(blog._id);
      toast.success(data.message);
    } catch (requestError) {
      toast.error(getApiError(requestError));
    } finally {
      setBookmarkLoading(false);
    }
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share && window.innerWidth < 768) {
        await navigator.share({ title: blog.title, text: blog.excerpt, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied — spread the good words');
      }
    } catch (shareError) {
      if (shareError?.name !== 'AbortError') {
        toast.error('Could not share just now');
      }
    }
  };

  if (loading) {
    return (
      <div className="container-ink">
        <ArticleSkeleton />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container-ink py-16">
        <EmptyState
          title="That story wandered off"
          description={error || 'The link may be old, or the story may have been put back in a drawer.'}
          actionLabel="Back to the library"
          actionTo="/explore"
        />
      </div>
    );
  }

  return (
    <>
      <div
        className="fixed left-0 top-[72px] z-30 h-[3px] bg-lime-400 transition-[width] duration-100"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-label="Reading progress"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      <article>
        <header className="border-b border-ink/10 bg-white/40">
          <div className="container-ink py-8 sm:py-10">
            <Link
              to="/explore"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-ink/40 transition hover:text-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to the library
            </Link>

            {blog.status === 'draft' && (
              <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-ink/10 bg-lime-100 px-4 py-3 text-xs text-ink/70">
                <span className="rounded-full bg-ink px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-lime-300">
                  Draft
                </span>
                Only you can see this story right now.
                <Link
                  to={`/write/${blog._id}/edit`}
                  className="font-semibold text-ink underline decoration-ink/30 underline-offset-2"
                >
                  Keep editing
                </Link>
              </div>
            )}

            <div className="mx-auto mt-6 max-w-4xl">
              <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-medium text-ink/40">
                <Link
                  to={`/explore?category=${encodeURIComponent(blog.category)}`}
                  className={clsx(
                    'rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] transition hover:opacity-75',
                    categoryTone[blog.category] || 'bg-paper text-ink'
                  )}
                >
                  {blog.category}
                </Link>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {blog.readTime} min read
                </span>
                <span className="inline-flex items-center gap-1">
                  <Eye className="h-3 w-3" /> {formatNumber(blog.views)} views
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" /> {blog.commentsCount} comments
                </span>
              </div>

              <h1 className="mt-4 font-display text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[0.98] tracking-[-0.05em]">
                {blog.title}
              </h1>
              {blog.excerpt && (
                <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink/55 sm:text-lg">
                  {blog.excerpt}
                </p>
              )}

              <div className="mt-7 flex flex-col justify-between gap-5 border-t border-ink/10 pt-5 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <Link to={`/writers/${blog.author.username}`}>
                    <Avatar user={blog.author} size="md" />
                  </Link>
                  <div>
                    <Link
                      to={`/writers/${blog.author.username}`}
                      className="text-sm font-semibold transition hover:opacity-60"
                    >
                      {blog.author.name}
                    </Link>
                    <p className="text-[11px] text-ink/40">
                      {formatDate(blog.publishedAt || blog.createdAt)} · {timeAgo(blog.publishedAt || blog.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleLike}
                    disabled={likeLoading}
                    aria-pressed={liked}
                    className={clsx(
                      'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition',
                      liked
                        ? 'border-ink bg-lime-400 text-ink'
                        : 'border-ink/15 bg-white text-ink/60 hover:border-ink/40 hover:text-ink'
                    )}
                  >
                    <Heart className={clsx('h-3.5 w-3.5', liked && 'fill-ink')} />
                    {formatNumber(blog.likesCount)}
                  </button>

                  <button
                    type="button"
                    onClick={toggleBookmark}
                    disabled={bookmarkLoading}
                    aria-pressed={bookmarked}
                    className={clsx(
                      'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition',
                      bookmarked
                        ? 'border-ink bg-lime-400 text-ink'
                        : 'border-ink/15 bg-white text-ink/60 hover:border-ink/40 hover:text-ink'
                    )}
                  >
                    <Bookmark className={clsx('h-3.5 w-3.5', bookmarked && 'fill-ink')} />
                    {bookmarked ? 'Saved' : 'Save'}
                  </button>

                  <button
                    type="button"
                    onClick={share}
                    className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white px-3.5 py-2 text-xs font-semibold text-ink/60 transition hover:border-ink/40 hover:text-ink"
                  >
                    <Share2 className="h-3.5 w-3.5" /> Share
                  </button>

                  {isOwner && (
                    <Link
                      to={`/write/${blog._id}/edit`}
                      className={buttonStyles('dark', 'sm', 'rounded-full px-3.5')}
                    >
                      <PenLine className="h-3.5 w-3.5" /> Edit
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container-ink pb-16 pt-8 sm:pt-10">
          <div className="mx-auto max-w-5xl">
            <BlogCover
              theme={blog.coverTheme}
              coverImage={blog.coverImage}
              title={blog.title}
              className="aspect-[16/8] overflow-hidden rounded-[1.75rem] border border-ink/10 shadow-soft"
            />

            <div className="mt-10 grid gap-12 xl:grid-cols-[minmax(0,1fr)_230px] xl:gap-16">
              <article className="min-w-0">
                <ArticleBody content={blog.content} />

                {blog.tags?.length > 0 && (
                  <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-ink/10 pt-6">
                    <Tag className="h-3.5 w-3.5 text-ink/30" />
                    {blog.tags.map((tag) => (
                      <Link
                        key={tag}
                        to={`/explore?tag=${encodeURIComponent(tag)}`}
                        className="rounded-full border border-ink/10 bg-white px-3 py-1.5 text-[11px] font-medium text-ink/55 transition hover:border-ink/30 hover:text-ink"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                )}

                <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-3xl border border-ink/10 bg-white p-5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <Avatar user={blog.author} size="md" />
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.14em] text-ink/35">Written by</p>
                      <Link
                        to={`/writers/${blog.author.username}`}
                        className="font-display text-base font-semibold transition hover:opacity-60"
                      >
                        {blog.author.name}
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleLike}
                      className="inline-flex items-center gap-1.5 rounded-full bg-lime-400 px-4 py-2.5 text-xs font-semibold text-ink transition hover:bg-lime-300"
                    >
                      <Heart className={clsx('h-4 w-4', liked && 'fill-ink')} />
                      {liked ? 'Loved' : 'Love this'}
                    </button>
                    <Link
                      to={`/writers/${blog.author.username}`}
                      className={buttonStyles('outline', 'sm')}
                    >
                      More by {blog.author.name.split(' ')[0]}
                    </Link>
                  </div>
                </div>

                <CommentSection blogId={blog._id} blogAuthorId={blog.author._id} />
              </article>

              <aside className="hidden xl:block">
                <div className="sticky top-28 space-y-5">
                  {headings.length > 1 && (
                    <div className="rounded-2xl border border-ink/10 bg-white p-4">
                      <p className="mb-3 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-ink/35">
                        On this page
                      </p>
                      <nav className="space-y-1.5" aria-label="Table of contents">
                        {headings.map((heading) => (
                          <a
                            key={heading.id}
                            href={`#${heading.id}`}
                            className={clsx(
                              'block text-[11px] leading-snug text-ink/45 transition hover:text-ink',
                              heading.level === 3 && 'pl-3 text-[10.5px]'
                            )}
                          >
                            {heading.text}
                          </a>
                        ))}
                      </nav>
                    </div>
                  )}

                  <div className="rounded-2xl border border-ink/10 bg-white p-4">
                    <p className="mb-3 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-ink/35">
                      Enjoyed it?
                    </p>
                    <button
                      type="button"
                      onClick={toggleBookmark}
                      className={clsx(
                        'flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-[11px] font-semibold transition',
                        bookmarked
                          ? 'border-ink bg-lime-400'
                          : 'border-ink/15 hover:border-ink/40'
                      )}
                    >
                      <Bookmark className={clsx('h-3.5 w-3.5', bookmarked && 'fill-ink')} />
                      {bookmarked ? 'In your list' : 'Save for later'}
                    </button>
                    <button
                      type="button"
                      onClick={share}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-ink/15 px-3 py-2.5 text-[11px] font-semibold transition hover:border-ink/40"
                    >
                      <Share2 className="h-3.5 w-3.5" /> Share
                    </button>
                  </div>

                  <div className="rounded-2xl bg-ink p-4 text-white">
                    <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-lime-400">
                      Ask Muse
                    </p>
                    <p className="mt-2 text-[11px] leading-relaxed text-white/50">
                      Want another story like this one?
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        window.dispatchEvent(
                          new CustomEvent('inkfluence:open-muse', {
                            detail: { prompt: `I just read "${blog.title}" and want something similar` },
                          })
                        )
                      }
                      className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-lime-300 transition hover:text-white"
                    >
                      Find my next read <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-ink/10 bg-paper/40 py-14">
          <div className="container-ink">
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <span className="mb-2 inline-block rounded-lg bg-lime-400 px-2 py-0.5 font-display text-xs font-semibold">
                  keep wandering
                </span>
                <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                  Nearby on the shelf
                </h2>
              </div>
              <Link
                to="/explore"
                className="hidden items-center gap-1 text-xs font-semibold text-ink/50 transition hover:text-ink sm:inline-flex"
              >
                All stories <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <BlogCard key={item._id} blog={item} compact />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
