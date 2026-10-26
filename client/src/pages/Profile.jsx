import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight, CalendarDays, Globe, Instagram, PenLine, Twitter } from 'lucide-react';
import api, { getApiError } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import BlogCard from '../components/ui/BlogCard.jsx';
import FollowButton from '../components/ui/FollowButton.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { BlogCardSkeleton } from '../components/ui/Skeleton.jsx';
import { Asterisk, Sparkle } from '../components/ui/Doodles.jsx';
import { buttonStyles } from '../components/ui/Button.jsx';
import { formatDate, formatNumber } from '../lib/utils.js';

export default function Profile() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    api
      .get(`/users/${username}`)
      .then(({ data }) => {
        if (!active) return;
        setProfile(data.data.user);
        setBlogs(data.data.blogs);
        setStats(data.data.stats);
        setIsFollowing(data.data.isFollowing);
        setFollowersCount(data.data.user.followersCount);
        document.title = `${data.data.user.name} (@${data.data.user.username}) — Inkfluence`;
      })
      .catch((requestError) => {
        if (active) setError(getApiError(requestError, 'That writer could not be found'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      document.title = 'Inkfluence — words with influence';
    };
  }, [username]);

  if (loading) {
    return (
      <div className="container-ink py-10">
        <div className="h-64 animate-pulse rounded-[2rem] bg-white" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <BlogCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container-ink py-16">
        <EmptyState
          title="This writer is shy"
          description={error || 'Maybe they are still working on their first story.'}
          actionLabel="Back to the library"
          actionTo="/explore"
        />
      </div>
    );
  }

  const isOwner = currentUser?.username === profile.username;

  return (
    <div className="container-ink py-8 sm:py-10">
      <div className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white">
        <div className="relative h-36 overflow-hidden bg-ink sm:h-48">
          <Sparkle className="absolute -right-4 -top-10 h-52 w-52 text-lime-400/80" />
          <Asterisk className="absolute bottom-4 right-1/3 h-10 w-10 text-white/10" />
          <div className="absolute -bottom-10 left-1/2 h-40 w-40 rounded-full border border-white/10" />
          <div className="absolute -bottom-20 left-1/3 h-52 w-52 rounded-full border border-white/10" />
          <span className="absolute bottom-5 left-6 font-mono text-[9px] uppercase tracking-[0.25em] text-white/25 sm:left-10">
            inkfluence ✳ writer in residence
          </span>
        </div>

        <div className="px-5 pb-8 sm:px-10">
          <div className="-mt-12 flex items-end justify-between gap-4 sm:-mt-14">
            <Avatar user={profile} size="2xl" className="border-4 border-white shadow-soft" ring={false} />
            <div className="mb-1 flex flex-wrap items-center gap-2">
              {isOwner ? (
                <Link to="/dashboard?edit=profile" className={buttonStyles('outline', 'sm')}>
                  <PenLine className="h-3.5 w-3.5" /> Edit profile
                </Link>
              ) : (
                <FollowButton
                  profileUser={profile}
                  initialFollowing={isFollowing}
                  onChange={(following) => {
                    setIsFollowing(following);
                    setFollowersCount((count) => Math.max(0, count + (following ? 1 : -1)));
                  }}
                  size="md"
                />
              )}
              <Link
                to="/explore"
                className="hidden rounded-full border border-ink/15 px-4 py-2 text-xs font-semibold transition hover:border-ink/40 sm:inline-flex"
              >
                Explore more
              </Link>
            </div>
          </div>

          <div className="mt-5">
            <h1 className="font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              {profile.name}
            </h1>
            <p className="mt-1 text-sm text-ink/40">@{profile.username}</p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/55">
              {profile.bio || 'A curious human, writing things down. No bio yet — leaving room for mystery.'}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-ink/40">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                Joined {formatDate(profile.createdAt)}
              </span>
              {profile.socials?.website && (
                <a
                  href={profile.socials.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 transition hover:text-ink"
                >
                  <Globe className="h-3.5 w-3.5" /> Website
                </a>
              )}
              {profile.socials?.twitter && (
                <a
                  href={
                    profile.socials.twitter.startsWith('http')
                      ? profile.socials.twitter
                      : `https://twitter.com/${profile.socials.twitter.replace('@', '')}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 transition hover:text-ink"
                >
                  <Twitter className="h-3.5 w-3.5" /> @{profile.socials.twitter.replace('@', '')}
                </a>
              )}
              {profile.socials?.instagram && (
                <a
                  href={
                    profile.socials.instagram.startsWith('http')
                      ? profile.socials.instagram
                      : `https://instagram.com/${profile.socials.instagram.replace('@', '')}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 transition hover:text-ink"
                >
                  <Instagram className="h-3.5 w-3.5" /> {profile.socials.instagram.replace('@', '')}
                </a>
              )}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-ink/10 pt-5 sm:grid-cols-4">
              {[
                { label: 'stories', value: stats?.posts ?? blogs.length },
                { label: 'followers', value: followersCount },
                { label: 'likes earned', value: stats?.likes || 0 },
                { label: 'reads', value: stats?.views || 0 },
              ].map((item) => (
                <div key={item.label}>
                  <p className="font-display text-2xl font-semibold tracking-tight">
                    {formatNumber(item.value)}
                  </p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.13em] text-ink/35">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 mt-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mb-2 inline-block rounded-lg bg-lime-400 px-2 py-0.5 font-display text-xs font-semibold">
            their shelf
          </span>
          <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
            {isOwner ? 'Your stories' : `Stories by ${profile.name.split(' ')[0]}`}
          </h2>
        </div>
        {isOwner && (
          <Link to="/write" className={buttonStyles('dark', 'sm')}>
            <PenLine className="h-3.5 w-3.5" /> New story
          </Link>
        )}
      </div>

      {blogs.length === 0 ? (
        <EmptyState
          title={isOwner ? 'Your shelf is waiting' : 'No stories yet'}
          description={
            isOwner
              ? 'The first one is always the hardest. Start with something small and true.'
              : 'This writer has not published anything yet. Check back soon — good things take a minute.'
          }
          actionLabel={isOwner ? 'Write the first one' : 'Browse other stories'}
          actionTo={isOwner ? '/write' : '/explore'}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}

      <div className="mt-12 flex items-center justify-center">
        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white px-4 py-2 text-xs font-medium text-ink/50 transition hover:border-ink/30 hover:text-ink"
        >
          Keep exploring <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
