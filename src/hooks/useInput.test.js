import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useInput from './useInput'

describe('useInput', () => {
  it('handles text input, checkbox input, direct value, and reset', () => {
    const { result } = renderHook(() => useInput('awal'))
    expect(result.current[0]).toBe('awal')

    act(() => {
      result.current[1]({ target: { type: 'text', value: 'baru' } })
    })
    expect(result.current[0]).toBe('baru')

    act(() => {
      result.current[1]({ target: { type: 'checkbox', checked: true } })
    })
    expect(result.current[0]).toBe(true)

    act(() => {
      result.current[1]('langsung')
    })
    expect(result.current[0]).toBe('langsung')

    act(() => {
      result.current[3]()
    })
    expect(result.current[0]).toBe('awal')
  })

  it('uses default empty string when no initial value is provided', () => {
    const { result } = renderHook(() => useInput())
    expect(result.current[0]).toBe('')
  })
})
