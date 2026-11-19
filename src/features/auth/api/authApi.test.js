import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as apiHelper from '../../../helpers/apiHelper'
import {
  registerUser,
  loginUser,
  logoutUser,
  fetchProfile,
  updateProfile,
} from './authApi'

describe('authApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('calls auth endpoints properly', async () => {
    const spy = vi.spyOn(apiHelper, 'apiRequest').mockResolvedValue({ status: 'success' })

    await registerUser({ username: 'u', email: 'u@a.com', password: '123' })
    expect(spy).toHaveBeenCalledWith('/api/auth/register', {
      method: 'POST',
      body: { username: 'u', email: 'u@a.com', password: '123' },
    })

    await loginUser({ username: 'u', password: '123' })
    expect(spy).toHaveBeenCalledWith('/api/auth/login', {
      method: 'POST',
      body: { username: 'u', password: '123' },
    })

    await logoutUser()
    expect(spy).toHaveBeenCalledWith('/api/auth/logout', { method: 'POST' })

    await fetchProfile()
    expect(spy).toHaveBeenCalledWith('/api/auth/profile', { method: 'GET' })

    await updateProfile({ username: 'u2', email: 'u2@a.com' })
    expect(spy).toHaveBeenCalledWith('/api/auth/profile', {
      method: 'PUT',
      body: { username: 'u2', email: 'u2@a.com' },
    })
  })
})
