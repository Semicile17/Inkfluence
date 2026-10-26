import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Clock, Eye, Heart } from 'lucide-react';
import BlogCover from './BlogCover.jsx';
import Avatar from './Avatar.jsx';
import { categoryTone, formatDate, formatNumber } from '../../lib/utils.js';

export default function BlogCard({ blog, className, coverClassName, compact = false }) {
  if (!blog) return null;
  const author = blog.author || {};

  return (
    <article
      className={clsx(
        'group flex h-full flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white transition duration-300 hover:-translate-y-1 hover:border-ink/25 hover:shadow-lift',
        className
      )}
    >
      <Link
        to={`/blog/${blog.slug}`}
        className="block overflow-hidden"
        aria-label={`Read ${blog.title}`}
      >
        <BlogCover
          theme={blog.coverTheme}
          coverImage={blog.coverImage}
          title={blog.title}
          category={blog.category}
          className={clsx('aspect-[16/10]', coverClassName)}
        />
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] font-medium text-ink/50">
          <Link
            to={`/explore?category=${encodeURIComponent(blog.category)}`}
            className={clsx(
              'inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] transition hover:opacity-75',
              categoryTone[blog.category] || 'bg-paper text-ink'
            )}
          >
            {blog.category}
          </Link>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {blog.readTime || 1} min read
          </span>
        </div>

        <Link to={`/blog/${blog.slug}`} className="group/title">
          <h3
            className={clsx(
              'font-display font-semibold leading-[1.15] tracking-[-0.025em] text-ink transition-colors group-hover/title:text-ink/70',
              compact ? 'text-lg' : 'text-xl sm:text-[1.4rem]'
            )}
          >
            {blog.title}
          </h3>
        </Link>

        {blog.excerpt && (
          <p
            className={clsx(
              'mt-2.5 text-sm leading-relaxed text-ink/55',
              compact ? 'line-clamp-2' : 'line-clamp-3'
            )}
          >
            {blog.excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <Link
            to={`/writers/${author.username}`}
            className="flex min-w-0 items-center gap-2.5 rounded-full pr-1 transition hover:opacity-70"
          >
            <Avatar user={author} size="sm" />
            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold text-ink">
                {author.name || 'Inkfluence writer'}
              </span>
              <span className="block text-[10px] text-ink/40">
                {formatDate(blog.publishedAt || blog.createdAt)}
              </span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2.5 text-[11px] text-ink/40">
            <span className="inline-flex items-center gap-1" title={`${blog.likesCount || 0} likes`}>
              <Heart className="h-3.5 w-3.5" aria-hidden="true" />
              {formatNumber(blog.likesCount || 0)}
            </span>
            <span className="inline-flex items-center gap-1" title={`${blog.views || 0} views`}>
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              {formatNumber(blog.views || 0)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
