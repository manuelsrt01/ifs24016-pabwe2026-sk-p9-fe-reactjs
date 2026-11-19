import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import App from './App'
import * as authApi from './features/auth/api/authApi'
import * as blogApi from './features/blog/api/blogApi'
import * as adminApi from './features/admin/api/adminApi'
import * as apiHelper from './helpers/apiHelper'
import * as toolsHelper from './helpers/toolsHelper'

vi.mock('./components/MarkdownViewer', () => ({
  default: ({ content }) => <div>{content}</div>,
}))

vi.mock('./components/MarkdownEditor', () => ({
  default: () => <div />,
}))

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
    window.history.pushState({}, '', '/')
    vi.spyOn(toolsHelper, 'showSuccessAlert').mockResolvedValue({})
    vi.spyOn(toolsHelper, 'showErrorAlert').mockResolvedValue({})
    vi.spyOn(blogApi, 'fetchCategories').mockResolvedValue({ data: ['Teknologi'] })
    vi.spyOn(blogApi, 'fetchPublicPosts').mockResolvedValue({ data: [] })
    vi.spyOn(blogApi, 'fetchPublicPostBySlug').mockResolvedValue({
      data: { id: 1, title: 'Slug Post', slug: 'slug-post', category: 'Umum', content: 'Hi' },
    })
    vi.spyOn(blogApi, 'fetchAuthorPosts').mockResolvedValue({ data: [] })
    vi.spyOn(blogApi, 'fetchAuthorStats').mockResolvedValue({ data: {} })
    vi.spyOn(adminApi, 'fetchAdminUsers').mockResolvedValue({ data: [] })
    vi.spyOn(adminApi, 'fetchAdminPosts').mockResolvedValue({ data: [] })
  })

  it('handles SPA routing, auth guards, login/logout, popstate, and auth modal', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText(/Eksplorasi Gagasan/i)).toBeInTheDocument()
    })

    // Navigate to /login & /register
    fireEvent.click(screen.getByText('Login'))
    expect(screen.getByText('Masuk ke Delcom Blog')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Register'))
    expect(screen.getByText('Daftar Akun Penulis')).toBeInTheDocument()

    // Popstate to /posts/slug-post
    act(() => {
      window.history.pushState({}, '', '/posts/slug-post')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    await waitFor(() => {
      expect(screen.getByText('Slug Post')).toBeInTheDocument()
    })

    // Popstate to /author while unauthenticated -> shows login page
    act(() => {
      window.history.pushState({}, '', '/author')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    expect(screen.getByText('Masuk ke Delcom Blog')).toBeInTheDocument()

    // Popstate to /admin while unauthenticated -> shows login page
    act(() => {
      window.history.pushState({}, '', '/admin')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    expect(screen.getByText('Masuk ke Delcom Blog')).toBeInTheDocument()

    // Open Popup Login modal, close it, open again and login as member
    fireEvent.click(screen.getByText('Popup Login'))
    expect(screen.getByText('Login Cepat Penulis')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Tutup Modal'))

    vi.spyOn(authApi, 'loginUser').mockResolvedValueOnce({
      message: 'OK',
      data: {
        token: 'member-token',
        user: { id: 2, username: 'budi', role: 'member' },
      },
    })

    fireEvent.change(document.getElementById('login-username'), { target: { value: 'budi' } })
    fireEvent.change(document.getElementById('login-password'), { target: { value: '123' } })
    fireEvent.click(document.getElementById('login-submit'))

    await waitFor(() => {
      expect(screen.getByText(/Workspace Penulis \(@budi\)/i)).toBeInTheDocument()
    })

    // Member trying to visit /admin is redirected to AuthorDashboard
    act(() => {
      window.history.pushState({}, '', '/admin')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    await waitFor(() => {
      expect(screen.getByText(/Workspace Penulis \(@budi\)/i)).toBeInTheDocument()
    })

    // Logout when API succeeds
    vi.spyOn(authApi, 'logoutUser').mockResolvedValueOnce({ status: 'success' })
    fireEvent.click(screen.getByText(/Keluar/i))
    await waitFor(() => {
      expect(apiHelper.getToken()).toBeNull()
    })

    // Login as admin -> navigates to /admin
    fireEvent.click(screen.getByText('Login'))
    vi.spyOn(authApi, 'loginUser').mockResolvedValueOnce({
      message: 'OK',
      data: {
        token: 'admin-token',
        user: { id: 1, username: 'admin', role: 'admin' },
      },
    })
    fireEvent.change(document.getElementById('login-username'), { target: { value: 'admin' } })
    fireEvent.change(document.getElementById('login-password'), { target: { value: 'admin' } })
    fireEvent.click(document.getElementById('login-submit'))

    await waitFor(() => {
      expect(
        screen.getByText(/Admin Dashboard — Monitoring Sistem Delcom Blog/i)
      ).toBeInTheDocument()
    })

    // Logout when API throws error still clears session
    vi.spyOn(authApi, 'logoutUser').mockRejectedValueOnce(new Error('network err'))
    fireEvent.click(screen.getByText(/Keluar/i))
    await waitFor(() => {
      expect(apiHelper.getToken()).toBeNull()
    })
  })
})
