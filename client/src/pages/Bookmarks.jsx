import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkX } from 'lucide-react';
import { toast } from 'sonner';
import api, { getApiError } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import BlogCard from '../components/ui/BlogCard.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { BlogGridSkeleton } from '../components/ui/Skeleton.jsx';
import { buttonStyles } from '../components/ui/Button.jsx';

export default function Bookmarks() {
  const { toggleBookmarkLocal } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    let active = true;
    document.title = 'Your reading list — Inkfluence';
    api
      .get('/blogs/bookmarks')
      .then(({ data }) => {
        if (active) setBlogs(data.data.blogs);
      })
      .catch((error) => {
        if (active) toast.error(getApiError(error, 'Could not load your reading list'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const remove = async (blog) => {
    setRemovingId(blog._id);
    try {
      await api.post(`/blogs/${blog._id}/bookmark`);
      setBlogs((previous) => previous.filter((item) => item._id !== blog._id));
      toggleBookmarkLocal(blog._id);
      toast.success('Removed from your reading list');
    } catch (error) {
      toast.error(getApiError(error, 'Could not remove that story'));
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="container-ink py-10 sm:py-14">
      <div className="mb-8 flex flex-col justify-between gap-5 border-b border-ink/10 pb-8 sm:flex-row sm:items-end">
        <div>
          <span className="eyebrow">
            <Bookmark className="h-3 w-3" /> saved for later
          </span>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-none tracking-[-0.05em] sm:text-5xl">
            Your reading list.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/50">
            {loading
              ? 'Gathering your saved stories...'
              : blogs.length
                ? `${blogs.length} ${blogs.length === 1 ? 'story' : 'stories'} waiting patiently for a quiet moment.`
                : 'A place for the stories you want to come back to.'}
          </p>
        </div>
        <Link to="/explore" className={buttonStyles('outline', 'md')}>
          Find more to save
        </Link>
      </div>

      {loading ? (
        <BlogGridSkeleton count={3} />
      ) : blogs.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="h-6 w-6" />}
          title="No stories saved yet"
          description="Tap the bookmark on any story and it will wait for you here — no notification, no guilt."
          actionLabel="Browse the library"
          actionTo="/explore"
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <div key={blog._id} className="relative">
              <BlogCard blog={blog} />
              <button
                type="button"
                onClick={() => remove(blog)}
                disabled={removingId === blog._id}
                aria-label={`Remove ${blog.title} from your reading list`}
                className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-ink/10 bg-white/90 text-ink/50 shadow-sm backdrop-blur transition hover:bg-white hover:text-ink disabled:opacity-50"
              >
                <BookmarkX className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
