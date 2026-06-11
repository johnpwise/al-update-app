import './HiddenCalendar.css'
import CalendarGrid from '../components/CalendarGrid'
import calendarData from '../data/calendar-2026.json'

export default function HiddenCalendar() {
  return (
    <div className="hidden-calendar-page">
      <div className="hc-header">
        <h1>Calendar Admin — 2026</h1>
        <div className="hc-actions">
          <a href="#/">Back</a>
        </div>
      </div>

      <p className="hc-description">Green = good day, Red = bad day. Hover a cell to see notes.</p>

      <CalendarGrid entries={calendarData as {date:string;note:string}[]} year={2026} />

      <div className="hc-legend">
        <span className="legend-item"><span className="cell legend-good"/> Good</span>
        <span className="legend-item"><span className="cell legend-bad"/> Bad</span>
        <span className="legend-item"><span className="cell legend-neutral"/> No data</span>
      </div>
    </div>
  )
}
