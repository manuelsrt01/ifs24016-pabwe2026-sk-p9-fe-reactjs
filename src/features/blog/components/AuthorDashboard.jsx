import { useState, useEffect, useCallback } from 'react'
import {
  IconPlus,
  IconSparkles,
  IconDotsVertical,
  IconEye,
  IconEdit,
  IconTrash,
  IconClock,
} from '@tabler/icons-react'
import {
  fetchAuthorPosts,
  fetchAuthorStats,
  createPost,
  updatePost,
  togglePublishPost,
  deletePost,
} from '../api/blogApi'
import {
  formatDate,
  showConfirmDialog,
  showErrorAlert,
  showSuccessAlert,
} from '../../../helpers/toolsHelper'
import PostStats from './PostStats'
import PostModal from '../modals/PostModal'
import AiPostGeneratorModal from '../modals/AiPostGeneratorModal'

export default function AuthorDashboard({ user, onNavigate, isDark = false }) {
  const [posts, setPosts] = useState([])
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0 })
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [aiModalOpen, setAiModalOpen] = useState(false)

  const loadWorkspace = useCallback(async () => {
    setLoading(true)
    try {
      const [postsRes, statsRes] = await Promise.all([
        fetchAuthorPosts(),
        fetchAuthorStats(),
      ])
      setPosts(Array.isArray(postsRes.data) ? postsRes.data : [])
      setStats(statsRes.data || { total: 0, published: 0, draft: 0 })
    } catch (err) {
      await showErrorAlert(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadWorkspace()
  }, [loadWorkspace])

  const handleOpenCreate = () => {
    setEditingPost(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (post) => {
    setOpenMenuId(null)
    setEditingPost(post)
    setModalOpen(true)
  }

  const handleSavePost = async (payload) => {
    try {
      if (editingPost && editingPost.id) {
        await updatePost(editingPost.id, payload)
        await showSuccessAlert('Artikel berhasil diperbarui!')
      } else {
        await createPost(payload)
        await showSuccessAlert('Artikel baru berhasil disimpan!')
      }
      setModalOpen(false)
      setEditingPost(null)
      await loadWorkspace()
    } catch (err) {
      await showErrorAlert(err.message)
    }
  }

  const handleTogglePublish = async (post) => {
    try {
      await togglePublishPost(post.id)
      await showSuccessAlert(
        post.is_published
          ? 'Artikel dikembalikan ke status Draf.'
          : 'Artikel berhasil diterbitkan ke Publik!'
      )
      await loadWorkspace()
    } catch (err) {
      await showErrorAlert(err.message)
    }
  }

  const handleDeletePost = async (post) => {
    setOpenMenuId(null)
    const confirmed = await showConfirmDialog(
      `Apakah Anda yakin ingin menghapus artikel "${post.title}"?`
    )
    if (!confirmed) return

    try {
      await deletePost(post.id)
      await showSuccessAlert('Artikel berhasil dihapus.')
      await loadWorkspace()
    } catch (err) {
      await showErrorAlert(err.message)
    }
  }

  const handleApplyAiDraft = (draftData) => {
    setAiModalOpen(false)
    setEditingPost(draftData)
    setModalOpen(true)
  }

  const filteredPosts = posts.filter((p) => {
    if (statusFilter === 'published') return Boolean(p.is_published)
    if (statusFilter === 'draft') return !p.is_published
    return true
  })

  return (
    <div className="w-full max-w-[96vw] mx-auto px-4 py-8 sm:px-8">
      {/* Header Workspace */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
            Workspace Penulis {user?.username ? `(@${user.username})` : ''}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Kelola publikasi artikel Anda, pantau statistik, dan rancang konten dengan AI Generator.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setAiModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-700 to-fuchsia-700 hover:brightness-110 px-4 py-2.5 text-sm font-bold text-white shadow-md transition"
          >
            <IconSparkles size={18} /> AI Generator
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-800 px-4 py-2.5 text-sm font-bold text-white shadow-md transition"
          >
            <IconPlus size={18} /> Tambah Artikel
          </button>
        </div>
      </div>

      {/* 3 Kartu Statistik */}
      <div className="mt-6">
        <PostStats
          stats={stats}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />
      </div>

      {/* Tabel / List Manajemen Artikel Full Width */}
      <div className="mt-8 overflow-visible rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Daftar Artikel Saya ({filteredPosts.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-slate-600 dark:text-slate-300">
            Memuat data artikel penulis...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-base font-bold text-slate-700 dark:text-slate-200">
              Belum ada artikel pada kategori status ini
            </p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              Klik tombol &quot;Tambah Artikel&quot; atau &quot;AI Generator&quot; untuk mulai membuat artikel.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-bold uppercase text-slate-700 dark:text-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Judul & Ringkasan</th>
                  <th className="px-4 py-3.5">Kategori</th>
                  <th className="px-4 py-3.5">Waktu Baca</th>
                  <th className="px-4 py-3.5">Status Publikasi</th>
                  <th className="px-4 py-3.5">Tanggal</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredPosts.map((post) => {
                  const readingTime = post.reading_time ?? post.reading_minutes ?? 1
                  const isMenuOpen = openMenuId === post.id
                  return (
                    <tr key={post.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {post.title}
                        </div>
                        <div className="mt-0.5 line-clamp-1 text-xs text-slate-600 dark:text-slate-300">
                          {post.excerpt}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-blue-50 dark:bg-blue-950 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-300">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-600 dark:text-slate-300">
                        <span className="inline-flex items-center gap-1">
                          <IconClock size={14} /> {readingTime} mnt
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(post)}
                          aria-label={`Toggle status ${post.title}`}
                          className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold transition ${
                            post.is_published
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              post.is_published ? 'bg-emerald-600' : 'bg-amber-600'
                            }`}
                          />
                          {post.is_published ? 'Terbit' : 'Draf'}
                        </button>
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-600 dark:text-slate-300">
                        {formatDate(post.published_at || post.created_at)}
                      </td>
                      <td className="relative px-6 py-4 text-right">
                        <button
                          type="button"
                          aria-label={`Menu aksi ${post.title}`}
                          onClick={() => setOpenMenuId(isMenuOpen ? null : post.id)}
                          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          <IconDotsVertical size={18} />
                        </button>

                        {isMenuOpen && (
                          <div className="absolute right-6 top-12 z-30 w-44 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-1.5 shadow-xl text-left">
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null)
                                onNavigate(`/posts/${post.slug}`)
                              }}
                              className="flex w-full items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                              <IconEye size={15} /> Lihat Detail
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(post)}
                              className="flex w-full items-center gap-2 px-4 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700"
                            >
                              <IconEdit size={15} /> Ubah Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePost(post)}
                              className="flex w-full items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700"
                            >
                              <IconTrash size={15} /> Hapus
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <PostModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingPost(null)
        }}
        onSave={handleSavePost}
        initialData={editingPost}
        isDark={isDark}
      />

      <AiPostGeneratorModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onApplyDraft={handleApplyAiDraft}
        isDark={isDark}
      />
    </div>
  )
}
