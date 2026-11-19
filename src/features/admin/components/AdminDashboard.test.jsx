import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AdminDashboard from './AdminDashboard'
import * as adminApi from '../api/adminApi'
import * as toolsHelper from '../../../helpers/toolsHelper'

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.spyOn(toolsHelper, 'showErrorAlert').mockResolvedValue({})
  })

  it('renders users directory, all posts archive, and inspects user posts', async () => {
    const onNavigate = vi.fn()
    vi.spyOn(adminApi, 'fetchAdminUsers').mockResolvedValueOnce({
      data: [
        {
          id: 1,
          username: 'admin',
          email: 'admin@delcom.org',
          role: 'admin',
          total_artikel: 2,
          total_terbit: 1,
        },
        {
          id: 2,
          username: 'budi',
          email: 'budi@delcom.org',
          role: 'member',
          total_posts: 1,
          published_posts: 0,
        },
        {
          id: 3,
          username: 'siti',
          email: 'siti@delcom.org',
          role: 'member',
        },
      ],
    })

    vi.spyOn(adminApi, 'fetchAdminPosts').mockResolvedValueOnce({
      data: [
        {
          id: 10,
          user_id: 1,
          title: 'Post Admin',
          slug: 'post-admin',
          category: 'Teknologi',
          is_published: true,
          author: { username: 'admin' },
          published_at: '2026-11-19T00:00:00Z',
        },
        {
          id: 11,
          user_id: 2,
          title: 'Post Budi',
          slug: 'post-budi',
          category: 'Opini',
          is_published: false,
          created_at: '2026-11-19T00:00:00Z',
        },
      ],
    })

    render(<AdminDashboard onNavigate={onNavigate} />)

    await waitFor(() => {
      expect(screen.getAllByText('@admin').length).toBeGreaterThan(0)
      expect(screen.getByText('Post Admin')).toBeInTheDocument()
      expect(screen.getByText('Post Budi')).toBeInTheDocument()
    })

    // Click Buka on post row
    const bukaBtns = screen.getAllByText('Buka')
    fireEvent.click(bukaBtns[0])
    expect(onNavigate).toHaveBeenCalledWith('/posts/post-admin')

    // Click Lihat Artikel for user 1 (has posts: published and draft)
    vi.spyOn(adminApi, 'fetchAdminUserPosts').mockResolvedValueOnce({
      data: [
        { id: 10, title: 'Post Admin', category: 'Teknologi', is_published: true },
        { id: 12, title: 'Draf Admin', category: 'Umum', is_published: false },
      ],
    })
    const inspectBtns = screen.getAllByText(/Lihat Artikel/i)
    fireEvent.click(inspectBtns[0])

    await waitFor(() => {
      expect(screen.getByText(/Artikel oleh @admin/i)).toBeInTheDocument()
      expect(screen.getByText('Draf Admin')).toBeInTheDocument()
    })

    // Close user posts panel
    fireEvent.click(screen.getByLabelText('Tutup detail artikel pengguna'))
    expect(screen.queryByText(/Artikel oleh @admin/i)).toBeNull()

    // Click Lihat Artikel for user 3 (empty posts / null data)
    vi.spyOn(adminApi, 'fetchAdminUserPosts').mockResolvedValueOnce({ data: null })
    fireEvent.click(inspectBtns[2])
    await waitFor(() => {
      expect(screen.getByText(/Pengguna ini belum menulis artikel/i)).toBeInTheDocument()
    })

    // Error on fetchAdminUserPosts
    vi.spyOn(adminApi, 'fetchAdminUserPosts').mockRejectedValueOnce(new Error('User posts err'))
    fireEvent.click(inspectBtns[1])
    await waitFor(() => {
      expect(toolsHelper.showErrorAlert).toHaveBeenCalledWith('User posts err')
    })
  })

  it('handles initial load error and null data fallback', async () => {
    vi.spyOn(adminApi, 'fetchAdminUsers').mockRejectedValueOnce(new Error('Admin forbidden'))
    vi.spyOn(adminApi, 'fetchAdminPosts').mockResolvedValueOnce({ data: null })

    const { unmount } = render(<AdminDashboard onNavigate={vi.fn()} />)
    await waitFor(() => {
      expect(toolsHelper.showErrorAlert).toHaveBeenCalledWith('Admin forbidden')
    })
    unmount()

    vi.spyOn(adminApi, 'fetchAdminUsers').mockResolvedValueOnce({ data: null })
    vi.spyOn(adminApi, 'fetchAdminPosts').mockResolvedValueOnce({ data: null })
    render(<AdminDashboard onNavigate={vi.fn()} />)
    await waitFor(() => {
      expect(screen.getByText('Direktori Seluruh Pengguna (0)')).toBeInTheDocument()
    })
  })
})
