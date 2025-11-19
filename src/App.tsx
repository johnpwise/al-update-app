import { useState } from 'react'
import './App.css'

function App() {
  // Single update text stored in code
  const updateText = 'Resting and feeling okay today. Thank you for checking in.'
  const [dark, setDark] = useState(false)

  return (
    <div className={dark ? 'app dark' : 'app'}>
      <header className="app-header">
        <div className="title-group">
          <h1 className="app-title">Health Update</h1>
          <p className="subtitle">Latest update</p>
        </div>
        <button className="mode-toggle" onClick={() => setDark(d => !d)} aria-label="Toggle color theme">
          {dark ? 'Light' : 'Dark'} Mode
        </button>
      </header>

      <main className="content">
        <section className="updates" aria-labelledby="update-heading">
          <h2 id="update-heading">Latest Update</h2>
          <div className="update-item" style={{marginTop: '0.75rem'}}>
            <span className="update-text">{updateText}</span>
          </div>
        </section>
      </main>

      {/* <footer className="footer">
        <p>Updated manually. Timezone: Local.</p>
      </footer> */}
    </div>
  )
}

export default App
