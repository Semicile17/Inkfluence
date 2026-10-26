import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bold,
  Check,
  Code2,
  Eye,
  Heading2,
  Italic,
  Link2,
  List,
  Loader2,
  PenLine,
  Quote,
  Send,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import api, { getApiError, getFieldErrors } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import BlogCover from '../components/ui/BlogCover.jsx';
import ArticleBody from '../components/blog/ArticleBody.jsx';
import Button, { buttonStyles } from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { Asterisk } from '../components/ui/Doodles.jsx';
import {
  CATEGORIES,
  COVER_THEMES,
  estimateReadTime,
  wordCount,
} from '../lib/utils.js';
import clsx from 'clsx';

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  category: 'Life',
  coverTheme: 'lime',
  coverImage: '',
  status: 'draft',
};

const toolbar = [
  { icon: Bold, label: 'Bold', before: '**', after: '**', placeholder: 'bold words' },
  { icon: Italic, label: 'Italic', before: '*', after: '*', placeholder: 'italic words' },
  { icon: Heading2, label: 'Heading', before: '## ', after: '', placeholder: 'A good heading' },
  { icon: Quote, label: 'Quote', before: '> ', after: '', placeholder: 'Something worth quoting' },
  { icon: List, label: 'List', before: '- ', after: '', placeholder: 'A list item' },
  { icon: Link2, label: 'Link', before: '[', after: '](https://example.com)', placeholder: 'link text' },
  { icon: Code2, label: 'Code', before: '`', after: '`', placeholder: 'code' },
];

export default function Write() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const editing = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [tagsInput, setTagsInput] = useState('');
  const [loading, setLoading] = useState(editing);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveIntent, setSaveIntent] = useState('');
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [dirty, setDirty] = useState(false);
  const textareaRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    document.title = editing ? 'Edit story — Inkfluence' : 'Write a story — Inkfluence';
    return () => {
      document.title = 'Inkfluence — words with influence';
    };
  }, [editing]);

  useEffect(() => {
    if (!editing) return undefined;
    let active = true;
    setLoading(true);
    api
      .get(`/blogs/${id}`)
      .then(({ data }) => {
        if (!active) return;
        if (!data.data.isOwner) {
          navigate('/dashboard', { replace: true });
          return;
        }
        const blog = data.data.blog;
        setForm({
          title: blog.title,
          excerpt: blog.excerpt || '',
          content: blog.content,
          category: blog.category,
          coverTheme: blog.coverTheme,
          coverImage: blog.coverImage || '',
          status: blog.status,
        });
        setTagsInput((blog.tags || []).join(', '));
        setDirty(false);
      })
      .catch((error) => {
        if (active) setLoadError(getApiError(error, 'Could not load that story'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [editing, id, navigate]);

  useEffect(() => {
    if (!dirty) return undefined;
    const handler = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const update = (field) => (event) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
    setErrors((previous) => ({ ...previous, [field]: '' }));
    setDirty(true);
  };

  const parsedTags = useMemo(
    () =>
      [
        ...new Set(
          tagsInput
            .split(',')
            .map((tag) => tag.trim().toLowerCase())
            .filter(Boolean)
        ),
      ],
    [tagsInput]
  );

  const words = wordCount(form.content);
  const readTime = estimateReadTime(form.content);

  const insertMarkdown = (item) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = form.content.slice(start, end) || item.placeholder;
    const next =
      form.content.slice(0, start) + item.before + selected + item.after + form.content.slice(end);
    setForm((previous) => ({ ...previous, content: next }));
    setDirty(true);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + item.before.length, start + item.before.length + selected.length);
    });
  };

  const removeTag = (tag) => {
    setTagsInput(parsedTags.filter((item) => item !== tag).join(', '));
    setDirty(true);
  };

  const save = async (status) => {
    if (saving) return;
    if (form.title.trim().length < 3) {
      setErrors({ title: 'Give your story a title (at least 3 characters)' });
      titleRef.current?.focus();
      toast.error('Your story needs a title first');
      return;
    }
    if (form.content.trim().length < 40) {
      setErrors({ content: 'Write at least 40 characters — a paragraph is plenty to start.' });
      textareaRef.current?.focus();
      toast.error('Your story is still a little too short');
      return;
    }
    if (parsedTags.length > 5) {
      toast.error('Use up to 5 tags — keep it focused');
      return;
    }

    setSaving(true);
    setSaveIntent(status);
    setErrors({});
    try {
      const payload = {
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content,
        category: form.category,
        tags: parsedTags,
        coverTheme: form.coverTheme,
        coverImage: form.coverImage.trim(),
        status,
      };
      const { data } = editing
        ? await api.patch(`/blogs/${id}`, payload)
        : await api.post('/blogs', payload);
      setForm((previous) => ({ ...previous, status: data.data.blog.status }));
      setDirty(false);
      toast.success(data.message);
      navigate(status === 'published' ? `/blog/${data.data.blog.slug}` : '/dashboard');
    } catch (error) {
      setErrors(getFieldErrors(error));
      toast.error(getApiError(error, 'Could not save your story'));
    } finally {
      setSaving(false);
      setSaveIntent('');
    }
  };

  if (loading) {
    return (
      <div className="container-ink flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-ink/40">
          <Loader2 className="h-5 w-5 animate-spin" /> Opening your draft...
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="container-ink py-16">
        <EmptyState
          title="Could not open that draft"
          description={loadError}
          actionLabel="Back to dashboard"
          actionTo="/dashboard"
        />
      </div>
    );
  }

  return (
    <div className="container-ink py-8 sm:py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-ink/40 transition hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to dashboard
        </Link>
        <span
          className={clsx(
            'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em]',
            form.status === 'published' ? 'bg-ink text-lime-300' : 'bg-lime-400 text-ink'
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {form.status === 'published' ? 'Published' : 'Draft'}
        </span>
      </div>

      <div className="mb-7">
        <h1 className="font-display text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
          {editing ? (
            <>
              Shape this <span className="mark">story</span>.
            </>
          ) : (
            <>
              Write something <span className="mark">true</span>.
            </>
          )}
        </h1>
        <p className="mt-2 text-sm text-ink/45">
          {editing
            ? 'Edit freely. Your published link stays the same.'
            : 'A rough paragraph is a perfectly good place to start. You can keep it as a draft.'}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
        <div className="min-w-0">
          <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white">
            <div className="border-b border-ink/10 p-5 sm:p-6">
              <label htmlFor="title" className="sr-only">
                Story title
              </label>
              <textarea
                id="title"
                ref={titleRef}
                value={form.title}
                onChange={update('title')}
                rows={2}
                maxLength={120}
                placeholder="Give it a title worth clicking..."
                className="w-full resize-none border-0 bg-transparent font-display text-3xl font-semibold leading-[1.05] tracking-[-0.04em] text-ink placeholder:text-ink/20 focus:outline-none sm:text-4xl"
              />
              {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}

              <label htmlFor="excerpt" className="sr-only">
                Short excerpt
              </label>
              <textarea
                id="excerpt"
                value={form.excerpt}
                onChange={update('excerpt')}
                rows={2}
                maxLength={280}
                placeholder="A short excerpt for the card (optional but nice)..."
                className="mt-3 w-full resize-none border-0 bg-transparent text-sm leading-relaxed text-ink/60 placeholder:text-ink/25 focus:outline-none"
              />
              <div className="mt-1 flex justify-end">
                <span className="text-[10px] text-ink/25">{form.excerpt.length}/280</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 bg-paper/50 px-3 py-2">
              <div className="flex flex-wrap items-center gap-0.5">
                {toolbar.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => insertMarkdown(item)}
                      title={item.label}
                      aria-label={item.label}
                      className="grid h-8 w-8 place-items-center rounded-lg text-ink/40 transition hover:bg-white hover:text-ink"
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden text-[10px] text-ink/30 sm:inline">
                  {words} words · ~{readTime} min
                </span>
                <div className="flex rounded-full border border-ink/10 bg-white p-0.5 lg:hidden">
                  <button
                    type="button"
                    onClick={() => setShowPreview(false)}
                    className={clsx(
                      'rounded-full px-3 py-1 text-[10px] font-semibold',
                      !showPreview ? 'bg-ink text-white' : 'text-ink/45'
                    )}
                  >
                    Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPreview(true)}
                    className={clsx(
                      'rounded-full px-3 py-1 text-[10px] font-semibold',
                      showPreview ? 'bg-ink text-white' : 'text-ink/45'
                    )}
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2">
              <div className={clsx('relative', showPreview && 'hidden lg:block')}>
                <label htmlFor="content" className="sr-only">
                  Story content in markdown
                </label>
                <textarea
                  id="content"
                  ref={textareaRef}
                  value={form.content}
                  onChange={update('content')}
                  placeholder={`Start with the sentence you cannot get out of your head.

## Then take it for a walk

You can use **markdown** here — headings, lists, quotes. Write badly first. Polish later.`}
                  className="min-h-[560px] w-full resize-none border-0 bg-white p-5 font-mono text-[13px] leading-7 text-ink/80 placeholder:text-ink/25 focus:outline-none sm:p-6"
                />
                {errors.content && <p className="px-5 pb-3 text-xs text-red-600">{errors.content}</p>}
              </div>

              <div
                className={clsx(
                  'border-t border-ink/10 bg-cream/40 lg:border-l lg:border-t-0',
                  !showPreview && 'hidden lg:block'
                )}
              >
                <div className="flex items-center justify-between border-b border-ink/10 px-5 py-3">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-ink/30">
                    Live preview
                  </span>
                  <Eye className="h-3.5 w-3.5 text-ink/25" />
                </div>
                <div className="max-h-[620px] overflow-y-auto p-5 sm:p-6">
                  {form.title && (
                    <h2 className="mb-5 font-display text-2xl font-semibold leading-tight tracking-[-0.03em]">
                      {form.title}
                    </h2>
                  )}
                  {form.content ? (
                    <ArticleBody content={form.content} />
                  ) : (
                    <div className="rounded-2xl border border-dashed border-ink/15 px-5 py-10 text-center text-xs text-ink/30">
                      Your words will appear here as you type.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-ink/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-ink/40">
              <span className="font-medium text-ink/60">{words}</span> words · about{' '}
              <span className="font-medium text-ink/60">{readTime} min</span> to read · saved as{' '}
              <span className="font-medium text-ink/60">{form.status === 'published' ? 'published' : 'a draft'}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {form.status === 'published' ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    loading={saving && saveIntent === 'draft'}
                    onClick={() => save('draft')}
                  >
                    Unpublish
                  </Button>
                  <Button
                    variant="lime"
                    size="sm"
                    loading={saving && saveIntent === 'published'}
                    onClick={() => save('published')}
                  >
                    <Check className="h-3.5 w-3.5" /> Save changes
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    loading={saving && saveIntent === 'draft'}
                    onClick={() => save('draft')}
                  >
                    Save draft
                  </Button>
                  <Button
                    variant="dark"
                    size="sm"
                    loading={saving && saveIntent === 'published'}
                    onClick={() => save('published')}
                  >
                    <Send className="h-3.5 w-3.5" /> Publish story
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-3xl border border-ink/10 bg-white p-5">
            <h2 className="font-display text-base font-semibold">Story settings</h2>
            <p className="mt-1 text-[11px] text-ink/35">The little details that make it yours.</p>

            <div className="mt-5">
              <label htmlFor="category" className="label">
                Category
              </label>
              <select id="category" value={form.category} onChange={update('category')} className="input py-2.5 text-xs">
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <label htmlFor="tags" className="label mb-0">
                  Tags
                </label>
                <span className={clsx('text-[10px]', parsedTags.length > 5 ? 'text-red-500' : 'text-ink/30')}>
                  {parsedTags.length}/5
                </span>
              </div>
              <input
                id="tags"
                value={tagsInput}
                onChange={(event) => {
                  setTagsInput(event.target.value);
                  setDirty(true);
                }}
                placeholder="focus, slow living, writing"
                className="input mt-1.5 py-2.5 text-xs"
              />
              <p className="mt-1 text-[10px] text-ink/30">Separate with commas. Five is plenty.</p>
              {parsedTags.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {parsedTags.map((tag, index) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => removeTag(tag)}
                      className={clsx(
                        'rounded-full px-2.5 py-1 text-[10px] font-medium transition',
                        index >= 5
                          ? 'bg-red-50 text-red-500'
                          : 'bg-paper text-ink/55 hover:bg-lime-100 hover:text-ink'
                      )}
                      title="Remove tag"
                    >
                      #{tag} ×
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-semibold">Cover</h2>
              <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-ink/25">
                generative art
              </span>
            </div>
            <BlogCover
              theme={form.coverTheme}
              coverImage={form.coverImage}
              title={form.title || 'Your story'}
              className="mt-3 aspect-[16/9] rounded-2xl border border-ink/10"
            />

            <div className="mt-4 grid grid-cols-3 gap-2">
              {COVER_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => {
                    setForm((previous) => ({ ...previous, coverTheme: theme.id }));
                    setDirty(true);
                  }}
                  className={clsx(
                    'group relative overflow-hidden rounded-xl border-2 transition',
                    form.coverTheme === theme.id && !form.coverImage
                      ? 'border-ink'
                      : 'border-transparent hover:border-ink/20'
                  )}
                  aria-pressed={form.coverTheme === theme.id}
                  title={`${theme.label} cover`}
                >
                  <BlogCover
                    theme={theme.id}
                    title={`${theme.label} cover`}
                    className="aspect-[4/3]"
                    showLabel={false}
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-white/85 py-0.5 text-center text-[8px] font-semibold uppercase tracking-wider text-ink/60">
                    {theme.label}
                  </span>
                  {form.coverTheme === theme.id && !form.coverImage && (
                    <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-ink text-lime-400">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <label htmlFor="coverImage" className="label">
                Or paste an image URL
              </label>
              <input
                id="coverImage"
                type="url"
                value={form.coverImage}
                onChange={update('coverImage')}
                placeholder="https://images.example.com/cover.jpg"
                className="input py-2.5 text-[11px]"
              />
              {form.coverImage && (
                <p className="mt-1 text-[10px] text-ink/30">
                  Image URL overrides the generated art.
                </p>
              )}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-ink p-5 text-white">
            <Asterisk className="absolute -right-4 -top-4 h-20 w-20 text-lime-400/20" />
            <Sparkles className="h-4 w-4 text-lime-400" />
            <p className="mt-2 font-display text-sm font-semibold">A small permission slip</p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-white/45">
              Your first draft is allowed to be messy. The publish button is not a
              promise of perfection — it is an invitation to be read.
            </p>
          </div>

          <div className="hidden lg:block">
            <Button
              type="button"
              variant="dark"
              size="lg"
              className="w-full"
              loading={saving}
              onClick={() => save(form.status)}
            >
              <PenLine className="h-4 w-4" />
              {form.status === 'published' ? 'Save changes' : 'Save draft'}
            </Button>
            <Link
              to="/dashboard"
              className="mt-2 flex w-full items-center justify-center rounded-full py-2 text-[11px] font-medium text-ink/35 transition hover:text-ink"
            >
              Back to dashboard
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
