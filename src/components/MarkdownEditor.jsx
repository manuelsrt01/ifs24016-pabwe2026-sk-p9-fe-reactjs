import { useEffect, useRef } from 'react'

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
  const valueRef = useRef(value)
  onChangeRef.current = onChange
  valueRef.current = value

  useEffect(() => {
    let cancelled = false
    let instance = null

    Promise.all([
      import('@toast-ui/editor'),
      import('@toast-ui/editor/dist/toastui-editor.css'),
    ]).then(([{ default: Editor }]) => {
      if (cancelled) return
      instance = new Editor({
        el: containerRef.current,
        height,
        initialEditType: 'markdown',
        previewStyle: 'vertical',
        initialValue: valueRef.current,
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
    })

    return () => {
      cancelled = true
      if (instance) {
        instance.destroy()
      }
      editorRef.current = null
    }
  }, [height, placeholder, theme])

  useEffect(() => {
    if (editorRef.current && value !== undefined && editorRef.current.getMarkdown() !== value) {
      editorRef.current.setMarkdown(value)
    }
  }, [value])

  return <div ref={containerRef} data-testid="markdown-editor" className="w-full" />
}
