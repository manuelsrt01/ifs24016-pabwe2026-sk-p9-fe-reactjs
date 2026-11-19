import { apiRequest } from '../../../helpers/apiHelper'

export async function fetchCategories() {
  return apiRequest('/api/public/categories')
}

export async function fetchPublicPosts({ q = '', category = '' } = {}) {
  const params = new URLSearchParams()
  if (q && q.trim()) params.set('q', q.trim())
  if (category && category.trim() && category !== 'Semua') params.set('category', category.trim())
  const queryString = params.toString()
  const url = queryString ? `/api/public/posts?${queryString}` : '/api/public/posts'
  return apiRequest(url)
}

export async function fetchPublicPostBySlug(slug) {
  return apiRequest(`/api/public/posts/${encodeURIComponent(slug)}`)
}

export async function fetchAuthorPosts() {
  return apiRequest('/api/posts')
}

export async function fetchAuthorStats() {
  return apiRequest('/api/posts/stats')
}

export async function fetchAuthorPostById(id) {
  return apiRequest(`/api/posts/${id}`)
}

export async function createPost(payload) {
  return apiRequest('/api/posts', {
    method: 'POST',
    body: payload,
  })
}

export async function updatePost(id, payload) {
  return apiRequest(`/api/posts/${id}`, {
    method: 'PUT',
    body: payload,
  })
}

export async function togglePublishPost(id) {
  return apiRequest(`/api/posts/${id}/toggle-publish`, {
    method: 'PATCH',
  })
}

export async function deletePost(id) {
  return apiRequest(`/api/posts/${id}`, {
    method: 'DELETE',
  })
}

export async function generateAiPost(payload) {
  return apiRequest('/api/posts/ai-generate', {
    method: 'POST',
    body: payload,
  })
}
