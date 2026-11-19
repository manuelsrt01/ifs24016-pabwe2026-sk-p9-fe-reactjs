import { describe, it, expect, vi } from 'vitest'
import Swal from 'sweetalert2'
import {
  formatDate,
  showSuccessAlert,
  showErrorAlert,
  showConfirmDialog,
} from './toolsHelper'

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}))

describe('toolsHelper', () => {
  it('formats valid and invalid dates properly', () => {
    expect(formatDate('')).toBe('-')
    expect(formatDate(null)).toBe('-')
    expect(formatDate('not-a-date')).toBe('-')
    const formatted = formatDate('2026-11-19T08:00:00Z')
    expect(formatted).toContain('2026')
  })

  it('calls SweetAlert2 for success, error, and confirm dialogs', async () => {
    Swal.fire.mockResolvedValueOnce({ isConfirmed: true })
    await showSuccessAlert('Disimpan')
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({ icon: 'success', text: 'Disimpan' })
    )

    Swal.fire.mockResolvedValueOnce({ isConfirmed: true })
    await showErrorAlert('Gagal memuat')
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({ icon: 'error', text: 'Gagal memuat' })
    )

    Swal.fire.mockResolvedValueOnce({ isConfirmed: true })
    const confirmed = await showConfirmDialog('Hapus data?')
    expect(confirmed).toBe(true)

    Swal.fire.mockResolvedValueOnce({ isConfirmed: false })
    const cancelled = await showConfirmDialog('Hapus data?')
    expect(cancelled).toBe(false)
  })
})
