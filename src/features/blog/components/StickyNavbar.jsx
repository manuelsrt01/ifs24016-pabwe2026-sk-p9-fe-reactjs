import { useState } from 'react'
import {
  IconBook2,
  IconLogin,
  IconUserPlus,
  IconLogout,
  IconLayoutDashboard,
  IconShieldCheck,
  IconSun,
  IconMoon,
  IconMenu2,
  IconX,
} from '@tabler/icons-react'

export default function StickyNavbar({
  user,
  currentPath = '/',
  onNavigate,
  onLogout,
  onOpenAuthModal,
  isDark = false,
  onToggleTheme,
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const go = (path) => {
    setMobileOpen(false)
    onNavigate(path)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => go('/')}
            className="flex items-center gap-2.5 text-left font-bold text-xl text-blue-600 dark:text-blue-400"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <IconBook2 size={20} />
            </span>
            <span>Delcom Blog</span>
          </button>

          <nav className="hidden md:flex items-center gap-1" aria-label="Navigasi Utama">
            <button
              type="button"
              onClick={() => go('/')}
              className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition ${
                currentPath === '/' || currentPath === '/public'
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              Galeri Publik
            </button>

            {user && (
              <button
                type="button"
                onClick={() => go('/author')}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition ${
                  currentPath === '/author'
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <IconLayoutDashboard size={17} /> Workspace Penulis
              </button>
            )}

            {user && user.role === 'admin' && (
              <button
                type="button"
                onClick={() => go('/admin')}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition ${
                  currentPath === '/admin'
                    ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <IconShieldCheck size={17} /> Admin Panel
              </button>
            )}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label="Toggle Tema"
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {isDark ? <IconSun size={20} /> : <IconMoon size={20} />}
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                @{user.username} ({user.role})
              </span>
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100"
              >
                <IconLogout size={16} /> Keluar
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {onOpenAuthModal && (
                <button
                  type="button"
                  onClick={onOpenAuthModal}
                  className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Popup Login
                </button>
              )}
              <button
                type="button"
                onClick={() => go('/login')}
                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <IconLogin size={17} /> Login
              </button>
              <button
                type="button"
                onClick={() => go('/register')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm"
              >
                <IconUserPlus size={17} /> Register
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle Menu Mobile"
          className="md:hidden rounded-xl p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {mobileOpen ? <IconX size={22} /> : <IconMenu2 size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-2">
          <button
            type="button"
            onClick={() => go('/')}
            className="block w-full text-left rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Galeri Publik
          </button>
          {user ? (
            <>
              <button
                type="button"
                onClick={() => go('/author')}
                className="block w-full text-left rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Workspace Penulis
              </button>
              {user.role === 'admin' && (
                <button
                  type="button"
                  onClick={() => go('/admin')}
                  className="block w-full text-left rounded-xl px-3 py-2 text-sm font-semibold text-amber-600 hover:bg-amber-50"
                >
                  Admin Panel
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false)
                  onLogout()
                }}
                className="block w-full text-left rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
              >
                Keluar (@{user.username})
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => go('/login')}
                className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 py-2 text-center text-sm font-semibold"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => go('/register')}
                className="flex-1 rounded-xl bg-blue-600 py-2 text-center text-sm font-semibold text-white"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
