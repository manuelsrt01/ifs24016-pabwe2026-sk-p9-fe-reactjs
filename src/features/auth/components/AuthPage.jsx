import { useState } from 'react'
import { IconLogin, IconUserPlus, IconArrowLeft } from '@tabler/icons-react'
import { useInput } from '../../../hooks/useInput'
import { loginUser, registerUser } from '../api/authApi'
import { showErrorAlert, showSuccessAlert } from '../../../helpers/toolsHelper'

export default function AuthPage({ mode = 'login', onAuthSuccess, onNavigate }) {
  const isRegister = mode === 'register'
  const [username, onUsernameChange] = useInput('')
  const [email, onEmailChange] = useInput('')
  const [password, onPasswordChange] = useInput('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password.trim() || (isRegister && !email.trim())) {
      await showErrorAlert('Harap lengkapi seluruh kolom yang wajib diisi.')
      return
    }

    setLoading(true)
    try {
      if (isRegister) {
        await registerUser({
          username: username.trim(),
          email: email.trim(),
          password,
        })
        await showSuccessAlert('Registrasi berhasil! Silakan masuk dengan akun Anda.')
        onNavigate('/login')
      } else {
        const res = await loginUser({
          username: username.trim(),
          password,
        })
        await showSuccessAlert(res.message || 'Login berhasil!')
        onAuthSuccess(res.data)
      }
    } catch (err) {
      await showErrorAlert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600"
        >
          <IconArrowLeft size={18} /> Kembali ke Beranda Publik
        </button>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {isRegister ? 'Daftar Akun Penulis' : 'Masuk ke Delcom Blog'}
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {isRegister
            ? 'Mulai tulis dan publikasikan artikel berkualitas Anda.'
            : 'Kelola artikel dan gunakan AI Blog Generator.'}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="login-username" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Username
            </label>
            <input
              id="login-username"
              type="text"
              value={username}
              onChange={onUsernameChange}
              placeholder="Masukkan username"
              className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm outline-none focus:border-blue-600"
            />
          </div>

          {isRegister && (
            <div>
              <label htmlFor="register-email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Email
              </label>
              <input
                id="register-email"
                type="email"
                value={email}
                onChange={onEmailChange}
                placeholder="penulis@delcom.org"
                className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm outline-none focus:border-blue-600"
              />
            </div>
          )}

          <div>
            <label htmlFor="login-password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={onPasswordChange}
              placeholder="Masukkan password"
              className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm outline-none focus:border-blue-600"
            />
          </div>

          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-md transition disabled:opacity-60"
          >
            {isRegister ? <IconUserPlus size={18} /> : <IconLogin size={18} />}
            {loading ? 'Memproses...' : isRegister ? 'Daftar Sekarang' : 'Masuk'}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-4 text-center text-sm text-slate-600 dark:text-slate-400">
          {isRegister ? (
            <>
              Sudah memiliki akun?{' '}
              <button
                type="button"
                onClick={() => onNavigate('/login')}
                className="font-semibold text-blue-600 hover:underline"
              >
                Masuk di sini
              </button>
            </>
          ) : (
            <>
              Belum punya akun penulis?{' '}
              <button
                type="button"
                onClick={() => onNavigate('/register')}
                className="font-semibold text-blue-600 hover:underline"
              >
                Daftar Akun Baru
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
