import { useEffect, useRef } from 'react'

export default function MarkdownViewer({ content = '', theme = 'light' }) {
  const containerRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    let viewer = null

    Promise.all([
      import('@toast-ui/editor/dist/toastui-editor-viewer'),
      import('@toast-ui/editor/dist/toastui-editor-viewer.css'),
    ]).then(([{ default: Viewer }]) => {
      if (!cancelled) {
        viewer = new Viewer({
          el: containerRef.current,
          initialValue: content,
          theme: theme === 'dark' ? 'dark' : 'default',
        })
      }
    })

    return () => {
      cancelled = true
      if (viewer) {
        viewer.destroy()
      }
    }
  }, [content, theme])

  return <div ref={containerRef} data-testid="markdown-viewer" className="prose max-w-none dark:prose-invert" />
}
