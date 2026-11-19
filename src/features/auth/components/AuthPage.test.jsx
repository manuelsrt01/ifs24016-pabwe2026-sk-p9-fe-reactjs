import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AuthPage from './AuthPage'
import * as authApi from '../api/authApi'
import * as toolsHelper from '../../../helpers/toolsHelper'

describe('AuthPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.spyOn(toolsHelper, 'showErrorAlert').mockResolvedValue({})
    vi.spyOn(toolsHelper, 'showSuccessAlert').mockResolvedValue({})
  })

  it('validates and submits login form, and handles navigation', async () => {
    const onAuthSuccess = vi.fn()
    const onNavigate = vi.fn()
    vi.spyOn(authApi, 'loginUser').mockResolvedValueOnce({
      message: '',
      data: { token: 't', user: { id: 1, username: 'budi' } },
    })

    render(<AuthPage onAuthSuccess={onAuthSuccess} onNavigate={onNavigate} />)

    // Empty submit -> error alert
    fireEvent.click(document.getElementById('login-submit'))
    await waitFor(() => {
      expect(toolsHelper.showErrorAlert).toHaveBeenCalled()
    })

    // Fill login-username and login-password
    fireEvent.change(document.getElementById('login-username'), {
      target: { value: 'budi' },
    })
    fireEvent.change(document.getElementById('login-password'), {
      target: { value: 'rahasia' },
    })
    fireEvent.click(document.getElementById('login-submit'))

    await waitFor(() => {
      expect(authApi.loginUser).toHaveBeenCalledWith({
        username: 'budi',
        password: 'rahasia',
      })
      expect(onAuthSuccess).toHaveBeenCalled()
    })

    // Navigate back & to register
    fireEvent.click(screen.getByText(/Kembali ke Beranda Publik/i))
    expect(onNavigate).toHaveBeenCalledWith('/')

    fireEvent.click(screen.getByText(/Daftar Akun Baru/i))
    expect(onNavigate).toHaveBeenCalledWith('/register')
  })

  it('handles login API failure and register mode lifecycle', async () => {
    const onNavigate = vi.fn()
    vi.spyOn(authApi, 'registerUser')
      .mockResolvedValueOnce({ status: 'success' })
      .mockRejectedValueOnce(new Error('Username sudah ada'))

    render(<AuthPage mode="register" onAuthSuccess={vi.fn()} onNavigate={onNavigate} />)

    // Missing email on register
    fireEvent.change(document.getElementById('login-username'), { target: { value: 'budi' } })
    fireEvent.change(document.getElementById('login-password'), { target: { value: '123' } })
    fireEvent.click(document.getElementById('login-submit'))
    await waitFor(() => {
      expect(toolsHelper.showErrorAlert).toHaveBeenCalled()
    })

    // Fill email & submit register success
    fireEvent.change(document.getElementById('register-email'), {
      target: { value: 'budi@delcom.org' },
    })
    fireEvent.click(document.getElementById('login-submit'))
    await waitFor(() => {
      expect(authApi.registerUser).toHaveBeenCalled()
      expect(onNavigate).toHaveBeenCalledWith('/login')
    })

    // Submit register error
    fireEvent.click(document.getElementById('login-submit'))
    await waitFor(() => {
      expect(toolsHelper.showErrorAlert).toHaveBeenCalledWith('Username sudah ada')
    })

    // Switch to login
    fireEvent.click(screen.getByText(/Masuk di sini/i))
    expect(onNavigate).toHaveBeenCalledWith('/login')
  })
})
