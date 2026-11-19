import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PublicArticleList from './PublicArticleList'
import * as blogApi from '../api/blogApi'

describe('PublicArticleList', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders categories, posts with and without cover, search, category filter, and user CTA', async () => {
    const onNavigate = vi.fn()
    vi.spyOn(blogApi, 'fetchCategories').mockResolvedValue({
      data: ['Teknologi', 'Pendidikan'],
    })
    vi.spyOn(blogApi, 'fetchPublicPosts').mockResolvedValue({
      data: [
        {
          id: 1,
          title: 'Artikel Satu',
          slug: 'artikel-satu',
          category: 'Teknologi',
          excerpt: 'Ringkasan 1',
          cover_image_path: 'https://example.com/img.png',
          reading_time: 4,
          author: { username: 'budi' },
          published_at: '2026-11-19T00:00:00Z',
        },
        {
          id: 2,
          title: 'Artikel Dua',
          slug: 'artikel-dua',
          category: '',
          excerpt: 'Ringkasan 2',
          cover_image_path: '',
          reading_minutes: 2,
          created_at: '2026-11-19T00:00:00Z',
        },
        {
          id: 3,
          title: 'Artikel Tiga',
          slug: 'artikel-tiga',
          category: 'Pendidikan',
          excerpt: 'Ringkasan 3',
        },
      ],
    })

    const { rerender } = render(<PublicArticleList user={null} onNavigate={onNavigate} />)

    await waitFor(() => {
      expect(screen.getByText('Artikel Satu')).toBeInTheDocument()
      expect(screen.getByText('Artikel Dua')).toBeInTheDocument()
    })

    // Click title & Baca button
    fireEvent.click(screen.getByText('Artikel Satu'))
    expect(onNavigate).toHaveBeenCalledWith('/posts/artikel-satu')

    const bacaBtns = screen.getAllByRole('button', { name: /Baca/i })
    fireEvent.click(bacaBtns[0])
    expect(onNavigate).toHaveBeenCalledTimes(2)

    // Guest hero buttons
    fireEvent.click(screen.getByText('Masuk Penulis'))
    expect(onNavigate).toHaveBeenCalledWith('/login')

    fireEvent.click(screen.getByText('Daftar Akun Baru'))
    expect(onNavigate).toHaveBeenCalledWith('/register')

    // Category filter click
    fireEvent.click(screen.getByRole('button', { name: 'Teknologi' }))
    await waitFor(() => {
      expect(blogApi.fetchPublicPosts).toHaveBeenCalledWith({
        q: '',
        category: 'Teknologi',
      })
    })

    // Search input change
    fireEvent.change(screen.getByLabelText('Cari artikel'), {
      target: { value: 'golang' },
    })
    await waitFor(() => {
      expect(blogApi.fetchPublicPosts).toHaveBeenCalledWith({
        q: 'golang',
        category: 'Teknologi',
      })
    })

    // Rerender with logged-in member and admin
    rerender(
      <PublicArticleList
        user={{ id: 2, username: 'member', role: 'member' }}
        onNavigate={onNavigate}
      />
    )
    fireEvent.click(screen.getByText(/Buka Workspace/i))
    expect(onNavigate).toHaveBeenCalledWith('/author')

    rerender(
      <PublicArticleList
        user={{ id: 1, username: 'admin', role: 'admin' }}
        onNavigate={onNavigate}
      />
    )
    fireEvent.click(screen.getByText(/Buka Workspace/i))
    expect(onNavigate).toHaveBeenCalledWith('/admin')
  })

  it('handles empty state, API error, and categories already containing Semua', async () => {
    vi.spyOn(blogApi, 'fetchCategories').mockResolvedValueOnce({
      data: ['Semua', 'Opini'],
    })
    vi.spyOn(blogApi, 'fetchPublicPosts').mockResolvedValueOnce({
      data: null,
    })

    const { unmount } = render(<PublicArticleList user={null} onNavigate={vi.fn()} />)
    await waitFor(() => {
      expect(screen.getByText(/Belum ada artikel yang ditemukan/i)).toBeInTheDocument()
    })
    unmount()

    vi.spyOn(blogApi, 'fetchCategories').mockRejectedValueOnce(new Error('cat fail'))
    vi.spyOn(blogApi, 'fetchPublicPosts').mockRejectedValueOnce(new Error('Gagal memuat publik'))

    render(<PublicArticleList user={null} onNavigate={vi.fn()} />)
    await waitFor(() => {
      expect(screen.getByText('Gagal memuat publik')).toBeInTheDocument()
    })
  })
})
