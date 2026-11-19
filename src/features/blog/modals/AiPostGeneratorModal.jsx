import { useState } from 'react'
import { IconX, IconSparkles, IconWorldSearch, IconCheck, IconExternalLink } from '@tabler/icons-react'
import { generateAiPost } from '../api/blogApi'
import { showErrorAlert, showSuccessAlert } from '../../../helpers/toolsHelper'
import MarkdownViewer from '../../../components/MarkdownViewer'

const CATEGORIES = ['Teknologi', 'Pendidikan', 'Gaya Hidup', 'Bisnis', 'Opini', 'Umum']

export default function AiPostGeneratorModal({
  isOpen,
  onClose,
  onApplyDraft,
  isDark = false,
}) {
  const [topic, setTopic] = useState('')
  const [category, setCategory] = useState('Teknologi')
  const [includeWebSearch, setIncludeWebSearch] = useState(true)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  if (!isOpen) return null

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!topic.trim()) {
      await showErrorAlert('Topik artikel wajib diisi untuk menjalankan AI Generator.')
      return
    }

    setLoading(true)
    try {
      const res = await generateAiPost({
        topic: topic.trim(),
        category,
        include_web_search: includeWebSearch,
      })
      setResult(res.data)
      await showSuccessAlert('Draf artikel AI beserta referensi berhasil dibuat!')
    } catch (err) {
      await showErrorAlert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = () => {
    onApplyDraft({
      title: result.title,
      category: result.category || category,
      excerpt: result.excerpt || '',
      content: result.content,
      is_published: false,
    })
  }

  const sources = result?.sources || result?.search_sources || []

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-2 sm:p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="AI Blog Generator"
    >
      <div className="flex h-[95vh] w-full max-w-[96vw] flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800">
        {/* Distinct Contrast Colored Header */}
        <header className="flex shrink-0 items-center justify-between bg-gradient-to-r from-indigo-700 via-purple-700 to-fuchsia-700 px-6 py-4 text-white shadow-md">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-white/20 p-2">
              <IconSparkles size={22} />
            </span>
            <div>
              <h2 className="text-lg font-extrabold">
                AI Blog Generator + Search Engine Integration
              </h2>
              <p className="text-xs text-white/80">
                Rancang artikel otomatis berbasis fakta terkini dari Mesin Pencari & OpenAI
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Tutup AI Generator"
            className="rounded-xl p-2 text-white/80 hover:bg-white/20 hover:text-white"
          >
            <IconX size={22} />
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
            <form onSubmit={handleGenerate} className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-5 h-fit">
              <div>
                <label htmlFor="ai-topic" className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Topik Artikel
                </label>
                <textarea
                  id="ai-topic"
                  rows={3}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Contoh: Perkembangan Arsitektur Microservices dengan Golang Gin di 2026"
                  className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label htmlFor="ai-category" className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Target Kategori
                </label>
                <select
                  id="ai-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <label
                htmlFor="ai-web-search"
                className="flex items-start gap-3 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/70 dark:bg-indigo-950/40 p-3.5 cursor-pointer"
              >
                <input
                  id="ai-web-search"
                  type="checkbox"
                  checked={includeWebSearch}
                  onChange={(e) => setIncludeWebSearch(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded text-indigo-600"
                />
                <div>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-200">
                    <IconWorldSearch size={16} /> Integrasi Live Search Engine
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-600 dark:text-slate-400">
                    Telusuri referensi web aktual sebagai konteks AI Content Generator.
                  </span>
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:brightness-110 px-5 py-3 text-sm font-bold text-white shadow-md transition disabled:opacity-60"
              >
                <IconSparkles size={18} />
                {loading ? 'Menelusuri & Merancang Artikel...' : 'Generate Artikel dengan AI'}
              </button>
            </form>

            {/* Preview Output */}
            <div className="min-w-0">
              {!result ? (
                <div className="flex h-full min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-10 text-center">
                  <IconSparkles size={40} className="text-fuchsia-500 opacity-60" />
                  <p className="mt-3 text-base font-bold text-slate-700 dark:text-slate-200">
                    Pratinjau Artikel AI Akan Tampil di Sini
                  </p>
                  <p className="mt-1 max-w-md text-xs text-slate-500">
                    Masukkan topik di panel kiri. Sistem akan melakukan pencarian via Search Engine, menyusun konteks, dan menghasilkan draf Markdown lengkap.
                  </p>
                </div>
              ) : (
                <div className="space-y-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                  <div>
                    <span className="rounded-full bg-indigo-100 dark:bg-indigo-950 px-3 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                      {result.category}
                    </span>
                    <h3 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                      {result.title}
                    </h3>
                    {result.excerpt && (
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 italic">
                        {result.excerpt}
                      </p>
                    )}
                  </div>

                  {sources.length > 0 && (
                    <div className="rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/60 dark:bg-emerald-950/30 p-4">
                      <h4 className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                        <IconWorldSearch size={16} /> Sumber Rujukan Mesin Pencari ({sources.length})
                      </h4>
                      <ul className="mt-2 space-y-2 text-xs">
                        {sources.map((src, idx) => (
                          <li key={idx} className="flex flex-col">
                            <a
                              href={src.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                            >
                              {src.title || src.url} <IconExternalLink size={12} />
                            </a>
                            {src.snippet && <span className="text-slate-600 dark:text-slate-400">{src.snippet}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                    <MarkdownViewer content={result.content} theme={isDark ? 'dark' : 'light'} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Distinct Contrast Colored Footer with Batal & Simpan/Terapkan on Right */}
        <footer className="flex shrink-0 items-center justify-end gap-3 bg-slate-900 px-6 py-4 text-white">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl bg-white/10 hover:bg-white/20 px-5 py-2.5 text-sm font-bold text-white transition"
          >
            Batal
          </button>
          {result && (
            <button
              type="button"
              onClick={handleApply}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition"
            >
              <IconCheck size={18} /> Simpan & Terapkan ke Editor
            </button>
          )}
        </footer>
      </div>
    </div>
  )
}
