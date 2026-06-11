import './CalendarGrid.css'

type Entry = { date: string; note: string }

function parseStatus(note: string | undefined) {
  if (!note) return 'neutral'
  const s = note.toLowerCase()
  if (s.includes('good') || s.includes('with it') || s.includes('fine') || s.includes('better')) return 'good'
  if (s.includes('bad') || s.includes('parano') || s.includes('depress') || s.includes('not good') || s.includes('confus') || s.includes('confused') || s.includes('up and down') || s.includes('wandery')) return 'bad'
  return 'neutral'
}

function monthName(m: number) {
  return new Date(2026, m, 1).toLocaleString(undefined, { month: 'short' })
}

export default function CalendarGrid({ entries, year }: { entries: Entry[]; year: number }) {
  const map = new Map(entries.map(e => [e.date, e.note]))

  const months = Array.from({ length: 12 }, (_, i) => i)

  return (
    <div className="calendar-grid">
      {months.map(m => {
        const daysInMonth = new Date(year, m + 1, 0).getDate()
        const dayCells = Array.from({ length: daysInMonth }, (_, d) => {
          const day = d + 1
          const iso = `${year}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const note = map.get(iso)
          const status = parseStatus(note)
          return (
            <div
              key={iso}
              className={`cg-cell ${status}`}
              title={`${iso}${note ? ' — ' + note : ''}`}
              aria-label={`${iso} ${status}`}
            />
          )
        })

        return (
          <div className="cg-month" key={m}>
            <div className="cg-month-label">{monthName(m)}</div>
            <div className="cg-days">{dayCells}</div>
          </div>
        )
      })}
    </div>
  )
}
