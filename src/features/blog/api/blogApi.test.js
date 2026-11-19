import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as apiHelper from '../../../helpers/apiHelper'
import {
  fetchCategories,
  fetchPublicPosts,
  fetchPublicPostBySlug,
  fetchAuthorPosts,
  fetchAuthorStats,
  fetchAuthorPostById,
  createPost,
  updatePost,
  togglePublishPost,
  deletePost,
  generateAiPost,
} from './blogApi'

describe('blogApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('calls all blog endpoints properly', async () => {
    const spy = vi.spyOn(apiHelper, 'apiRequest').mockResolvedValue({ status: 'success' })

    await fetchCategories()
    expect(spy).toHaveBeenCalledWith('/api/public/categories')

    await fetchPublicPosts()
    expect(spy).toHaveBeenCalledWith('/api/public/posts')

    await fetchPublicPosts({ q: 'go', category: 'Semua' })
    expect(spy).toHaveBeenCalledWith('/api/public/posts?q=go')

    await fetchPublicPosts({ q: 'gin', category: 'Teknologi' })
    expect(spy).toHaveBeenCalledWith('/api/public/posts?q=gin&category=Teknologi')

    await fetchPublicPostBySlug('belajar-go')
    expect(spy).toHaveBeenCalledWith('/api/public/posts/belajar-go')

    await fetchAuthorPosts()
    expect(spy).toHaveBeenCalledWith('/api/posts')

    await fetchAuthorStats()
    expect(spy).toHaveBeenCalledWith('/api/posts/stats')

    await fetchAuthorPostById(5)
    expect(spy).toHaveBeenCalledWith('/api/posts/5')

    await createPost({ title: 'T' })
    expect(spy).toHaveBeenCalledWith('/api/posts', { method: 'POST', body: { title: 'T' } })

    await updatePost(5, { title: 'U' })
    expect(spy).toHaveBeenCalledWith('/api/posts/5', { method: 'PUT', body: { title: 'U' } })

    await togglePublishPost(5)
    expect(spy).toHaveBeenCalledWith('/api/posts/5/toggle-publish', { method: 'PATCH' })

    await deletePost(5)
    expect(spy).toHaveBeenCalledWith('/api/posts/5', { method: 'DELETE' })

    await generateAiPost({ topic: 'AI' })
    expect(spy).toHaveBeenCalledWith('/api/posts/ai-generate', {
      method: 'POST',
      body: { topic: 'AI' },
    })
  })
})
