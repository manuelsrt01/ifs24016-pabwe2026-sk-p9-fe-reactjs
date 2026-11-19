import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AuthorDashboard from './AuthorDashboard'
import * as blogApi from '../api/blogApi'
import * as toolsHelper from '../../../helpers/toolsHelper'

vi.mock('../modals/PostModal', () => ({
  default: ({ isOpen, onClose, onSave, initialData }) =>
    isOpen ? (
      <div data-testid="mock-post-modal">
        <span>{initialData?.id ? 'EditMode' : 'CreateMode'}</span>
        <button type="button" onClick={() => onSave({ title: 'Saved', content: 'Body' })}>
          TriggerSave
        </button>
        <button type="button" onClick={onClose}>
          ClosePostModal
        </button>
      </div>
    ) : null,
}))

vi.mock('../modals/AiPostGeneratorModal', () => ({
  default: ({ isOpen, onClose, onApplyDraft }) =>
    isOpen ? (
      <div data-testid="mock-ai-modal">
        <button
          type="button"
          onClick={() => onApplyDraft({ title: 'AI Draft', content: 'AI Body' })}
        >
          TriggerApplyAi
        </button>
        <button type="button" onClick={onClose}>
          CloseAiModal
        </button>
      </div>
    ) : null,
}))

describe('AuthorDashboard', () => {
  const samplePosts = [
    {
      id: 1,
      title: 'Artikel Terbit',
      slug: 'artikel-terbit',
      category: 'Teknologi',
      excerpt: 'Exc 1',
      is_published: true,
      reading_time: 3,
      published_at: '2026-11-19T00:00:00Z',
    },
    {
      id: 2,
      title: 'Artikel Draf',
      slug: 'artikel-draf',
      category: 'Opini',
      excerpt: 'Exc 2',
      is_published: false,
      reading_minutes: 2,
      created_at: '2026-11-19T00:00:00Z',
    },
    {
      id: 3,
      title: 'Artikel Ketiga',
      slug: 'artikel-ketiga',
      category: 'Umum',
      excerpt: 'Exc 3',
      is_published: false,
    },
  ]

  beforeEach(() => {
    vi.restoreAllMocks()
    vi.spyOn(toolsHelper, 'showErrorAlert').mockResolvedValue({})
    vi.spyOn(toolsHelper, 'showSuccessAlert').mockResolvedValue({})
    vi.spyOn(toolsHelper, 'showConfirmDialog').mockResolvedValue(true)
  })

  it('loads workspace, filters by status cards, and handles kebab menu actions, toggle publish, create, edit, delete, and AI apply', async () => {
    const onNavigate = vi.fn()
    vi.spyOn(blogApi, 'fetchAuthorPosts').mockResolvedValue({ data: samplePosts })
    vi.spyOn(blogApi, 'fetchAuthorStats').mockResolvedValue({
      data: { total: 3, published: 1, draft: 2 },
    })
    vi.spyOn(blogApi, 'createPost').mockResolvedValue({ status: 'success' })
    vi.spyOn(blogApi, 'updatePost').mockResolvedValue({ status: 'success' })
    vi.spyOn(blogApi, 'togglePublishPost').mockResolvedValue({ status: 'success' })
    vi.spyOn(blogApi, 'deletePost').mockResolvedValue({ status: 'success' })

    render(
      <AuthorDashboard
        user={{ id: 2, username: 'penulis' }}
        onNavigate={onNavigate}
        isDark={false}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Artikel Terbit')).toBeInTheDocument()
      expect(screen.getByText('Artikel Draf')).toBeInTheDocument()
    })

    // Filter by published and draft
    fireEvent.click(screen.getByText('Total Selesai / Terbit'))
    expect(screen.queryByText('Artikel Draf')).toBeNull()

    fireEvent.click(screen.getByText('Belum Selesai / Draf'))
    expect(screen.queryByText('Artikel Terbit')).toBeNull()

    fireEvent.click(screen.getByText('Total Artikel'))
    expect(screen.getByText('Artikel Terbit')).toBeInTheDocument()

    // Toggle publish on published post & draft post
    fireEvent.click(screen.getByLabelText('Toggle status Artikel Terbit'))
    await waitFor(() => {
      expect(blogApi.togglePublishPost).toHaveBeenCalledWith(1)
    })

    fireEvent.click(screen.getByLabelText('Toggle status Artikel Draf'))
    await waitFor(() => {
      expect(blogApi.togglePublishPost).toHaveBeenCalledWith(2)
    })

    // Kebab menu: open, close by clicking again, open and click Lihat Detail
    const menuBtn1 = screen.getByLabelText('Menu aksi Artikel Terbit')
    fireEvent.click(menuBtn1)
    fireEvent.click(menuBtn1)
    fireEvent.click(menuBtn1)
    fireEvent.click(screen.getByText('Lihat Detail'))
    expect(onNavigate).toHaveBeenCalledWith('/posts/artikel-terbit')

    // Kebab menu: Ubah Edit -> save in PostModal
    fireEvent.click(screen.getByLabelText('Menu aksi Artikel Terbit'))
    fireEvent.click(screen.getByText('Ubah Edit'))
    expect(screen.getByText('EditMode')).toBeInTheDocument()
    fireEvent.click(screen.getByText('TriggerSave'))
    await waitFor(() => {
      expect(blogApi.updatePost).toHaveBeenCalledWith(1, {
        title: 'Saved',
        content: 'Body',
      })
    })

    // Create post modal: open, close, open, save
    fireEvent.click(screen.getByText('Tambah Artikel'))
    expect(screen.getByText('CreateMode')).toBeInTheDocument()
    fireEvent.click(screen.getByText('ClosePostModal'))
    fireEvent.click(screen.getByText('Tambah Artikel'))
    fireEvent.click(screen.getByText('TriggerSave'))
    await waitFor(() => {
      expect(blogApi.createPost).toHaveBeenCalledWith({
        title: 'Saved',
        content: 'Body',
      })
    })

    // AI Generator modal: open, close, open, apply draft -> opens PostModal in CreateMode
    fireEvent.click(screen.getByText('AI Generator'))
    fireEvent.click(screen.getByText('CloseAiModal'))
    fireEvent.click(screen.getByText('AI Generator'))
    fireEvent.click(screen.getByText('TriggerApplyAi'))
    expect(screen.getByTestId('mock-post-modal')).toBeInTheDocument()
    fireEvent.click(screen.getByText('ClosePostModal'))

    // Delete post: cancelled first, then confirmed
    toolsHelper.showConfirmDialog.mockResolvedValueOnce(false)
    fireEvent.click(screen.getByLabelText('Menu aksi Artikel Draf'))
    fireEvent.click(screen.getByText('Hapus'))
    await waitFor(() => {
      expect(blogApi.deletePost).not.toHaveBeenCalled()
    })

    toolsHelper.showConfirmDialog.mockResolvedValueOnce(true)
    fireEvent.click(screen.getByLabelText('Menu aksi Artikel Draf'))
    fireEvent.click(screen.getByText('Hapus'))
    await waitFor(() => {
      expect(blogApi.deletePost).toHaveBeenCalledWith(2)
    })
  })

  it('handles empty state and API errors for load, save, toggle, and delete', async () => {
    vi.spyOn(blogApi, 'fetchAuthorPosts').mockRejectedValueOnce(new Error('Load fail'))
    vi.spyOn(blogApi, 'fetchAuthorStats').mockResolvedValueOnce({ data: null })

    const { unmount } = render(<AuthorDashboard user={null} onNavigate={vi.fn()} />)
    await waitFor(() => {
      expect(toolsHelper.showErrorAlert).toHaveBeenCalledWith('Load fail')
    })
    unmount()

    vi.spyOn(blogApi, 'fetchAuthorPosts').mockResolvedValue({ data: null })
    vi.spyOn(blogApi, 'fetchAuthorStats').mockResolvedValue({ data: null })
    const { unmount: unmount2 } = render(<AuthorDashboard user={null} onNavigate={vi.fn()} />)
    await waitFor(() => {
      expect(
        screen.getByText(/Belum ada artikel pada kategori status ini/i)
      ).toBeInTheDocument()
    })
    unmount2()

    // Error branches on create, toggle, delete
    vi.spyOn(blogApi, 'fetchAuthorPosts').mockResolvedValue({ data: samplePosts })
    vi.spyOn(blogApi, 'fetchAuthorStats').mockResolvedValue({ data: {} })
    vi.spyOn(blogApi, 'createPost').mockRejectedValueOnce(new Error('Save fail'))
    vi.spyOn(blogApi, 'togglePublishPost').mockRejectedValueOnce(new Error('Toggle fail'))
    vi.spyOn(blogApi, 'deletePost').mockRejectedValueOnce(new Error('Delete fail'))

    render(<AuthorDashboard user={{ username: 'u' }} onNavigate={vi.fn()} />)
    await waitFor(() => {
      expect(screen.getByText('Artikel Terbit')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Tambah Artikel'))
    fireEvent.click(screen.getByText('TriggerSave'))
    await waitFor(() => {
      expect(toolsHelper.showErrorAlert).toHaveBeenCalledWith('Save fail')
    })

    fireEvent.click(screen.getByLabelText('Toggle status Artikel Terbit'))
    await waitFor(() => {
      expect(toolsHelper.showErrorAlert).toHaveBeenCalledWith('Toggle fail')
    })

    fireEvent.click(screen.getByLabelText('Menu aksi Artikel Terbit'))
    fireEvent.click(screen.getByText('Hapus'))
    await waitFor(() => {
      expect(toolsHelper.showErrorAlert).toHaveBeenCalledWith('Delete fail')
    })
  })
})
