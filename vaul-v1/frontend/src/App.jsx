import { useState, useEffect } from 'react'
import { CommandService } from "../bindings/changeme"
import { Events } from "@wailsio/runtime"
import Fuse from 'fuse.js'
import CategorySelector from './components/CategorySelector'
import CategoryPills from './components/CategoryPills'
import CreateCategoryModal from './components/CreateCategoryModal'

function App() {
  const [commands, setCommands] = useState([])
  const [categories, setCategories] = useState([])
  const [filteredCommands, setFilteredCommands] = useState([])
  const [groupedCommands, setGroupedCommands] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(null) // null = all, '' = uncategorized, id = specific category
  const [inputValue, setInputValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('') // For new command input
  const [copiedId, setCopiedId] = useState(null)
  const [collapsedCategories, setCollapsedCategories] = useState(new Set())
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false)

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
      const [cmds, cats] = await Promise.all([
        CommandService.GetCommands(),
        CommandService.GetCategories()
      ])
      setCommands(cmds || [])
      setCategories(cats || [])
    } catch (err) {
      console.error('Failed to load commands:', err)
    }
  }

  // Group commands by category
  const groupCommandsByCategory = (cmds) => {
    const grouped = {}
    cmds.forEach(cmd => {
      const catId = cmd.category || ''
      if (!grouped[catId]) {
        grouped[catId] = []
      }
      grouped[catId].push(cmd)
    })
    return grouped
  }

  // Filter and group commands based on search query and active category
  useEffect(() => {
    let filtered = commands

    // Apply category filter
    if (activeCategory !== null) {
      filtered = filtered.filter(cmd => (cmd.category || '') === activeCategory)
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const fuse = new Fuse(filtered, {
        keys: ['content'],
        threshold: 0.3,
        includeScore: true,
        minMatchCharLength: 1,
      })
      
      const results = fuse.search(searchQuery)
      filtered = results.map(result => result.item)
    }

    setFilteredCommands(filtered)
    setGroupedCommands(groupCommandsByCategory(filtered))
  }, [searchQuery, commands, activeCategory])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmedInput = inputValue.trim()
    
    if (!trimmedInput) return

    try {
      if (selectedCategory) {
        await CommandService.AddCommandWithCategory(trimmedInput, selectedCategory)
      } else {
        await CommandService.AddCommand(trimmedInput)
      }
      setInputValue('')
      loadCommands()
    } catch (err) {
      console.error('Failed to add command:', err)
    }
  }


  const toggleCategory = (categoryId) => {
    const newCollapsed = new Set(collapsedCategories)
    if (newCollapsed.has(categoryId)) {
      newCollapsed.delete(categoryId)
    } else {
      newCollapsed.add(categoryId)
    }
    setCollapsedCategories(newCollapsed)
  }

  const getCategoryName = (categoryId) => {
    if (categoryId === '') return 'Uncategorized'
    const cat = categories.find(c => c.id === categoryId)
    return cat ? cat.name : 'Unknown'
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

      {commands.length > 0 && (
        <CategoryPills 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onManageCategories={() => setShowCreateCategoryModal(true)}
        />
      )}

      {showCreateCategoryModal && (
        <CreateCategoryModal
          onClose={() => setShowCreateCategoryModal(false)}
          onCategoryCreated={(categoryId) => {
            setSelectedCategory(categoryId)
            setShowCreateCategoryModal(false)
            loadCommands()
          }}
        />
      )}

      <form onSubmit={handleSubmit} className="command-input-form">
        <div className="command-input-row">
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
          <CategorySelector
            value={selectedCategory}
            onChange={setSelectedCategory}
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
          Object.entries(groupedCommands).map(([categoryId, categoryCommands]) => {
            const categoryName = getCategoryName(categoryId)
            const isCollapsed = collapsedCategories.has(categoryId)
            const category = categories.find(c => c.id === categoryId)

            return (
              <div key={categoryId} className="category-section">
                <button
                  className="category-header"
                  onClick={() => toggleCategory(categoryId)}
                >
                  <svg 
                    className={`category-chevron ${isCollapsed ? 'collapsed' : ''}`}
                    viewBox="0 0 24 24" 
                    fill="none" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                  {category?.color && (
                    <span 
                      className="category-header-color" 
                      style={{ backgroundColor: category.color }}
                    />
                  )}
                  <span className="category-header-name">{categoryName}</span>
                  <span className="category-header-count">({categoryCommands.length})</span>
                </button>

                {!isCollapsed && (
                  <div className="category-commands">
                    {categoryCommands.map((cmd) => (
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
                    ))}
                  </div>
                )}
              </div>
            )
          })
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
