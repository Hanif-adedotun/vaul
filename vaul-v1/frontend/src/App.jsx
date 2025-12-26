import { useState, useEffect } from 'react'
import { CommandService } from "../bindings/changeme"
import { Events } from "@wailsio/runtime"
import Fuse from 'fuse.js'

function App() {
  const [commands, setCommands] = useState([])
  const [filteredCommands, setFilteredCommands] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [copiedId, setCopiedId] = useState(null)

  // Load commands on mount and set up event listener
  useEffect(() => {
    loadCommands()
    
    // Listen for command update events
    Events.On('commands-updated', () => {
      loadCommands()
    })
  }, [])

  const loadCommands = async () => {
    try {
      const cmds = await CommandService.GetCommands()
      setCommands(cmds || [])
      setFilteredCommands(cmds || [])
    } catch (err) {
      console.error('Failed to load commands:', err)
    }
  }

  // Fuzzy search filter commands based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCommands(commands)
    } else {
      const fuse = new Fuse(commands, {
        keys: ['content'],
        threshold: 0.3, // 0.0 = exact match, 1.0 = match anything
        includeScore: true,
        minMatchCharLength: 1,
      })
      
      const results = fuse.search(searchQuery)
      const filtered = results.map(result => result.item)
      setFilteredCommands(filtered)
    }
  }, [searchQuery, commands])

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
        <div className="vaul-header-content">
          <img src="/logo-full.png" alt="VAUL" className="vaul-logo" />
          {commands.length > 0 && (
            <div className="search-container">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search commands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>
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
        {filteredCommands.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">⌨️</div>
            <p className="empty-state-text">
              {searchQuery 
                ? 'No commands found' 
                : commands.length === 0 
                  ? 'No commands saved yet.\nType a command above and press Enter to save it.'
                  : 'No commands match your search'}
            </p>
          </div>
        ) : (
          filteredCommands.map((cmd) => (
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

      {commands.length > 0 && (
        <footer className="vaul-footer">
          <span className="command-count">
            {filteredCommands.length === commands.length 
              ? `${commands.length} ${commands.length === 1 ? 'command' : 'commands'} stored`
              : `${filteredCommands.length} of ${commands.length} ${commands.length === 1 ? 'command' : 'commands'}`
            }
          </span>
        </footer>
      )}
    </div>
  )
}

export default App
