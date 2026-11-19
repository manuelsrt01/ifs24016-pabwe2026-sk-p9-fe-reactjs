import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PostStats from './PostStats'

describe('PostStats', () => {
  it('renders stats with default and provided fields and triggers filter change', () => {
    const onFilterChange = vi.fn()
    const { rerender } = render(<PostStats />)
    expect(screen.getAllByText('0')).toHaveLength(3)

    // Clicking without onFilterChange does not crash
    fireEvent.click(screen.getByText('Total Artikel'))

    rerender(
      <PostStats
        stats={{ total_artikel: 7, total_terbit: 4, belum_selesai: 3 }}
        activeFilter="published"
        onFilterChange={onFilterChange}
      />
    )
    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Belum Selesai / Draf'))
    expect(onFilterChange).toHaveBeenCalledWith('draft')

    // Fallback stats keys
    rerender(
      <PostStats
        stats={{ total: 5, total_selesai: 2, draft: 3 }}
        activeFilter="draft"
        onFilterChange={onFilterChange}
      />
    )
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()

    rerender(<PostStats stats={{ total: 5, published: 1, draft: 4 }} />)
    expect(screen.getByText('1')).toBeInTheDocument()
  })
})
