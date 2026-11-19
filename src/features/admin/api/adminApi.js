import { apiRequest } from '../../../helpers/apiHelper'

export async function fetchAdminUsers() {
  return apiRequest('/api/admin/users')
}

export async function fetchAdminPosts() {
  return apiRequest('/api/admin/posts')
}

export async function fetchAdminUserPosts(userId) {
  return apiRequest(`/api/admin/users/${userId}/posts`)
}
