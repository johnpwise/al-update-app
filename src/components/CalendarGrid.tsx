import './CalendarGrid.css'

type Entry = { date: string; note: string; Outcome?: string; outcome?: string }

function analyzeNote(note: string | undefined) {
  // returns status: 'good' | 'bad' | 'ok' and paranoia flag
  if (!note) return { status: 'ok', paranoia: false }
  const s = note.toLowerCase()
  const paranoia = s.includes('parano') || s.includes('paranoid')
  if (s.includes('good') || s.includes('with it') || s.includes('fine') || s.includes('better')) return { status: 'good', paranoia }
  if (s.includes('bad') || s.includes('depress') || s.includes('not good') || s.includes('confus') || s.includes('confused') || s.includes('up and down') || s.includes('wandery')) return { status: 'bad', paranoia }
  // unclear / ambiguous -> treat as OK (yellow)
  return { status: 'ok', paranoia }
}

function monthName(m: number) {
  return new Date(2026, m, 1).toLocaleString(undefined, { month: 'short' })
}

export default function CalendarGrid({ entries, year }: { entries: Entry[]; year: number }) {
  const map = new Map(entries.map(e => [e.date, e]))
  const minColorDate = new Date('2026-02-16')
  const forceNeutralFrom = new Date('2026-06-12')

  const months = Array.from({ length: 12 }, (_, i) => i)

  return (
    <div className="calendar-grid">
      {months.map(m => {
        const daysInMonth = new Date(year, m + 1, 0).getDate()
        const dayCells = Array.from({ length: daysInMonth }, (_, d) => {
          const day = d + 1
          const iso = `${year}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const entry = map.get(iso) as Entry | undefined
          const note = entry?.note
          // leave dates before minColorDate as neutral (grey)
          const isoDate = new Date(iso + 'T00:00:00')
          if (isoDate < minColorDate) {
            return (
              <div
                key={iso}
                className={`cg-cell neutral`}
                title={`${iso}${note ? ' — ' + note : ''}`}
                aria-label={`${iso} neutral`}
              />
            )
          }

          // force neutral (grey) for dates from 2026-06-12 onward
          if (isoDate >= forceNeutralFrom) {
            return (
              <div
                key={iso}
                className={`cg-cell neutral`}
                title={`${iso}${note ? ' — ' + note : ''}`}
                aria-label={`${iso} neutral`}
              />
            )
          }
          // Prefer explicit Outcome if present
          const outcome = entry?.Outcome || entry?.outcome
          let displayStatus: 'good' | 'bad' | 'ok' | 'neutral'
          let paranoia = false
          if (outcome === 'Good') {
            displayStatus = 'good'
          } else if (outcome === 'Bad') {
            displayStatus = 'bad'
          } else if (note === undefined) {
            displayStatus = 'neutral'
          } else {
            const res = analyzeNote(note)
            displayStatus = res.status as any
            paranoia = res.paranoia
          }
          return (
            <div
              key={iso}
              className={`cg-cell ${displayStatus}`}
              title={`${iso}${note ? ' — ' + note : ''}`}
              aria-label={`${iso} ${displayStatus}${paranoia ? ' paranoia' : ''}`}
            >
              {paranoia && <span className="p-badge">P</span>}
            </div>
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
