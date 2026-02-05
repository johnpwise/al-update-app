import { useEffect, useState } from 'react'
import entriesData from './entries.json'
import './App.css'

type Entry = { id: number; date: string; text: string }

function App() {
  // Timeline entries loaded from src/entries.json (newest first by date/time when rendered)
  const entries: Entry[] = entriesData

  const [dark, setDark] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const today = new Date()

  // Group entries by date (preserve insertion order, then sort dates desc for display)
  const grouped = entries.reduce((acc, e) => {
    acc[e.date] = acc[e.date] ? [...acc[e.date], e] : [e]
    return acc
  }, {} as Record<string, Entry[]>)
  const orderedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  const formatDate = (isoDate: string) => {
    const d = new Date(isoDate + 'T00:00:00')
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  }

  useEffect(() => {
    document.body.classList.toggle('dark', dark)
    return () => {
      document.body.classList.remove('dark')
    }
  }, [dark])

  return (
    <div className="app">
      <header className={collapsed ? 'app-header is-collapsed' : 'app-header'}>
        <div className="title-group" aria-expanded={!collapsed}>
          <h1 className="app-title">Health Update</h1>
          {!collapsed && (
            <div>
              <p className="subtitle">Recent timeline</p>
              <p>This page is to provide a regular health update on Dad's condition. As we know he suffered a brain haemorrhage in August 2025.
                This is a very serious condition and providing updates regularly is proving really difficult for immediate family as the
                journey is so up and down. One minute he can be doing much better but the second bleed was quite recent and a shock to us
                all - this is still showing what damage has been done and we are unsure what recovery will look like.</p>

              <p>It is likely to be a long up and down journey so providing even weekly updates is very difficult at times so the update may just be no change as
                that is all we can provide for now - however we will aim to try and update this weekly in an attempt to keep loved ones/family/friends updated.</p>

              <p>For now Dad is fully mobile but needs assistance and prompts to do things like getting dressed in the morning. He is lucid sometimes but there is a long way to go
                and so he at this time is unable to hold focus to have any meaningful conversations at this time. We just need to keep positive, allow him time to rest and updates will follow.</p>

              <p>We are unable to answer questions for now as this is a very challenging time right now - all we ask is that he's given time to have a stronger recovery this time. Thank you.</p>
            </div>
          )}
        </div>
        <div className="header-actions">
          <button className="mode-toggle" onClick={() => setDark(d => !d)} aria-label="Toggle color theme">
            {dark ? 'Light' : 'Dark'} Mode
          </button>
          <button
            className="collapse-toggle"
            onClick={() => setCollapsed(c => !c)}
            aria-label={collapsed ? 'Expand header' : 'Collapse header'}
            aria-pressed={collapsed}
          >
            {collapsed ? 'Expand' : 'Collapse'}
          </button>
        </div>
      </header>

      <main className="content">
        <section className="timeline" aria-label="Health updates timeline">
          {orderedDates.map(date => (
            <div key={date} className="timeline-day">
              <h2 className="timeline-date">{formatDate(date)}</h2>
              <ul className="timeline-entries">
                {grouped[date]
                  .slice() // copy, keep original order
                  .map(e => (
                    <li key={e.id} className="timeline-entry">
                      <div className="timeline-dot" />
                      <div className="timeline-card">
                        <div className="timeline-meta">
                          {/* Time display removed */}
                        </div>
                        <p className="timeline-text">{e.text}</p>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </section>
      </main>

      <footer className="footer" aria-label="Footer">
        <p>Manual updates. Today is {today.toLocaleDateString()}.</p>
      </footer>
    </div>
  )
}

export default App
