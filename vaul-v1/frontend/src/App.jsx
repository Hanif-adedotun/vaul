import { useState, useEffect } from 'react'
import { CommandService } from "../bindings/changeme"

function App() {
  const [commands, setCommands] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [copiedId, setCopiedId] = useState(null)

  // Load commands on mount
  useEffect(() => {
    loadCommands()
  }, [])

  const loadCommands = async () => {
    try {
      const cmds = await CommandService.GetCommands()
      setCommands(cmds || [])
    } catch (err) {
      console.error('Failed to load commands:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmedInput = inputValue.trim()
    
    if (!trimmedInput) return

    try {
      await CommandService.AddCommand(trimmedInput)
      setInputValue('')
      loadCommands()
    } catch (err) {
      console.error('Failed to add command:', err)
    }
  }

  const handleCopy = async (command) => {
    try {
      await navigator.clipboard.writeText(command.content)
      setCopiedId(command.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await CommandService.DeleteCommand(id)
      loadCommands()
    } catch (err) {
      console.error('Failed to delete command:', err)
    }
  }

  return (
    <div className="vaul-container">
      <header className="vaul-header">
        <h1 className="vaul-title">VAUL</h1>
        <p className="vaul-subtitle">Your terminal command vault</p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="glass-input-container">
          <input
            type="text"
            className="command-input"
            placeholder="Enter a command and press Enter to save..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
          />
        </div>
      </form>

      <div className="commands-list">
        {commands.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">⌨️</div>
            <p className="empty-state-text">
              No commands saved yet.<br />
              Type a command above and press Enter to save it.
            </p>
          </div>
        ) : (
          commands.map((cmd) => (
            <div key={cmd.id} className="command-card">
              <button
                className="delete-btn"
                onClick={() => handleDelete(cmd.id)}
                title="Delete command"
              >
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <div className="command-content">
                <code className="command-code">{cmd.content}</code>
                <button
                  className={`copy-btn ${copiedId === cmd.id ? 'copied' : ''}`}
                  onClick={() => handleCopy(cmd)}
                  title="Copy to clipboard"
                >
                  {copiedId === cmd.id ? (
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App
