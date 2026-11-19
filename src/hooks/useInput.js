import { useState, useCallback } from 'react'

export function useInput(initialValue = '') {
  const [value, setValue] = useState(initialValue)

  const handleChange = useCallback((e) => {
    if (e && e.target !== undefined) {
      const { type, checked, value: targetVal } = e.target
      setValue(type === 'checkbox' ? checked : targetVal)
    } else {
      setValue(e)
    }
  }, [])

  const reset = useCallback(() => {
    setValue(initialValue)
  }, [initialValue])

  return [value, handleChange, setValue, reset]
}

export default useInput
