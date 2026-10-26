import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Send, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import api, { getApiError } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Avatar from '../ui/Avatar.jsx';
import Button, { buttonStyles } from '../ui/Button.jsx';
import { timeAgo } from '../../lib/utils.js';

export default function CommentSection({ blogId, blogAuthorId }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .get(`/comments/blog/${blogId}`)
      .then(({ data }) => {
        if (active) setComments(data.data.comments);
      })
      .catch(() => {
        if (active) setComments([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [blogId]);

  const submit = async (event) => {
    event.preventDefault();
    if (!content.trim()) return;
    setPosting(true);
    try {
      const { data } = await api.post(`/comments/blog/${blogId}`, { content });
      setComments((previous) => [data.data.comment, ...previous]);
      setContent('');
      toast.success('Added to the conversation');
    } catch (error) {
      toast.error(getApiError(error, 'Could not post your comment'));
    } finally {
      setPosting(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this comment? It will be gone for good.')) return;
    setDeletingId(id);
    try {
      await api.delete(`/comments/${id}`);
      setComments((previous) => previous.filter((comment) => comment._id !== id));
      toast.success('Comment deleted');
    } catch (error) {
      toast.error(getApiError(error, 'Could not delete the comment'));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section id="comments" className="mt-14 scroll-mt-28 border-t border-ink/10 pt-10">
      <div className="flex items-center justify-between gap-4">
        <h2 className="inline-flex items-center gap-2.5 font-display text-2xl font-semibold tracking-tight">
          <MessageCircle className="h-5 w-5 text-ink/40" />
          The conversation
          <span className="rounded-full bg-lime-400 px-2 py-0.5 text-[10px] font-bold">
            {comments.length}
          </span>
        </h2>
      </div>

      {isAuthenticated ? (
        <form onSubmit={submit} className="mt-6 rounded-3xl border border-ink/10 bg-white p-4 sm:p-5">
          <div className="flex gap-3">
            <Avatar user={user} size="sm" />
            <div className="flex-1">
              <label htmlFor="comment" className="sr-only">
                Write a comment
              </label>
              <textarea
                id="comment"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                rows={3}
                maxLength={1000}
                placeholder={`Say something nice (or useful), ${user.name.split(' ')[0]}...`}
                className="input resize-none border-0 bg-paper/60 px-4 py-3 text-sm focus:ring-1"
              />
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-[10px] text-ink/30">{content.length}/1000</span>
                <Button type="submit" size="sm" loading={posting} disabled={!content.trim()}>
                  <Send className="h-3.5 w-3.5" /> Post
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mt-6 flex flex-col items-start justify-between gap-3 rounded-2xl border border-dashed border-ink/20 bg-white px-5 py-4 sm:flex-row sm:items-center">
          <p className="text-sm text-ink/55">Have something to add? Join the conversation.</p>
          <Link
            to="/login"
            state={{ from: location.pathname }}
            className={buttonStyles('dark', 'sm')}
          >
            Sign in to comment
          </Link>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="h-24 animate-pulse rounded-2xl bg-ink/[0.05]" />
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink/15 bg-paper/40 px-5 py-8 text-center text-sm text-ink/40">
            Quiet in here. Be the first to leave a thought.
          </p>
        ) : (
          comments.map((comment) => {
            const canDelete =
              user && (String(comment.author?._id) === String(user.id) || String(blogAuthorId) === String(user.id));
            return (
              <article
                key={comment._id}
                className="rounded-2xl border border-ink/10 bg-white p-4 sm:p-5"
              >
                <div className="flex items-start gap-3">
                  <Link to={`/writers/${comment.author?.username}`}>
                    <Avatar user={comment.author} size="sm" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <Link
                        to={`/writers/${comment.author?.username}`}
                        className="text-xs font-semibold transition hover:opacity-60"
                      >
                        {comment.author?.name || 'A reader'}
                      </Link>
                      <span className="text-[10px] text-ink/30">{timeAgo(comment.createdAt)}</span>
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => remove(comment._id)}
                          disabled={deletingId === comment._id}
                          className="ml-auto inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] text-ink/25 transition hover:bg-red-50 hover:text-red-600"
                          aria-label="Delete comment"
                        >
                          <Trash2 className="h-3 w-3" />
                          {deletingId === comment._id ? 'Deleting...' : 'Delete'}
                        </button>
                      )}
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink/65">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
