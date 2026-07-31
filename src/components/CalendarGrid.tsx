import { useState, type MouseEvent } from 'react'
import './CalendarGrid.css'

type Entry = { date: string; note?: string; Outcome?: string; outcome?: string }

function normalizeOutcome(value: string | undefined) {
  const normalized = value?.trim().toLowerCase()
  if (normalized === 'good') return 'good'
  if (normalized === 'bad') return 'bad'
  if (normalized === 'ok' || normalized === 'neutral' || normalized === 'unclear') return 'ok'
  return undefined
}

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
  const months = Array.from({ length: 12 }, (_, i) => i)
  const [tooltip, setTooltip] = useState<{ date: string; note: string; x: number; y: number } | null>(null)

  const showTooltip = (event: MouseEvent<HTMLDivElement>, date: string, note: string | undefined) => {
    if (!note) {
      setTooltip(null)
      return
    }
    setTooltip({ date, note, x: event.clientX + 12, y: event.clientY + 12 })
  }

  const hideTooltip = () => setTooltip(null)

  return (
    <div className="calendar-grid">
      {months.map(m => {
        const daysInMonth = new Date(year, m + 1, 0).getDate()
        const dayCells = Array.from({ length: daysInMonth }, (_, d) => {
          const day = d + 1
          const iso = `${year}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const entry = map.get(iso) as Entry | undefined
          const note = entry?.note
          const outcome = normalizeOutcome(entry?.Outcome || entry?.outcome)
          let displayStatus: 'good' | 'bad' | 'ok' | 'neutral'
          let paranoia = false

          const baseParanoia = note ? note.toLowerCase().includes('parano') || note.toLowerCase().includes('paranoid') : false
          paranoia = baseParanoia

          if (outcome === 'good') {
            displayStatus = 'good'
          } else if (outcome === 'bad') {
            displayStatus = 'bad'
          } else if (outcome === 'ok') {
            displayStatus = 'ok'
          } else if (note === undefined || note === '') {
            displayStatus = 'neutral'
          } else {
            const res = analyzeNote(note)
            displayStatus = res.status as 'good' | 'bad' | 'ok'
            paranoia = baseParanoia || res.paranoia
          }
          const titleText = note ? `${iso} — ${note}` : `${iso}${entry ? ' — no note' : ''}`
          return (
            <div
              key={iso}
              className={`cg-cell ${displayStatus}`}
              title={titleText}
              aria-label={`${iso} ${displayStatus}${paranoia ? ' paranoia' : ''}`}
              onMouseEnter={event => showTooltip(event, iso, note)}
              onMouseLeave={hideTooltip}
              onFocus={event => showTooltip(event as unknown as MouseEvent<HTMLDivElement>, iso, note)}
              onBlur={hideTooltip}
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
      {tooltip && (
        <div className="cg-tooltip" style={{ left: tooltip.x, top: tooltip.y }} role="status">
          <strong>{tooltip.date}</strong>
          <div>{tooltip.note}</div>
        </div>
      )}
    </div>
  )
}
