import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowUpRight,
  BarChart3,
  Bookmark,
  Eye,
  Heart,
  LayoutDashboard,
  MessageCircle,
  PenLine,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  TrendingUp,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import api, { getApiError, getFieldErrors } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import BlogCover from '../components/ui/BlogCover.jsx';
import Button, { buttonStyles } from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Modal from '../components/ui/Modal.jsx';
import { Asterisk, Sparkle } from '../components/ui/Doodles.jsx';
import { formatNumber, timeAgo } from '../lib/utils.js';
import clsx from 'clsx';

const statCards = [
  { key: 'views', label: 'total reads', icon: Eye, tone: 'bg-lime-400 text-ink', note: 'across published stories' },
  { key: 'likes', label: 'loves received', icon: Heart, tone: 'bg-white text-ink', note: 'readers tapping the heart' },
  { key: 'comments', label: 'conversations', icon: MessageCircle, tone: 'bg-white text-ink', note: 'thoughts left on your work' },
];

export default function Dashboard() {
  const { user, updateProfile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [profileOpen, setProfileOpen] = useState(searchParams.get('edit') === 'profile');
  const [profileForm, setProfileForm] = useState({
    name: '',
    bio: '',
    avatar: '',
    website: '',
    twitter: '',
    instagram: '',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});

  const load = useCallback(async () => {
    try {
      const [dashboard, mine] = await Promise.all([
        api.get('/blogs/dashboard'),
        api.get('/blogs/mine'),
      ]);
      setData(dashboard.data.data);
      setBlogs(mine.data.data.blogs);
      setError('');
    } catch (requestError) {
      setError(getApiError(requestError, 'Could not load your writing room'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Your dashboard — Inkfluence';
    load();
    return () => {
      document.title = 'Inkfluence — words with influence';
    };
  }, [load]);

  useEffect(() => {
    if (searchParams.get('edit') === 'profile') setProfileOpen(true);
  }, [searchParams]);

  useEffect(() => {
    if (!user) return;
    setProfileForm({
      name: user.name || '',
      bio: user.bio || '',
      avatar: user.avatar || '',
      website: user.socials?.website || '',
      twitter: user.socials?.twitter || '',
      instagram: user.socials?.instagram || '',
    });
  }, [user]);

  const filtered = useMemo(() => {
    if (tab === 'all') return blogs;
    return blogs.filter((blog) => blog.status === tab);
  }, [blogs, tab]);

  const openProfile = () => {
    setProfileOpen(true);
    setProfileErrors({});
  };

  const closeProfile = () => {
    setProfileOpen(false);
    if (searchParams.get('edit')) {
      const next = new URLSearchParams(searchParams);
      next.delete('edit');
      setSearchParams(next, { replace: true });
    }
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setProfileSaving(true);
    setProfileErrors({});
    try {
      const response = await updateProfile({
        name: profileForm.name,
        bio: profileForm.bio,
        avatar: profileForm.avatar,
        socials: {
          website: profileForm.website,
          twitter: profileForm.twitter,
          instagram: profileForm.instagram,
        },
      });
      toast.success(response.message);
      setProfileOpen(false);
      closeProfile();
    } catch (requestError) {
      setProfileErrors(getFieldErrors(requestError));
      toast.error(getApiError(requestError, 'Could not update your profile'));
    } finally {
      setProfileSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/blogs/${deleteTarget._id}`);
      toast.success('Story deleted');
      setDeleteTarget(null);
      setLoading(true);
      await load();
    } catch (requestError) {
      toast.error(getApiError(requestError, 'Could not delete that story'));
    } finally {
      setDeleting(false);
    }
  };

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 18) return 'Afternoon';
    return 'Evening';
  })();

  if (loading) {
    return (
      <div className="container-ink py-10">
        <div className="h-20 w-2/3 animate-pulse rounded-2xl bg-ink/[0.06]" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-3xl bg-ink/[0.05]" />
          ))}
        </div>
        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_340px]">
          <div className="h-[420px] animate-pulse rounded-3xl bg-ink/[0.04]" />
          <div className="h-72 animate-pulse rounded-3xl bg-ink/[0.04]" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container-ink py-16">
        <EmptyState
          title="Your writing room is locked"
          description={error || 'Something went wrong while fetching your dashboard.'}
          actionLabel="Try again"
          onAction={() => {
            setLoading(true);
            load();
          }}
        />
      </div>
    );
  }

  const { stats } = data;
  const maxTopViews = Math.max(...(data.top || []).map((blog) => blog.views), 1);
  const allStatCards = [
    ...statCards,
    { key: 'followers', label: 'kind followers', icon: Users, tone: 'bg-ink text-white', note: 'people keeping an eye out' },
  ];

  return (
    <div className="container-ink py-9 sm:py-12">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <span className="eyebrow">
            <Sparkles className="h-3 w-3" /> your writing room
          </span>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[0.95] tracking-[-0.05em] sm:text-5xl">
            {greeting}, <span className="mark">{user?.name?.split(' ')[0] || 'writer'}</span>.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/45">
            {stats.drafts > 0
              ? `You have ${stats.drafts} ${stats.drafts === 1 ? 'draft' : 'drafts'} waiting, and ${stats.published} ${stats.published === 1 ? 'story' : 'stories'} out in the world.`
              : stats.published > 0
                ? 'Everything is published and the page is quiet. A good day to start something new.'
                : 'A blank page and a whole library waiting. Let’s begin with one true sentence.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/bookmarks" className={buttonStyles('outline', 'md')}>
            <Bookmark className="h-4 w-4" /> Reading list
          </Link>
          <Link to="/write" className={buttonStyles('dark', 'md')}>
            <PenLine className="h-4 w-4" /> New story
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {allStatCards.map((card, index) => {
          const Icon = card.icon;
          const value =
            card.key === 'followers' ? data.user.followersCount : stats[card.key] || 0;
          return (
            <div
              key={card.key}
              className={clsx(
                'relative overflow-hidden rounded-3xl border border-ink/10 p-5',
                card.tone
              )}
            >
              {index === 0 && (
                <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full border border-ink/10" />
              )}
              {index === 0 ? (
                <Sparkle className="absolute -bottom-4 -right-2 h-20 w-20 text-ink/15" />
              ) : (
                <Asterisk
                  className={clsx(
                    'absolute -bottom-4 -right-4 h-16 w-16',
                    card.tone.includes('bg-ink') ? 'text-lime-400/10' : 'text-ink/[0.05]'
                  )}
                />
              )}
              <div className="relative flex items-center justify-between">
                <p
                  className={clsx(
                    'text-[10px] font-semibold uppercase tracking-[0.14em]',
                    card.tone.includes('bg-ink') ? 'text-white/40' : 'text-ink/40'
                  )}
                >
                  {card.label}
                </p>
                <Icon
                  className={clsx(
                    'h-4 w-4',
                    card.tone.includes('bg-ink') ? 'text-lime-400' : 'text-ink/40'
                  )}
                />
              </div>
              <p className="relative mt-3 font-display text-4xl font-semibold tracking-[-0.05em]">
                {formatNumber(value)}
              </p>
              <p
                className={clsx(
                  'relative mt-1 text-[10px]',
                  card.tone.includes('bg-ink') ? 'text-white/35' : 'text-ink/35'
                )}
              >
                {card.note}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Published', value: stats.published, to: '/explore' },
          { label: 'Drafts', value: stats.drafts, to: '/dashboard' },
          { label: 'Total stories', value: stats.total, to: '/dashboard' },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-2xl border border-ink/10 bg-white px-4 py-3"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-ink/35">
              {item.label}
            </span>
            <span className="font-display text-lg font-semibold">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-9 grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-2xl font-semibold tracking-[-0.03em]">Your stories</h2>
            <div className="flex rounded-full border border-ink/10 bg-white p-0.5" role="tablist" aria-label="Filter stories">
              {[
                { id: 'all', label: 'All', count: blogs.length },
                { id: 'published', label: 'Live', count: stats.published },
                { id: 'draft', label: 'Drafts', count: stats.drafts },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === item.id}
                  onClick={() => setTab(item.id)}
                  className={clsx(
                    'rounded-full px-3 py-1.5 text-[11px] font-semibold transition',
                    tab === item.id ? 'bg-ink text-white' : 'text-ink/45 hover:text-ink'
                  )}
                >
                  {item.label}
                  <span className={clsx('ml-1.5 text-[9px]', tab === item.id ? 'text-lime-300' : 'text-ink/25')}>
                    {item.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              title={
                tab === 'draft'
                  ? 'No drafts in the drawer'
                  : tab === 'published'
                    ? 'Nothing published yet'
                    : 'Your shelf is empty'
              }
              description="Start with a sentence, a list, or a small observation. It does not have to be big to be worth sharing."
              actionLabel="Start writing"
              actionTo="/write"
            />
          ) : (
            <div className="space-y-3">
              {filtered.map((blog) => (
                <article
                  key={blog._id}
                  className="group flex flex-col gap-3 rounded-2xl border border-ink/10 bg-white p-3 transition hover:border-ink/25 sm:flex-row sm:items-center"
                >
                  <Link to={`/blog/${blog.slug}`} className="shrink-0">
                    <BlogCover
                      theme={blog.coverTheme}
                      coverImage={blog.coverImage}
                      title={blog.title}
                      className="aspect-[16/9] w-full rounded-xl sm:h-[66px] sm:w-[96px] sm:aspect-auto"
                      showLabel={false}
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={clsx(
                          'rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider',
                          blog.status === 'published'
                            ? 'bg-lime-100 text-ink/60'
                            : 'bg-paper text-ink/45'
                        )}
                      >
                        {blog.status === 'published' ? 'Live' : 'Draft'}
                      </span>
                      <span className="text-[10px] text-ink/30">
                        edited {timeAgo(blog.updatedAt)}
                      </span>
                    </div>
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="mt-1 block truncate font-display text-[15px] font-semibold transition group-hover:text-ink/70"
                    >
                      {blog.title}
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-[10px] text-ink/35">
                      <span className="inline-flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {formatNumber(blog.views)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Heart className="h-3 w-3" /> {formatNumber(blog.likesCount)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" /> {formatNumber(blog.commentsCount)}
                      </span>
                      <span className="hidden sm:inline">· {blog.category}</span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1 self-end sm:self-center">
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="grid h-8 w-8 place-items-center rounded-full text-ink/35 transition hover:bg-paper hover:text-ink"
                      aria-label={`View ${blog.title}`}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      to={`/write/${blog._id}/edit`}
                      className="grid h-8 w-8 place-items-center rounded-full text-ink/35 transition hover:bg-paper hover:text-ink"
                      aria-label={`Edit ${blog.title}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(blog)}
                      className="grid h-8 w-8 place-items-center rounded-full text-ink/30 transition hover:bg-red-50 hover:text-red-600"
                      aria-label={`Delete ${blog.title}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-5">
          <div className="rounded-3xl bg-ink p-5 text-white">
            <div className="flex items-center justify-between">
              <h2 className="inline-flex items-center gap-2 font-display text-base font-semibold">
                <TrendingUp className="h-4 w-4 text-lime-400" /> Top stories
              </h2>
              <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-white/30">
                by reads
              </span>
            </div>

            {data.top?.length ? (
              <div className="mt-5 space-y-4">
                {data.top.map((blog, index) => (
                  <Link key={blog._id} to={`/blog/${blog.slug}`} className="group block">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] text-lime-400/60">0{index + 1}</span>
                      <p className="flex-1 truncate text-[11px] font-medium text-white/75 transition group-hover:text-white">
                        {blog.title}
                      </p>
                      <span className="text-[9px] text-white/30">{formatNumber(blog.views)}</span>
                    </div>
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-lime-400 transition-all duration-700"
                        style={{ width: `${Math.max(8, (blog.views / maxTopViews) * 100)}%` }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-[11px] leading-relaxed text-white/35">
                Publish your first story and the numbers will start telling a story of their own.
              </p>
            )}

            <Link
              to="/write"
              className="mt-5 inline-flex items-center gap-1 text-[11px] font-semibold text-lime-300 transition hover:text-white"
            >
              Write the next one <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-white p-5">
            <div className="flex items-center gap-3">
              <Avatar user={user} size="lg" />
              <div className="min-w-0">
                <p className="truncate font-display text-base font-semibold">{user?.name}</p>
                <p className="truncate text-[11px] text-ink/40">@{user?.username}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-5 border-t border-ink/10 pt-4 text-[11px] text-ink/45">
              <span>
                <strong className="text-ink">{data.user.followersCount}</strong> followers
              </span>
              <span>
                <strong className="text-ink">{data.user.followingCount}</strong> following
              </span>
            </div>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={openProfile} className={buttonStyles('outline', 'sm', 'flex-1')}>
                <Pencil className="h-3 w-3" /> Edit profile
              </button>
              <Link
                to={`/writers/${user?.username}`}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink/15 text-ink/50 transition hover:border-ink/40 hover:text-ink"
                aria-label="View public profile"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-lime-100 p-5">
            <BarChart3 className="h-5 w-5 text-ink/50" />
            <p className="mt-2 font-display text-sm font-semibold">Small numbers, real people.</p>
            <p className="mt-1 text-[11px] leading-relaxed text-ink/45">
              {stats.views > 0
                ? `Your words have been read ${formatNumber(stats.views)} times and loved ${formatNumber(stats.likes)} times. That is ${stats.likes > 0 ? 'a room full of nodding heads' : 'a beginning'}.`
                : 'Every story starts at zero. The important part is that it exists.'}
            </p>
            <div className="mt-3 flex gap-1">
              {Array.from({ length: 12 }).map((_, index) => (
                <span
                  key={index}
                  className={clsx(
                    'h-7 flex-1 rounded-sm',
                    index < Math.min(12, Math.max(2, Math.round(stats.views / 1000)))
                      ? 'bg-lime-400 ring-1 ring-ink/10'
                      : 'bg-white'
                  )}
                />
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-white p-5">
            <LayoutDashboard className="h-4 w-4 text-ink/30" />
            <p className="mt-2 font-display text-sm font-semibold">Quick hops</p>
            <div className="mt-3 space-y-1.5">
              {[
                { label: 'Your public profile', to: `/writers/${user?.username}` },
                { label: 'Saved stories', to: '/bookmarks' },
                { label: 'Explore the library', to: '/explore' },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="flex items-center justify-between rounded-xl px-2.5 py-2 text-[11px] text-ink/50 transition hover:bg-paper hover:text-ink"
                >
                  {link.label} <ArrowUpRight className="h-3 w-3" />
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <Modal
        open={profileOpen}
        onClose={closeProfile}
        title="Edit your profile"
        footer={
          <>
            <Button variant="outline" size="md" onClick={closeProfile}>
              Cancel
            </Button>
            <Button variant="dark" size="md" loading={profileSaving} type="submit" form="profile-form">
              Save changes
            </Button>
          </>
        }
      >
        <form id="profile-form" onSubmit={saveProfile} className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar user={{ ...user, name: profileForm.name, avatar: profileForm.avatar }} size="xl" />
            <div className="flex-1">
              <label htmlFor="avatar" className="label">
                Avatar URL
              </label>
              <input
                id="avatar"
                type="url"
                value={profileForm.avatar}
                onChange={(event) => setProfileForm({ ...profileForm, avatar: event.target.value })}
                placeholder="https://..."
                className="input py-2.5 text-xs"
              />
              {profileErrors.avatar && <p className="mt-1 text-[10px] text-red-500">{profileErrors.avatar}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="profile-name" className="label">
              Name
            </label>
            <input
              id="profile-name"
              value={profileForm.name}
              onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })}
              className="input"
            />
            {profileErrors.name && <p className="mt-1 text-[10px] text-red-500">{profileErrors.name}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="bio" className="label mb-0">
                Bio
              </label>
              <span className="text-[10px] text-ink/30">{profileForm.bio.length}/280</span>
            </div>
            <textarea
              id="bio"
              rows={3}
              maxLength={280}
              value={profileForm.bio}
              onChange={(event) => setProfileForm({ ...profileForm, bio: event.target.value })}
              placeholder="A sentence or two about the human behind the words."
              className="input mt-1.5 resize-none text-sm"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="website" className="label">
                Website
              </label>
              <input
                id="website"
                type="url"
                value={profileForm.website}
                onChange={(event) => setProfileForm({ ...profileForm, website: event.target.value })}
                placeholder="https://..."
                className="input py-2.5 text-xs"
              />
            </div>
            <div>
              <label htmlFor="twitter" className="label">
                X / Twitter
              </label>
              <input
                id="twitter"
                value={profileForm.twitter}
                onChange={(event) => setProfileForm({ ...profileForm, twitter: event.target.value })}
                placeholder="handle"
                className="input py-2.5 text-xs"
              />
            </div>
            <div>
              <label htmlFor="instagram" className="label">
                Instagram
              </label>
              <input
                id="instagram"
                value={profileForm.instagram}
                onChange={(event) => setProfileForm({ ...profileForm, instagram: event.target.value })}
                placeholder="handle"
                className="input py-2.5 text-xs"
              />
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete this story?"
        footer={
          <>
            <Button variant="outline" size="md" onClick={() => setDeleteTarget(null)}>
              Keep it
            </Button>
            <Button variant="danger" size="md" loading={deleting} onClick={confirmDelete}>
              <Trash2 className="h-4 w-4" /> Delete forever
            </Button>
          </>
        }
      >
        <p className="text-sm leading-relaxed text-ink/60">
          “{deleteTarget?.title}” will be gone, along with its likes and comments.
          There is no undo. If you just need a break from it, unpublishing is kinder.
        </p>
      </Modal>
    </div>
  );
}
