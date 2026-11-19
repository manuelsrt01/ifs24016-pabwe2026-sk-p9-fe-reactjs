import { useState, useEffect } from 'react'
import { IconArrowLeft, IconClock, IconUser, IconCalendar } from '@tabler/icons-react'
import { fetchPublicPostBySlug } from '../api/blogApi'
import { formatDate } from '../../../helpers/toolsHelper'
import MarkdownViewer from '../../../components/MarkdownViewer'

export default function PublicArticleDetail({ slug, onNavigate, isDark = false }) {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError('')
    fetchPublicPostBySlug(slug)
      .then((res) => {
        if (mounted) {
          setPost(res.data)
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message)
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [slug])

  if (loading) {
    return (
      <div className="w-full px-6 py-20 text-center text-sm font-medium text-slate-500">
        Memuat artikel...
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="w-full max-w-[96vw] mx-auto px-4 py-16 text-center">
        <p className="text-lg font-bold text-rose-600">{error || 'Artikel tidak ditemukan'}</p>
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white"
        >
          <IconArrowLeft size={16} /> Kembali ke Galeri
        </button>
      </div>
    )
  }

  const readingTime = post.reading_time ?? post.reading_minutes ?? 1
  const authorName = post.author?.username || 'Penulis'

  return (
    <div className="w-full max-w-[96vw] mx-auto px-4 py-8 sm:px-8">
      <button
        type="button"
        onClick={() => onNavigate('/')}
        className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-blue-500"
      >
        <IconArrowLeft size={17} /> Kembali ke Galeri Artikel
      </button>

      <article className="w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
          <span className="rounded-full bg-blue-600 px-3.5 py-1 text-white">
            {post.category}
          </span>
          <span className="inline-flex items-center gap-1">
            <IconClock size={15} /> {readingTime} menit baca
          </span>
          <span className="inline-flex items-center gap-1">
            <IconUser size={15} /> @{authorName}
          </span>
          <span className="inline-flex items-center gap-1">
            <IconCalendar size={15} /> {formatDate(post.published_at || post.created_at)}
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-300 border-l-4 border-blue-600 pl-4 italic">
            {post.excerpt}
          </p>
        )}

        {post.cover_image_path && (
          <div className="mt-6 overflow-hidden rounded-2xl">
            <img
              src={post.cover_image_path}
              alt={post.title}
              className="max-h-96 w-full object-cover"
            />
          </div>
        )}

        <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-8">
          <MarkdownViewer content={post.content} theme={isDark ? 'dark' : 'light'} />
        </div>
      </article>
    </div>
  )
}
