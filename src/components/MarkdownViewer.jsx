import { useEffect, useRef } from 'react'
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer'
import '@toast-ui/editor/dist/toastui-editor-viewer.css'

export default function MarkdownViewer({ content = '', theme = 'light' }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const viewer = new Viewer({
      el: containerRef.current,
      initialValue: content || '',
      theme: theme === 'dark' ? 'dark' : 'default',
    })

    return () => {
      viewer.destroy()
    }
  }, [content, theme])

  return <div ref={containerRef} data-testid="markdown-viewer" className="prose max-w-none dark:prose-invert" />
}
