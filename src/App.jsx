import { useState, useEffect, useCallback } from 'react'
import {
  getStoredUser,
  setStoredUser,
  setToken,
  clearSession,
} from './helpers/apiHelper'
import { logoutUser } from './features/auth/api/authApi'
import { useTheme } from './hooks/useTheme'
import StickyNavbar from './features/blog/components/StickyNavbar'
import PublicArticleList from './features/blog/components/PublicArticleList'
import PublicArticleDetail from './features/blog/components/PublicArticleDetail'
import AuthorDashboard from './features/blog/components/AuthorDashboard'
import AdminDashboard from './features/admin/components/AdminDashboard'
import AuthPage from './features/auth/components/AuthPage'
import AuthModal from './features/auth/modals/AuthModal'

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname)
  const [user, setUser] = useState(() => getStoredUser())
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()

  const navigate = useCallback((path) => {
    window.history.pushState({}, '', path)
    setCurrentPath(path)
  }, [])

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleAuthSuccess = (authData) => {
    setToken(authData.token)
    setStoredUser(authData.user)
    setUser(authData.user)
    if (authData.user.role === 'admin') {
      navigate('/admin')
    } else {
      navigate('/author')
    }
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch {
      // Ignore server logout error when clearing local session
    }
    clearSession()
    setUser(null)
    navigate('/')
  }

  const renderPage = () => {
    if (currentPath === '/login') {
      return (
        <AuthPage
          mode="login"
          onAuthSuccess={handleAuthSuccess}
          onNavigate={navigate}
        />
      )
    }

    if (currentPath === '/register') {
      return (
        <AuthPage
          mode="register"
          onAuthSuccess={handleAuthSuccess}
          onNavigate={navigate}
        />
      )
    }

    if (currentPath.startsWith('/posts/')) {
      const slug = currentPath.replace('/posts/', '')
      return (
        <PublicArticleDetail
          slug={slug}
          onNavigate={navigate}
          isDark={isDark}
        />
      )
    }

    if (currentPath === '/author') {
      if (!user) {
        return (
          <AuthPage
            mode="login"
            onAuthSuccess={handleAuthSuccess}
            onNavigate={navigate}
          />
        )
      }
      return (
        <AuthorDashboard
          user={user}
          onNavigate={navigate}
          isDark={isDark}
        />
      )
    }

    if (currentPath === '/admin') {
      if (!user) {
        return (
          <AuthPage
            mode="login"
            onAuthSuccess={handleAuthSuccess}
            onNavigate={navigate}
          />
        )
      }
      if (user.role !== 'admin') {
        return (
          <AuthorDashboard
            user={user}
            onNavigate={navigate}
            isDark={isDark}
          />
        )
      }
      return <AdminDashboard onNavigate={navigate} />
    }

    return <PublicArticleList user={user} onNavigate={navigate} />
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <StickyNavbar
        user={user}
        currentPath={currentPath}
        onNavigate={navigate}
        onLogout={handleLogout}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1">{renderPage()}</main>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  )
}
