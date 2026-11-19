import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AiPostGeneratorModal from './AiPostGeneratorModal'
import * as blogApi from '../api/blogApi'
import * as toolsHelper from '../../../helpers/toolsHelper'

vi.mock('../../../components/MarkdownViewer', () => ({
  default: ({ content }) => <div data-testid="mock-ai-viewer">{content}</div>,
}))

describe('AiPostGeneratorModal', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.spyOn(toolsHelper, 'showErrorAlert').mockResolvedValue({})
    vi.spyOn(toolsHelper, 'showSuccessAlert').mockResolvedValue({})
  })

  it('returns null when closed, validates empty topic, generates AI draft with search sources, and applies draft', async () => {
    const onClose = vi.fn()
    const onApplyDraft = vi.fn()

    const { rerender } = render(
      <AiPostGeneratorModal isOpen={false} onClose={onClose} onApplyDraft={onApplyDraft} />
    )
    expect(screen.queryByRole('dialog')).toBeNull()

    rerender(
      <AiPostGeneratorModal
        isOpen={true}
        onClose={onClose}
        onApplyDraft={onApplyDraft}
        isDark={true}
      />
    )

    // Empty topic submit
    fireEvent.click(screen.getByText(/Generate Artikel dengan AI/i))
    await waitFor(() => {
      expect(toolsHelper.showErrorAlert).toHaveBeenCalled()
    })

    // API failure
    vi.spyOn(blogApi, 'generateAiPost').mockRejectedValueOnce(new Error('AI timeout'))
    fireEvent.change(document.getElementById('ai-topic'), {
      target: { value: 'Golang Clean Architecture' },
    })
    fireEvent.change(document.getElementById('ai-category'), {
      target: { value: 'Pendidikan' },
    })
    fireEvent.click(document.getElementById('ai-web-search'))
    fireEvent.click(screen.getByText(/Generate Artikel dengan AI/i))

    await waitFor(() => {
      expect(toolsHelper.showErrorAlert).toHaveBeenCalledWith('AI timeout')
    })

    // API success with sources (one with title+snippet, one with only url)
    vi.spyOn(blogApi, 'generateAiPost').mockResolvedValueOnce({
      data: {
        title: 'Panduan Clean Architecture di Go',
        category: '',
        excerpt: '',
        content: '## Pendahuluan\nKonten AI',
        search_sources: [
          { title: 'Go Docs', url: 'https://go.dev', snippet: 'Official docs' },
          { title: '', url: 'https://gin-gonic.com', snippet: '' },
        ],
      },
    })

    fireEvent.click(screen.getByText(/Generate Artikel dengan AI/i))
    await waitFor(() => {
      expect(screen.getByText('Panduan Clean Architecture di Go')).toBeInTheDocument()
      expect(screen.getByText('Go Docs')).toBeInTheDocument()
      expect(screen.getByText('https://gin-gonic.com')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText(/Simpan & Terapkan ke Editor/i))
    expect(onApplyDraft).toHaveBeenCalledWith({
      title: 'Panduan Clean Architecture di Go',
      category: 'Pendidikan',
      excerpt: '',
      content: '## Pendahuluan\nKonten AI',
      is_published: false,
    })

    // Second generation with excerpt and no sources in light theme
    rerender(
      <AiPostGeneratorModal
        isOpen={true}
        onClose={onClose}
        onApplyDraft={onApplyDraft}
        isDark={false}
      />
    )
    vi.spyOn(blogApi, 'generateAiPost').mockResolvedValueOnce({
      data: {
        title: 'Judul Kedua',
        category: 'Teknologi',
        excerpt: 'Ringkasan kedua',
        content: 'Isi kedua',
      },
    })
    fireEvent.click(screen.getByText(/Generate Artikel dengan AI/i))
    await waitFor(() => {
      expect(screen.getByText('Ringkasan kedua')).toBeInTheDocument()
    })
  })
})
