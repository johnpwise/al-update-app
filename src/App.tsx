import { useState } from 'react'
import './App.css'

type Entry = { id: number; date: string; text: string }

function App() {
  // Timeline entries (newest first by date/time when rendered)
    const entries: Entry[] = [
      { id: 21, date: '2025-12-09', text: 'Still seemingly some confusion around needing to leave the house and return to home. Started talking therapy yesterday and had a good two hour session. Mostly chatted about the work days but this gave the therapist an idea on what to focus on in the therapy. She found him a fascinating charater. He will have another appt next week with her. He was quite tired after this - became a little confused again later and settled when he watched a music concert. ' },
      { id: 20, date: '2025-12-05', text: 'Ups and downs this week - at one point he was convinced he was in another house and needed to get to his own house. Couldn\'t understand it was his house. Confused. Elizabeth managed to show him using itags/ipad that he was at home and didn\'t need to go anywhere else. Reassuring him this way seems to have helped for now. Had some better sleeps after this. Awaiting support from talking therapy hopefully next week.' },
      { id: 19, date: '2025-11-30', text: 'Dad had a better sleep and was up and out of bed before 10am. Was hoping to get out of the house and about a bit today as the weather was bright. There is still an element of confusion and potential hallucinations overnight.' },
      { id: 18, date: '2025-11-29', text: 'Dad constantly losing things including letters/glasses - very confused - not understanding what family are telling him about his home being his home - would understand better with rest - he is very restless - possibly medication side effects. Needs lots of rest and to do little by little each day then rest for now. Talking therapy planned for a week or twos time. Dad needs time at the moment.' },
      { id: 17, date: '2025-11-28', text: 'Dad convinced he is being moved out of his home - paranoid that family is selling it from under him - again the opposite is happening - reassuring him he is staying at home and we are stopping him from going in a care home.' },
      { id: 16, date: '2025-11-22', text: 'Dad more with it today - sometimes restless at night and wandering but sleeping a lot in the day to aid recovery.' },
      { id: 15, date: '2025-11-21', text: 'Dad extremely confused. Not a good day.' },
      { id: 14, date: '2025-11-20', text: 'Dad convinced he is being put in a care home but the opposite is the reality but cannot get this through to him.' },
      { id: 13, date: '2025-11-05', text: 'Dad discharged from hospital again and returned home. Dad was very delierious/confused when home and convinced that his home was not his home but a copy of his home... took a long time to reassure him that this was not the case and there is still the belief on a regular basis that it is not his home or it has been sold from underneath him. A lot of confusion still and needs time to recover for now. It will be a slow recovery process and will be getting talking therapy soon to hopefully help him settle again.' },
      { id: 12, date: '2025-10-31', text: 'Dad extremely agitated in hospital - convinced the hospital and staff were evil - thought they were there to drill holes in his brain. Told him the opposite and that he needed rest. Again claims family are part of this conspiracy. Took a long time for him to gain trust of family. All this is either damage to the brain or medication side effects. Dad could not settle in hospital and was wandering around the wards not sleeping at all and really poor recovery. Disturbing other patients too. Priority was to get him home with some care package to help but again familiarity thought to help him.' },
      { id: 11, date: '2025-10-27', text: 'Dad had a series of more wobbles after being in hospital - more mini strokes or these seemed to be anyway. Elizabeh back down to Kent as sounded as though dad was going further downhill. Dr had suggested the wobbles were actually seizures. To prevent these in future he was put on anti seizure meds and will continue to review this at a later date. ' },
      { id: 10, date: '2025-10-23', text: 'Dad readmitted and a lot of staff saddened he was readmitted after doing so well. CT scan confirmed another much smaller bleed however was unclear on a cause or damage it had caused so far. Would do an MRI scan to check for causes.' },
      { id: 9, date: '2025-10-22', text: 'On Facetime speaking with Dad - seemed ok but all of a sudden speech slurred and right side seemed to weaken. Mum called ambulance - Michael was straight over to help too. Dad rushed back in Ambulance to stroke unit and readmitted.' },
      { id: 8, date: '2025-10-01', text: 'Recovery ongoing - some good days - some less good days - Blood pressure constantly reviewed - seemed ok - Dad had been getting about a bit more - doing some walking and having some talking therapy.' },
      { id: 7, date: '2025-09-11', text: 'After a lot of confusion/delerium/physio dad is discharged from hospital to continue the recovery at home as it was determined that familiar surroundings should help confusion. Elizabeth back to Leeds around 14th Sept due to work.' },
      { id: 6, date: '2025-09-01', text: 'Dad gradually improved although there was a lot of confusion/delerium (around being in a hotel/on a boat/in Belfast - paranoia of people shooting people at night - lots of confused times and took a long time to get him out of this and convince him he was safe and in hospital. Also had blood pressure drops/seizures. Some good days with big improvements and then some scares/fears of new bleeds. Thankfully these were determined as either blood pressure drops or seizures.' },
      { id: 5, date: '2025-08-14', text: 'Drs were concerned he may still deteriorate - Liz was asked if we wanted to try a feeding tube - she agreed. Thankfully this seemed to help and Dad showed improvements here.' },
      { id: 4, date: '2025-08-13', text: 'Consultant spoke to us to say he had been prepping dad for respite/palliative care - he had had another bleed which had been observed by the CT scan they did once he was admitted. Told that if they had known he had been this bad before leaving previous hospital they would not have taken him. Thankfully they did and Dad showed some response the next day when he opened his eyes to nursing staff .' },
      { id: 3, date: '2025-08-12', text: 'Place secured at specialist Stroke Ward Canterbury - just in the nick of time - dad had deteriorated. Got to Canterbury 00:30am - left him to rest on ward.' },
      { id: 2, date: '2025-08-11', text: 'Dads 80th Birthday - survived the night in resuss - stabilised and moved to another ward for recovery. Awaited Stroke ward space at Canterbury hospital. Liz & John stayed overnight until moved to Canterbury hospital.' },
      { id: 1, date: '2025-08-10', text: 'Admitted to Hospital - CT scan showed big IntraCranial Hemorrhage. Admitted to Resuss - told to prep for worst - hope for best. 3% surivival rate given by consultant.' }
  ]

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

  return (
    <div className={dark ? 'app dark' : 'app'}>
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
