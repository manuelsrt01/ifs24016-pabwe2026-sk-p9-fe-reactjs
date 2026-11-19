import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import MarkdownEditor from './MarkdownEditor'
import MarkdownViewer from './MarkdownViewer'

let lastEditorOptions = null
let currentMarkdown = ''

vi.mock('@toast-ui/editor', () => {
  return {
    default: class MockEditor {
      constructor(options) {
        lastEditorOptions = options
        currentMarkdown = options.initialValue || ''
      }
      getMarkdown() {
        return currentMarkdown
      }
      setMarkdown(val) {
        currentMarkdown = val
      }
      destroy() {}
    },
  }
})

vi.mock('@toast-ui/editor/dist/toastui-editor-viewer', () => {
  return {
    default: class MockViewer {
      constructor(options) {
        this.options = options
      }
      destroy() {}
    },
  }
})

describe('MarkdownComponents', () => {
  it('renders MarkdownEditor, handles change events, external value updates, and dark theme', () => {
    const handleChange = vi.fn()
    const { rerender, unmount } = render(
      <MarkdownEditor value="Initial" onChange={handleChange} theme="dark" />
    )
    expect(screen.getByTestId('markdown-editor')).toBeInTheDocument()

    // Trigger editor internal change event
    currentMarkdown = 'Edited content'
    lastEditorOptions.events.change()
    expect(handleChange).toHaveBeenCalledWith('Edited content')

    // Rerender with new external value and light theme
    rerender(<MarkdownEditor value="Updated externally" onChange={handleChange} theme="light" />)
    expect(currentMarkdown).toBe('Updated externally')

    // Rerender with empty value
    rerender(<MarkdownEditor value="" theme="light" />)
    expect(currentMarkdown).toBe('')

    // Trigger change when onChange is not provided
    lastEditorOptions.events.change()

    // Rerender with default props
    rerender(<MarkdownEditor />)
    unmount()
  })

  it('renders MarkdownViewer in light and dark themes', () => {
    const { rerender, unmount } = render(<MarkdownViewer content="# Heading" theme="dark" />)
    expect(screen.getByTestId('markdown-viewer')).toBeInTheDocument()

    rerender(<MarkdownViewer content="" theme="light" />)
    rerender(<MarkdownViewer />)
    unmount()
  })
})
