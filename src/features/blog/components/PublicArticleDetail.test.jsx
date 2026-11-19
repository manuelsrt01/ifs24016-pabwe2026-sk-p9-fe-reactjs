import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PublicArticleDetail from './PublicArticleDetail'
import * as blogApi from '../api/blogApi'

vi.mock('../../../components/MarkdownViewer', () => ({
  default: ({ content }) => <div data-testid="mock-viewer">{content}</div>,
}))

describe('PublicArticleDetail', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders article detail with cover image, reading time, and back button', async () => {
    const onNavigate = vi.fn()
    vi.spyOn(blogApi, 'fetchPublicPostBySlug').mockResolvedValueOnce({
      data: {
        id: 1,
        title: 'Detail Artikel Go',
        slug: 'detail-artikel-go',
        category: 'Teknologi',
        excerpt: 'Ringkasan detail',
        content: '## Konten Markdown',
        cover_image_path: 'https://example.com/cover.png',
        reading_time: 5,
        author: { username: 'budi' },
        published_at: '2026-11-19T00:00:00Z',
      },
    })

    render(<PublicArticleDetail slug="detail-artikel-go" onNavigate={onNavigate} isDark={true} />)
    expect(screen.getByText(/Memuat artikel/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Detail Artikel Go')).toBeInTheDocument()
      expect(screen.getByText('Ringkasan detail')).toBeInTheDocument()
      expect(screen.getByTestId('mock-viewer')).toHaveTextContent('## Konten Markdown')
    })

    fireEvent.click(screen.getByText(/Kembali ke Galeri Artikel/i))
    expect(onNavigate).toHaveBeenCalledWith('/')
  })

  it('renders article detail with fallback author/reading_minutes and handles error state', async () => {
    const onNavigate = vi.fn()
    vi.spyOn(blogApi, 'fetchPublicPostBySlug').mockResolvedValueOnce({
      data: {
        id: 2,
        title: 'Artikel Tanpa Cover',
        slug: 'tanpa-cover',
        category: 'Umum',
        content: 'Isi',
        reading_minutes: 2,
        created_at: '2026-11-19T00:00:00Z',
      },
    })

    const { unmount } = render(<PublicArticleDetail slug="tanpa-cover" onNavigate={onNavigate} />)
    await waitFor(() => {
      expect(screen.getByText('Artikel Tanpa Cover')).toBeInTheDocument()
      expect(screen.getByText('@Penulis')).toBeInTheDocument()
    })
    unmount()

    // Fallback default readingTime = 1 when neither reading_time nor reading_minutes provided
    vi.spyOn(blogApi, 'fetchPublicPostBySlug').mockResolvedValueOnce({
      data: {
        id: 3,
        title: 'Artikel Default Reading',
        slug: 'def',
        category: 'Umum',
        content: 'Isi',
      },
    })
    const { unmount: unmount2 } = render(<PublicArticleDetail slug="def" onNavigate={onNavigate} />)
    await waitFor(() => {
      expect(screen.getByText(/1 menit baca/i)).toBeInTheDocument()
    })
    unmount2()

    // Error state
    vi.spyOn(blogApi, 'fetchPublicPostBySlug').mockRejectedValueOnce(new Error('404 Not Found'))
    const { unmount: unmount3 } = render(<PublicArticleDetail slug="missing" onNavigate={onNavigate} />)
    await waitFor(() => {
      expect(screen.getByText('404 Not Found')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText(/Kembali ke Galeri/i))
    expect(onNavigate).toHaveBeenCalledWith('/')
    unmount3()

    // Null post data state
    vi.spyOn(blogApi, 'fetchPublicPostBySlug').mockResolvedValueOnce({ data: null })
    render(<PublicArticleDetail slug="null-post" onNavigate={onNavigate} />)
    await waitFor(() => {
      expect(screen.getByText('Artikel tidak ditemukan')).toBeInTheDocument()
    })
  })
})
