import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import api from '../lib/api.js';
import Hero from '../components/home/Hero.jsx';
import Marquee, { TagsStrip } from '../components/home/Marquee.jsx';
import CategoryGrid from '../components/home/CategoryGrid.jsx';
import MuseSection from '../components/home/MuseSection.jsx';
import HowItWorks from '../components/home/HowItWorks.jsx';
import Writers from '../components/home/Writers.jsx';
import Testimonials from '../components/home/Testimonials.jsx';
import CTA from '../components/home/CTA.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import BlogCard from '../components/ui/BlogCard.jsx';
import { BlogCardSkeleton } from '../components/ui/Skeleton.jsx';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [writers, setWriters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      const [featuredResult, latestResult, tagsResult, statsResult, writersResult] =
        await Promise.allSettled([
          api.get('/blogs?featured=true&limit=3'),
          api.get('/blogs?limit=6&sort=latest'),
          api.get('/blogs/tags'),
          api.get('/blogs/stats'),
          api.get('/users?limit=3'),
        ]);

      if (!active) return;

      const featuredBlogs =
        featuredResult.status === 'fulfilled' ? featuredResult.value.data.data.blogs : [];
      const latestBlogs =
        latestResult.status === 'fulfilled' ? latestResult.value.data.data.blogs : [];

      if (tagsResult.status === 'fulfilled') {
        setTags(tagsResult.value.data.data.tags);
        setCategories(tagsResult.value.data.data.categories);
      }
      if (statsResult.status === 'fulfilled') setStats(statsResult.value.data.data);
      if (writersResult.status === 'fulfilled') setWriters(writersResult.value.data.data.writers);

      setFeatured(featuredBlogs);
      setLatest(latestBlogs);
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const mergedFeatured = [...featured];
  for (const blog of latest) {
    if (mergedFeatured.length >= 3) break;
    if (!mergedFeatured.some((item) => item._id === blog._id)) mergedFeatured.push(blog);
  }

  return (
    <>
      <Hero featured={mergedFeatured[0]} stats={stats} loading={loading} />
      <Marquee />

      <section className="container-ink py-16 sm:py-20">
        <SectionHeading
          eyebrow="fresh off the press"
          title={
            <>
              Stories with a little <span className="mark">pulse</span>.
            </>
          }
          description="Hand-picked words on attention, work, design and the beautiful business of being human."
          actionLabel="Browse the whole library"
          actionTo="/explore"
        />

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))}
          </div>
        ) : mergedFeatured.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mergedFeatured.slice(0, 3).map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-ink/20 bg-white p-10 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-ink/30" />
            <p className="mt-3 text-sm text-ink/50">
              The shelves are waiting for their first story.{' '}
              <Link to="/register" className="link-underline font-medium text-ink">
                Add yours
              </Link>
              .
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-4 border-t border-ink/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-ink/35">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-500" />
            Trending topics
          </div>
          <TagsStrip tags={tags} />
        </div>
      </section>

      <section className="container-ink pb-16 sm:pb-20">
        <SectionHeading
          eyebrow="read by mood"
          title="What are you in the mood for?"
          description="Follow a curiosity. There is no wrong door."
          actionLabel="All categories"
          actionTo="/explore"
        />
        <CategoryGrid categories={categories} />
      </section>

      <MuseSection blog={latest[1] || mergedFeatured[1] || mergedFeatured[0]} />

      <section id="write-with-us" className="container-ink scroll-mt-24 py-16 sm:py-20">
        <HowItWorks />
      </section>

      <section className="container-ink pb-16 sm:pb-20">
        <SectionHeading
          eyebrow="the people behind the paragraphs"
          title={
            <>
              Writers worth <span className="mark">following</span>.
            </>
          }
          description="A small, growing shelf of people who notice things and write them down."
          actionLabel="Read their stories"
          actionTo="/explore"
        />
        <Writers writers={writers} loading={loading} />
      </section>

      <Testimonials />

      <CTA />

      <div className="container-ink">
        <div className="flex flex-col items-center gap-3 border-t border-ink/10 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-xs text-ink/40">
            New here? The demo account is open:{' '}
            <span className="font-medium text-ink/70">demo@inkfluence.app</span> /{' '}
            <span className="font-medium text-ink/70">demo1234</span>
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-xs font-semibold text-ink transition hover:opacity-60"
          >
            Take a look around <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </>
  );
}
