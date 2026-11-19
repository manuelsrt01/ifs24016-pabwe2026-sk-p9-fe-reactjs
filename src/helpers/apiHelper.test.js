import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getToken,
  setToken,
  getStoredUser,
  setStoredUser,
  clearSession,
  apiRequest,
} from './apiHelper'

describe('apiHelper', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('manages token and stored user in localStorage', () => {
    expect(getToken()).toBeNull()
    setToken('jwt-123')
    expect(getToken()).toBe('jwt-123')
    setToken('')
    expect(getToken()).toBeNull()

    expect(getStoredUser()).toBeNull()
    setStoredUser({ id: 1, username: 'budi' })
    expect(getStoredUser()).toEqual({ id: 1, username: 'budi' })
    setStoredUser(null)
    expect(getStoredUser()).toBeNull()

    localStorage.setItem('delcom_blog_user', '{invalid-json')
    expect(getStoredUser()).toBeNull()

    setToken('abc')
    setStoredUser({ id: 2 })
    clearSession()
    expect(getToken()).toBeNull()
    expect(getStoredUser()).toBeNull()
  })

  it('performs GET and POST apiRequest with Authorization header', async () => {
    setToken('my-secret-token')
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'success', message: 'OK', data: { id: 10 } }),
    })

    const res = await apiRequest('/api/posts', {
      method: 'POST',
      body: { title: 'Hello' },
    })

    expect(res.data.id).toBe(10)
    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/posts',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer my-secret-token',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ title: 'Hello' }),
      })
    )
  })

  it('throws error on non-ok response or status fail/error or invalid json', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ status: 'fail', message: 'Kredensial salah' }),
    })
    await expect(apiRequest('/api/auth/login')).rejects.toThrow('Kredensial salah')

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => {
        throw new Error('bad json')
      },
    })
    await expect(apiRequest('/api/error')).rejects.toThrow('Terjadi kesalahan pada server')
  })
})
