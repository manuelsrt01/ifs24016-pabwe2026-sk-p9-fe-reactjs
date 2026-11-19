import { useState, useEffect, useCallback } from 'react'

const THEME_KEY = 'delcom_blog_theme'
const ACCENT_KEY = 'delcom_blog_accent'

export function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'light')
  const [accent, setAccentState] = useState(() => localStorage.getItem(ACCENT_KEY) || 'blue')

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  useEffect(() => {
    localStorage.setItem(ACCENT_KEY, accent)
    document.documentElement.setAttribute('data-accent', accent)
  }, [accent])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const setAccent = useCallback((color) => {
    setAccentState(color)
  }, [])

  return {
    theme,
    isDark: theme === 'dark',
    accent,
    toggleTheme,
    setAccent,
  }
}

export default useTheme
