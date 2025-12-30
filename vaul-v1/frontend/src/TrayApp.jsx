import { useState, useEffect } from 'react'
import { CommandService, WindowService, AppService } from "../bindings/changeme"
import { Events } from "@wailsio/runtime"
import Fuse from 'fuse.js'

function TrayApp() {
  const [commands, setCommands] = useState([])
  const [categories, setCategories] = useState([])
  const [filteredCommands, setFilteredCommands] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedId, setCopiedId] = useState(null)

  // Load commands on mount and set up event listener
  useEffect(() => {
    loadCommands()
    
    // Listen for command update events
    Events.On('commands-updated', () => {
      loadCommands()
    })
    
    // Also poll every 2 seconds as a fallback
    const pollInterval = setInterval(() => {
      loadCommands()
    }, 2000)
    
    return () => {
      clearInterval(pollInterval)
    }
  }, [])

  const loadCommands = async () => {
    try {
      const [cmds, cats] = await Promise.all([
        CommandService.GetCommands(),
        CommandService.GetCategories()
      ])
      setCommands(cmds || [])
      setCategories(cats || [])
      setFilteredCommands(cmds || [])
    } catch (err) {
      console.error('Failed to load commands:', err)
    }
  }

  const getCategoryName = (categoryId) => {
    if (!categoryId) return null
    const cat = categories.find(c => c.id === categoryId)
    return cat ? cat.name : null
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

  const handleCopy = async (command) => {
    try {
      await navigator.clipboard.writeText(command.content)
      setCopiedId(command.id)
      setTimeout(() => setCopiedId(null), 1500)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleOpenMainApp = async () => {
    try {
      await WindowService.OpenMainWindow()
    } catch (err) {
      console.error('Failed to open main app:', err)
    }
  }

  const handleQuit = async () => {
    try {
      await AppService.Quit()
    } catch (err) {
      console.error('Failed to quit:', err)
    }
  }

  return (
    <div className="tray-container">
      <div className="tray-header-section">
        <img src="/logo-full.png" alt="VAUL" className="tray-logo-small" />
        <button className="tray-open-app-btn" onClick={handleOpenMainApp}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
          </svg>
          <span>Open Vaul</span>
        </button>
      </div>

      <div className="tray-search-container">
        <svg className="tray-search-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          type="text"
          className="tray-search-input"
          placeholder="Search commands..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="tray-commands-list">
        {filteredCommands.length === 0 ? (
          <div className="tray-empty-state">
            <p>{searchQuery ? 'No commands found' : 'No commands saved'}</p>
          </div>
        ) : (
          filteredCommands.map((cmd) => {
            const categoryName = getCategoryName(cmd.category)
            const category = categories.find(c => c.id === cmd.category)
            
            return (
              <div key={cmd.id} className="tray-command-item">
                {categoryName && (
                  <div className="tray-command-category">
                    {category?.color && (
                      <span 
                        className="tray-category-dot" 
                        style={{ backgroundColor: category.color }}
                      />
                    )}
                    <span className="tray-category-name">{categoryName}</span>
                  </div>
                )}
                <code className="tray-command-code" onClick={() => handleCopy(cmd)}>
                  {cmd.content}
                </code>
                <button
                  className={`tray-copy-btn ${copiedId === cmd.id ? 'copied' : ''}`}
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
            )
          })
        )}
      </div>

      <div className="tray-separator"></div>

      <button className="tray-quit-btn" onClick={handleQuit}>
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        <span>Quit Vaul</span>
      </button>
    </div>
  )
}

export default TrayApp

