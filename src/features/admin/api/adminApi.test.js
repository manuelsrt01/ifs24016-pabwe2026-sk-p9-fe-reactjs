import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as apiHelper from '../../../helpers/apiHelper'
import {
  fetchAdminUsers,
  fetchAdminPosts,
  fetchAdminUserPosts,
} from './adminApi'

describe('adminApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('calls admin endpoints properly', async () => {
    const spy = vi.spyOn(apiHelper, 'apiRequest').mockResolvedValue({ status: 'success' })

    await fetchAdminUsers()
    expect(spy).toHaveBeenCalledWith('/api/admin/users')

    await fetchAdminPosts()
    expect(spy).toHaveBeenCalledWith('/api/admin/posts')

    await fetchAdminUserPosts(3)
    expect(spy).toHaveBeenCalledWith('/api/admin/users/3/posts')
  })
})
