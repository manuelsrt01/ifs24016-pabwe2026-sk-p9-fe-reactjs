import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import StickyNavbar from './StickyNavbar'

describe('StickyNavbar', () => {
  it('renders guest navigation, popup login, and mobile menu', () => {
    const onNavigate = vi.fn()
    const onOpenAuthModal = vi.fn()
    const onToggleTheme = vi.fn()

    render(
      <StickyNavbar
        user={null}
        onNavigate={onNavigate}
        onOpenAuthModal={onOpenAuthModal}
        onToggleTheme={onToggleTheme}
      />
    )

    fireEvent.click(screen.getByText('Delcom Blog'))
    expect(onNavigate).toHaveBeenCalledWith('/')

    fireEvent.click(screen.getByText('Galeri Publik'))
    expect(onNavigate).toHaveBeenCalledWith('/')

    fireEvent.click(screen.getByText('Popup Login'))
    expect(onOpenAuthModal).toHaveBeenCalled()

    fireEvent.click(screen.getByLabelText('Toggle Tema'))
    expect(onToggleTheme).toHaveBeenCalled()

    fireEvent.click(screen.getByText('Login'))
    expect(onNavigate).toHaveBeenCalledWith('/login')

    fireEvent.click(screen.getByText('Register'))
    expect(onNavigate).toHaveBeenCalledWith('/register')

    // Mobile menu for guest
    fireEvent.click(screen.getByLabelText('Toggle Menu Mobile'))
    const mobileLogins = screen.getAllByText('Login')
    fireEvent.click(mobileLogins[mobileLogins.length - 1])
    expect(onNavigate).toHaveBeenCalledWith('/login')

    fireEvent.click(screen.getByLabelText('Toggle Menu Mobile'))
    const mobileRegisters = screen.getAllByText('Register')
    fireEvent.click(mobileRegisters[mobileRegisters.length - 1])
    expect(onNavigate).toHaveBeenCalledWith('/register')
  })

  it('renders authenticated author and admin navigation and mobile actions', () => {
    const onNavigate = vi.fn()
    const onLogout = vi.fn()

    const { rerender } = render(
      <StickyNavbar
        user={{ id: 1, username: 'admin', role: 'admin' }}
        currentPath="/author"
        onNavigate={onNavigate}
        onLogout={onLogout}
        isDark={true}
        onToggleTheme={vi.fn()}
      />
    )

    fireEvent.click(screen.getByText(/Workspace Penulis/i))
    expect(onNavigate).toHaveBeenCalledWith('/author')

    fireEvent.click(screen.getByText(/Admin Panel/i))
    expect(onNavigate).toHaveBeenCalledWith('/admin')

    fireEvent.click(screen.getByText(/Keluar/i))
    expect(onLogout).toHaveBeenCalled()

    // Rerender on /admin path and test mobile menu for admin
    rerender(
      <StickyNavbar
        user={{ id: 1, username: 'admin', role: 'admin' }}
        currentPath="/admin"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />
    )

    fireEvent.click(screen.getByLabelText('Toggle Menu Mobile'))
    const galeriBtns = screen.getAllByText('Galeri Publik')
    fireEvent.click(galeriBtns[galeriBtns.length - 1])

    fireEvent.click(screen.getByLabelText('Toggle Menu Mobile'))
    const wsBtns = screen.getAllByText('Workspace Penulis')
    fireEvent.click(wsBtns[wsBtns.length - 1])

    fireEvent.click(screen.getByLabelText('Toggle Menu Mobile'))
    const admBtns = screen.getAllByText('Admin Panel')
    fireEvent.click(admBtns[admBtns.length - 1])

    fireEvent.click(screen.getByLabelText('Toggle Menu Mobile'))
    fireEvent.click(screen.getByText(/Keluar \(@admin\)/i))
    expect(onLogout).toHaveBeenCalledTimes(2)
  })
})
