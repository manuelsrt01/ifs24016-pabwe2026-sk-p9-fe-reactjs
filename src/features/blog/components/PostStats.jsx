import { IconFiles, IconCircleCheck, IconFilePencil } from '@tabler/icons-react'

export default function PostStats({ stats = {}, activeFilter = 'all', onFilterChange }) {
  const total = stats.total_artikel ?? stats.total ?? 0
  const published = stats.total_terbit ?? stats.total_selesai ?? stats.published ?? 0
  const draft = stats.belum_selesai ?? stats.draft ?? 0

  const cards = [
    {
      id: 'all',
      label: 'Total Artikel',
      value: total,
      subtitle: 'Seluruh artikel Anda',
      icon: IconFiles,
      color: 'border-blue-200 bg-blue-50/60 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300',
    },
    {
      id: 'published',
      label: 'Total Selesai / Terbit',
      value: published,
      subtitle: 'Tayang di galeri publik',
      icon: IconCircleCheck,
      color: 'border-emerald-200 bg-emerald-50/60 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300',
    },
    {
      id: 'draft',
      label: 'Belum Selesai / Draf',
      value: draft,
      subtitle: 'Tersimpan sebagai draf',
      icon: IconFilePencil,
      color: 'border-amber-200 bg-amber-50/60 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3" aria-label="Statistik Artikel Penulis">
      {cards.map((card) => {
        const Icon = card.icon
        const isActive = activeFilter === card.id
        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onFilterChange && onFilterChange(card.id)}
            className={`flex items-center justify-between rounded-2xl border p-5 text-left transition shadow-sm ${
              card.color
            } ${isActive ? 'ring-2 ring-blue-600' : 'hover:opacity-90'}`}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-wider opacity-80">{card.label}</p>
              <p className="mt-1 text-3xl font-extrabold">{card.value}</p>
              <p className="mt-1 text-xs opacity-75">{card.subtitle}</p>
            </div>
            <span className="rounded-2xl bg-white/70 dark:bg-slate-900/60 p-3.5 shadow-sm">
              <Icon size={28} />
            </span>
          </button>
        )
      })}
    </div>
  )
}
