import { useState, useEffect } from 'react'
import { IconX, IconDeviceFloppy, IconEdit, IconFilePlus } from '@tabler/icons-react'
import MarkdownEditor from '../../../components/MarkdownEditor'
import { showErrorAlert } from '../../../helpers/toolsHelper'

const CATEGORIES = ['Teknologi', 'Pendidikan', 'Gaya Hidup', 'Bisnis', 'Opini', 'Umum']

export default function PostModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  isDark = false,
}) {
  const isEdit = Boolean(initialData && initialData.id)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Teknologi')
  const [excerpt, setExcerpt] = useState('')
  const [coverImagePath, setCoverImagePath] = useState('')
  const [content, setContent] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || '')
      setCategory(initialData?.category || 'Teknologi')
      setExcerpt(initialData?.excerpt || '')
      setCoverImagePath(initialData?.cover_image_path || '')
      setContent(initialData?.content || '')
      setIsPublished(Boolean(initialData?.is_published))
    }
  }, [isOpen, initialData])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      await showErrorAlert('Judul dan isi artikel (Markdown) wajib diisi.')
      return
    }

    setSaving(true)
    try {
      await onSave({
        title: title.trim(),
        category,
        excerpt: excerpt.trim(),
        cover_image_path: coverImagePath.trim(),
        content: content.trim(),
        is_published: isPublished,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-2 sm:p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? 'Ubah Artikel' : 'Tambah Artikel Baru'}
    >
      <div className="flex h-[95vh] w-full max-w-[96vw] flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800">
        {/* Distinct Colored Header */}
        <header
          className={`flex shrink-0 items-center justify-between px-6 py-4 text-white shadow-md ${
            isEdit ? 'bg-amber-600' : 'bg-blue-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-white/20 p-2">
              {isEdit ? <IconEdit size={22} /> : <IconFilePlus size={22} />}
            </span>
            <div>
              <h2 className="text-lg font-extrabold">
                {isEdit ? 'Ubah Artikel Blog' : 'Tulis Artikel Baru'}
              </h2>
              <p className="text-xs text-white/80">
                Editor Markdown Layar Penuh (Full Width Workspace)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Tutup Editor"
            className="rounded-xl p-2 text-white/80 hover:bg-white/20 hover:text-white"
          >
            <IconX size={22} />
          </button>
        </header>

        {/* Scrollable Full Width Content */}
        <form id="post-modal-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
            <div className="space-y-4">
              <div>
                <label htmlFor="post-title" className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Judul Artikel
                </label>
                <input
                  id="post-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan judul artikel..."
                  className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label htmlFor="post-category" className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Kategori
                </label>
                <select
                  id="post-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="post-excerpt" className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Ringkasan Pemikat (Excerpt)
                </label>
                <textarea
                  id="post-excerpt"
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat..."
                  className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label htmlFor="post-cover" className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                  URL Gambar Sampul (Opsional)
                </label>
                <input
                  id="post-cover"
                  type="text"
                  value={coverImagePath}
                  onChange={(e) => setCoverImagePath(e.target.value)}
                  placeholder="https://example.com/cover.jpg"
                  className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm"
                />
              </div>

              <label
                htmlFor="post-published"
                className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-4 cursor-pointer"
              >
                <input
                  id="post-published"
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="h-4 w-4 rounded text-blue-600"
                />
                <div>
                  <span className="block text-sm font-bold text-slate-800 dark:text-slate-100">
                    Publikasikan Artikel
                  </span>
                  <span className="block text-xs text-slate-500">
                    Jika dicentang, artikel langsung tayang di galeri publik.
                  </span>
                </div>
              </label>
            </div>

            <div className="min-w-0">
              <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                Isi Artikel (Toast UI Markdown Editor)
              </span>
              <MarkdownEditor
                value={content}
                onChange={setContent}
                height="500px"
                theme={isDark ? 'dark' : 'light'}
              />
            </div>
          </div>
        </form>

        {/* Distinct Contrast Colored Footer with Batal & Simpan on the Right */}
        <footer className="flex shrink-0 items-center justify-end gap-3 bg-slate-900 px-6 py-4 text-white">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl bg-white/10 hover:bg-white/20 px-5 py-2.5 text-sm font-bold text-white transition"
          >
            Batal
          </button>
          <button
            type="submit"
            form="post-modal-form"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition disabled:opacity-60"
          >
            <IconDeviceFloppy size={18} />
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </footer>
      </div>
    </div>
  )
}
