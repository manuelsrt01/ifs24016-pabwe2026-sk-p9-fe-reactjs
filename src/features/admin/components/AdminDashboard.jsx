import { useState, useEffect, useCallback } from 'react'
import {
  IconUsers,
  IconFiles,
  IconCircleCheck,
  IconEye,
  IconX,
} from '@tabler/icons-react'
import {
  fetchAdminUsers,
  fetchAdminPosts,
  fetchAdminUserPosts,
} from '../api/adminApi'
import { formatDate, showErrorAlert } from '../../../helpers/toolsHelper'

export default function AdminDashboard({ onNavigate }) {
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const loadAdminData = useCallback(async () => {
    setLoading(true)
    try {
      const [usersRes, postsRes] = await Promise.all([
        fetchAdminUsers(),
        fetchAdminPosts(),
      ])
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : [])
      setPosts(Array.isArray(postsRes.data) ? postsRes.data : [])
    } catch (err) {
      await showErrorAlert(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAdminData()
  }, [loadAdminData])

  const handleInspectUserPosts = async (userItem) => {
    try {
      const res = await fetchAdminUserPosts(userItem.id)
      setSelectedUser(userItem)
      setUserPosts(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      await showErrorAlert(err.message)
    }
  }

  const totalPublished = posts.filter((p) => p.is_published).length

  return (
    <div className="w-full max-w-[96vw] mx-auto px-4 py-8 sm:px-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
          Admin Dashboard — Monitoring Sistem Delcom Blog
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Pantau seluruh akun pengguna, statistik kontribusi penulis, dan arsip artikel sistem.
        </p>
      </div>

      {/* Ringkasan Statistik Admin */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50/70 dark:border-blue-900 dark:bg-blue-950/40 p-5">
          <div>
            <p className="text-xs font-bold uppercase text-blue-700 dark:text-blue-300">Total Pengguna</p>
            <p className="mt-1 text-3xl font-extrabold text-blue-900 dark:text-white">{users.length}</p>
          </div>
          <IconUsers size={30} className="text-blue-600" />
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-indigo-200 bg-indigo-50/70 dark:border-indigo-900 dark:bg-indigo-950/40 p-5">
          <div>
            <p className="text-xs font-bold uppercase text-indigo-700 dark:text-indigo-300">Total Seluruh Artikel</p>
            <p className="mt-1 text-3xl font-extrabold text-indigo-900 dark:text-white">{posts.length}</p>
          </div>
          <IconFiles size={30} className="text-indigo-600" />
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/40 p-5">
          <div>
            <p className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-300">Total Artikel Terbit</p>
            <p className="mt-1 text-3xl font-extrabold text-emerald-900 dark:text-white">{totalPublished}</p>
          </div>
          <IconCircleCheck size={30} className="text-emerald-600" />
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center text-sm text-slate-500">
          Memuat data pengawasan admin...
        </div>
      ) : (
        <>
          {/* Tabel Direktori Seluruh Pengguna */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Direktori Seluruh Pengguna ({users.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="px-6 py-3.5">ID</th>
                    <th className="px-4 py-3.5">Username</th>
                    <th className="px-4 py-3.5">Email</th>
                    <th className="px-4 py-3.5">Role</th>
                    <th className="px-4 py-3.5">Total Artikel</th>
                    <th className="px-4 py-3.5">Total Terbit</th>
                    <th className="px-6 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {users.map((u) => {
                    const totalArt = u.total_artikel ?? u.total_posts ?? 0
                    const totalPub = u.total_terbit ?? u.published_posts ?? 0
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                        <td className="px-6 py-3.5 font-mono text-xs font-bold">#{u.id}</td>
                        <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">@{u.username}</td>
                        <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">{u.email}</td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              u.role === 'admin'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-bold">{totalArt}</td>
                        <td className="px-4 py-3.5 font-bold text-emerald-600">{totalPub}</td>
                        <td className="px-6 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleInspectUserPosts(u)}
                            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50"
                          >
                            <IconEye size={14} /> Lihat Artikel
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Panel Artikel Milik Pengguna Tertentu */}
          {selectedUser && (
            <section className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/20 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Artikel oleh @{selectedUser.username} ({userPosts.length})
                </h3>
                <button
                  type="button"
                  aria-label="Tutup detail artikel pengguna"
                  onClick={() => setSelectedUser(null)}
                  className="rounded-lg p-1 text-slate-500 hover:bg-slate-200"
                >
                  <IconX size={18} />
                </button>
              </div>
              {userPosts.length === 0 ? (
                <p className="mt-3 text-xs text-slate-500">Pengguna ini belum menulis artikel.</p>
              ) : (
                <ul className="mt-3 divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                  {userPosts.map((up) => (
                    <li key={up.id} className="flex items-center justify-between py-2">
                      <span className="font-semibold">{up.title}</span>
                      <span className="text-xs text-slate-500">
                        {up.category} · {up.is_published ? 'Terbit' : 'Draf'}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* Tabel Arsip Seluruh Artikel Sistem */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Arsip Seluruh Artikel Sistem ({posts.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="px-6 py-3.5">Judul</th>
                    <th className="px-4 py-3.5">Penulis</th>
                    <th className="px-4 py-3.5">Kategori</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Tanggal</th>
                    <th className="px-6 py-3.5 text-right">Baca</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {posts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="px-6 py-3.5 font-bold text-slate-900 dark:text-white">{p.title}</td>
                      <td className="px-4 py-3.5 text-xs font-semibold">
                        @{p.author?.username || `user-${p.user_id}`}
                      </td>
                      <td className="px-4 py-3.5 text-xs">{p.category}</td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            p.is_published
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {p.is_published ? 'Terbit' : 'Draf'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-500">
                        {formatDate(p.published_at || p.created_at)}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => onNavigate(`/posts/${p.slug}`)}
                          className="text-xs font-bold text-blue-600 hover:underline"
                        >
                          Buka
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
