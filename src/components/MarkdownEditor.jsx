import { useEffect, useRef } from 'react'
import Editor from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'

export default function MarkdownEditor({
  value = '',
  onChange,
  height = '480px',
  placeholder = 'Tulis isi artikel dalam format Markdown...',
  theme = 'light',
}) {
  const containerRef = useRef(null)
  const editorRef = useRef(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    const instance = new Editor({
      el: containerRef.current,
      height,
      initialEditType: 'markdown',
      previewStyle: 'vertical',
      initialValue: value,
      placeholder,
      theme: theme === 'dark' ? 'dark' : 'default',
      usageStatistics: false,
      events: {
        change: () => {
          if (onChangeRef.current) {
            onChangeRef.current(instance.getMarkdown())
          }
        },
      },
    })
    editorRef.current = instance

    return () => {
      instance.destroy()
      editorRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, placeholder, theme])

  useEffect(() => {
    if (editorRef.current && value !== undefined && editorRef.current.getMarkdown() !== value) {
      editorRef.current.setMarkdown(value)
    }
  }, [value])

  return <div ref={containerRef} data-testid="markdown-editor" className="w-full" />
}
