import { useState } from 'react'
import { IconX, IconLogin } from '@tabler/icons-react'
import { useInput } from '../../../hooks/useInput'
import { loginUser } from '../api/authApi'
import { showErrorAlert, showSuccessAlert } from '../../../helpers/toolsHelper'

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [username, onUsernameChange, , resetUsername] = useInput('')
  const [password, onPasswordChange, , resetPassword] = useInput('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      await showErrorAlert('Username dan password wajib diisi.')
      return
    }

    setLoading(true)
    try {
      const res = await loginUser({
        username: username.trim(),
        password,
      })
      resetUsername()
      resetPassword()
      await showSuccessAlert(res.message || 'Login berhasil!')
      onAuthSuccess(res.data)
      onClose()
    } catch (err) {
      await showErrorAlert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between bg-blue-600 px-6 py-4 text-white">
          <h2 className="text-lg font-bold">Login Cepat Penulis</h2>
          <button type="button" onClick={onClose} aria-label="Tutup Modal" className="rounded-lg p-1 hover:bg-white/20">
            <IconX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="login-username" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Username
            </label>
            <input
              id="login-username"
              type="text"
              value={username}
              onChange={onUsernameChange}
              placeholder="Username Anda"
              className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={onPasswordChange}
              placeholder="Password Anda"
              className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Batal
            </button>
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2 text-sm font-semibold text-white"
            >
              <IconLogin size={18} />
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
