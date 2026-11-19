import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PostModal from './PostModal'
import * as toolsHelper from '../../../helpers/toolsHelper'

vi.mock('../../../components/MarkdownEditor', () => ({
  default: ({ value, onChange, theme }) => (
    <textarea
      data-testid="mock-md-editor"
      data-theme={theme}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}))

describe('PostModal', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.spyOn(toolsHelper, 'showErrorAlert').mockResolvedValue({})
  })

  it('returns null when closed, validates empty fields, and submits create & edit data', async () => {
    const onClose = vi.fn()
    const onSave = vi.fn().mockResolvedValue()

    const { rerender } = render(<PostModal isOpen={false} onClose={onClose} onSave={onSave} />)
    expect(screen.queryByRole('dialog')).toBeNull()

    // Open in create mode
    rerender(<PostModal isOpen={true} onClose={onClose} onSave={onSave} isDark={true} />)
    expect(screen.getByText('Tulis Artikel Baru')).toBeInTheDocument()

    // Empty submit -> error alert
    fireEvent.click(screen.getByText('Simpan'))
    await waitFor(() => {
      expect(toolsHelper.showErrorAlert).toHaveBeenCalled()
    })

    // Fill all fields
    fireEvent.change(document.getElementById('post-title'), {
      target: { value: 'Judul Baru' },
    })
    fireEvent.change(document.getElementById('post-category'), {
      target: { value: 'Pendidikan' },
    })
    fireEvent.change(document.getElementById('post-excerpt'), {
      target: { value: 'Ringkasan' },
    })
    fireEvent.change(document.getElementById('post-cover'), {
      target: { value: 'https://example.com/c.jpg' },
    })
    fireEvent.click(document.getElementById('post-published'))
    fireEvent.change(screen.getByTestId('mock-md-editor'), {
      target: { value: '# Isi Markdown' },
    })

    fireEvent.click(screen.getByText('Simpan'))
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        title: 'Judul Baru',
        category: 'Pendidikan',
        excerpt: 'Ringkasan',
        cover_image_path: 'https://example.com/c.jpg',
        content: '# Isi Markdown',
        is_published: true,
      })
    })

    // Open in edit mode
    rerender(
      <PostModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        initialData={{
          id: 9,
          title: 'Artikel Lama',
          category: 'Bisnis',
          excerpt: 'Exc',
          cover_image_path: 'https://img',
          content: 'Konten lama',
          is_published: true,
        }}
      />
    )
    expect(screen.getByText('Ubah Artikel Blog')).toBeInTheDocument()
    expect(document.getElementById('post-title').value).toBe('Artikel Lama')
  })
})
