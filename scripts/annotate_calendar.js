const fs = require('fs')
const path = require('path')
const file = path.resolve(__dirname, '../src/data/calendar-2026.json')
const raw = fs.readFileSync(file, 'utf8')
const entries = JSON.parse(raw)

function decideOutcome(note){
  if(!note || note.trim()==='') return ''
  const s = note.toLowerCase()
  const badWords = ['bad','parano','paranoid','depress','not good','bad day','bad morning','bad dreams','not good or very cooperative','wandery','confus','confused']
  for(const b of badWords){
    if(s.includes(b)) return 'Bad'
  }
  const goodWords = ['good','fine','better','with it','pretty good','in good spirits','good day']
  for(const g of goodWords){
    if(s.includes(g)) return 'Good'
  }
  return ''
}

let changed = 0
const out = entries.map(e=>{
  const note = e.note
  const existing = e.Outcome || e.outcome || ''
  if(existing) return {...e, Outcome: existing}
  const outcome = decideOutcome(note)
  if(outcome){ changed++ }
  return {...e, Outcome: outcome}
})

fs.writeFileSync(file, JSON.stringify(out, null, 2), 'utf8')
console.log('Annotated', changed, 'entries')
