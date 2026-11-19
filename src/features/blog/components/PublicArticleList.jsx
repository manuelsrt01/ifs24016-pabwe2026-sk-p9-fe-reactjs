import { useState, useEffect, useCallback } from 'react'
import { IconSearch, IconClock, IconUser, IconArrowRight, IconSparkles } from '@tabler/icons-react'
import { fetchCategories, fetchPublicPosts } from '../api/blogApi'
import { formatDate } from '../../../helpers/toolsHelper'

const DEFAULT_CATEGORIES = ['Semua', 'Teknologi', 'Pendidikan', 'Gaya Hidup', 'Bisnis', 'Opini', 'Umum']

export default function PublicArticleList({ user, onNavigate }) {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchCategories()
        if (Array.isArray(res.data) && res.data.length > 0) {
          const list = res.data.includes('Semua') ? res.data : ['Semua', ...res.data]
          setCategories(list)
        }
      } catch {
        // Keep default categories on error
      }
    }
    loadCategories()
  }, [])

  const loadPosts = useCallback(async (q, cat) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetchPublicPosts({
        q,
        category: cat === 'Semua' ? '' : cat,
      })
      setPosts(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPosts(searchQuery, selectedCategory)
  }, [searchQuery, selectedCategory, loadPosts])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Banner */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold tracking-wide uppercase">
            <IconSparkles size={15} /> Platform Publikasi Multi-Tier & AI Search Engine
          </div>
          <h1 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-5xl">
            Eksplorasi Gagasan & Artikel Berkualitas di Delcom Blog
          </h1>
          <p className="mt-3 max-w-2xl text-base text-blue-100">
            Baca artikel publik terbaru dengan estimasi waktu baca, tulis menggunakan Markdown Editor, dan rancang draf cerdas bersama AI Content Generator.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {user ? (
              <button
                type="button"
                onClick={() => onNavigate(user.role === 'admin' ? '/admin' : '/author')}
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-blue-700 shadow hover:bg-blue-50"
              >
                Buka Workspace ({user.username})
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate('/login')}
                  className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-blue-700 shadow hover:bg-blue-50"
                >
                  Masuk Penulis
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('/register')}
                  className="rounded-xl border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/20"
                >
                  Daftar Akun Baru
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Main Content without Sidebar */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Search & Filter Pills */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-xl">
            <IconSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              aria-label="Cari artikel"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari artikel berdasarkan judul, ringkasan, atau kata kunci..."
              className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-3 pl-11 pr-4 text-sm shadow-sm outline-none focus:border-blue-600"
            />
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter Kategori">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-blue-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-12 py-16 text-center text-sm font-medium text-slate-500">
            Memuat galeri artikel publik...
          </div>
        ) : posts.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center">
            <p className="text-lg font-bold text-slate-800 dark:text-slate-100">Belum ada artikel yang ditemukan</p>
            <p className="mt-1 text-sm text-slate-500">Coba gunakan kata kunci pencarian atau pilih kategori lain.</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const readingTime = post.reading_time ?? post.reading_minutes ?? 1
              const authorName = post.author?.username || 'Penulis'
              return (
                <article
                  key={post.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div>
                    {post.cover_image_path ? (
                      <img
                        src={post.cover_image_path}
                        alt={post.title}
                        className="h-44 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-44 w-full items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-4xl font-extrabold text-white/30">
                        {post.category || 'Blog'}
                      </div>
                    )}

                    <div className="p-5">
                      <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                        <span className="rounded-full bg-blue-50 dark:bg-blue-950/60 px-3 py-1 font-bold text-blue-600 dark:text-blue-400">
                          {post.category}
                        </span>
                        <span className="inline-flex items-center gap-1 font-medium">
                          <IconClock size={14} /> {readingTime} menit baca
                        </span>
                      </div>

                      <h2 className="mt-3 text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600">
                        <button
                          type="button"
                          onClick={() => onNavigate(`/posts/${post.slug}`)}
                          className="text-left hover:underline"
                        >
                          {post.title}
                        </button>
                      </h2>

                      <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-5 py-3.5 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                      <IconUser size={14} /> @{authorName} · {formatDate(post.published_at || post.created_at)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigate(`/posts/${post.slug}`)}
                      className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                    >
                      Baca <IconArrowRight size={14} />
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
