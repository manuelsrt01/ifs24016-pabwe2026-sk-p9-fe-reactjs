import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AuthModal from './AuthModal'
import * as authApi from '../api/authApi'
import * as toolsHelper from '../../../helpers/toolsHelper'

describe('AuthModal', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.spyOn(toolsHelper, 'showErrorAlert').mockResolvedValue({})
    vi.spyOn(toolsHelper, 'showSuccessAlert').mockResolvedValue({})
  })

  it('returns null when closed and handles login when open', async () => {
    const onClose = vi.fn()
    const onAuthSuccess = vi.fn()

    const { rerender } = render(
      <AuthModal isOpen={false} onClose={onClose} onAuthSuccess={onAuthSuccess} />
    )
    expect(screen.queryByRole('dialog')).toBeNull()

    rerender(<AuthModal isOpen={true} onClose={onClose} onAuthSuccess={onAuthSuccess} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    // Empty submit
    fireEvent.click(document.getElementById('login-submit'))
    await waitFor(() => {
      expect(toolsHelper.showErrorAlert).toHaveBeenCalled()
    })

    // Failed login
    vi.spyOn(authApi, 'loginUser').mockRejectedValueOnce(new Error('Login gagal'))
    fireEvent.change(document.getElementById('login-username'), { target: { value: 'admin' } })
    fireEvent.change(document.getElementById('login-password'), { target: { value: 'wrong' } })
    fireEvent.click(document.getElementById('login-submit'))
    await waitFor(() => {
      expect(toolsHelper.showErrorAlert).toHaveBeenCalledWith('Login gagal')
    })

    // Successful login
    vi.spyOn(authApi, 'loginUser').mockResolvedValueOnce({
      message: '',
      data: { token: 'jwt', user: { id: 1, username: 'admin' } },
    })
    fireEvent.click(document.getElementById('login-submit'))
    await waitFor(() => {
      expect(onAuthSuccess).toHaveBeenCalled()
      expect(onClose).toHaveBeenCalled()
    })
  })
})
