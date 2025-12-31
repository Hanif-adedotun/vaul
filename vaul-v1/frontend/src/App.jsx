import { useState, useEffect } from 'react'
import { CommandService, AppService } from "../bindings/changeme"
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
  const [aliasInput, setAliasInput] = useState('') // For alias input
  const [selectedCategory, setSelectedCategory] = useState('') // For new command input
  const [copiedId, setCopiedId] = useState(null)
  const [collapsedCategories, setCollapsedCategories] = useState(new Set())
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false)
  const [symlinkMessage, setSymlinkMessage] = useState(null)
  const [isCreatingSymlink, setIsCreatingSymlink] = useState(false)
  const [symlinkExists, setSymlinkExists] = useState(false)
  const [editingAlias, setEditingAlias] = useState({}) // Track which command's alias is being edited

  // Load commands on mount and set up event listener
  useEffect(() => {
    loadCommands()
    checkSymlinkExists()

    // Listen for command update events
    Events.On('commands-updated', () => {
      loadCommands()
    })
  }, [])

  const checkSymlinkExists = async () => {
    try {
      const exists = await AppService.SymlinkExists()
      setSymlinkExists(exists)
    } catch (err) {
      console.error('Failed to check symlink:', err)
      setSymlinkExists(false)
    }
  }

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
        keys: ['content', 'alias'],
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
    const trimmedAlias = aliasInput.trim()

    if (!trimmedInput) return

    try {
      if (selectedCategory) {
        await CommandService.AddCommandWithCategoryAndAlias(trimmedInput, selectedCategory, trimmedAlias || "")
      } else {
        await CommandService.AddCommandWithCategoryAndAlias(trimmedInput, "", trimmedAlias || "")
      }
      setInputValue('')
      setAliasInput('')
      loadCommands()
    } catch (err) {
      console.error('Failed to add command:', err)
      alert(err.message || 'Failed to add command')
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

  const handleUpdateAlias = async (id, newAlias) => {
    try {
      const cmd = commands.find(c => c.id === id)
      if (cmd) {
        await CommandService.UpdateCommand(id, cmd.content, cmd.category || "", newAlias.trim())
        setEditingAlias({ ...editingAlias, [id]: false })
        loadCommands()
      }
    } catch (err) {
      console.error('Failed to update alias:', err)
      alert(err.message || 'Failed to update alias')
    }
  }

  const handleCreateSymlink = async () => {
    setIsCreatingSymlink(true)
    setSymlinkMessage(null)
    try {
      const message = await AppService.CreateSymlink()
      setSymlinkMessage({ type: 'success', text: message })
      setTimeout(() => setSymlinkMessage(null), 10000) // Hide after 10 seconds
      // Check if symlink was created successfully
      await checkSymlinkExists()
    } catch (err) {
      setSymlinkMessage({ type: 'error', text: err.message || 'Failed to create symlink' })
    } finally {
      setIsCreatingSymlink(false)
    }
  }

  const handleDeleteCategory = async (id) => {
    console.log('handleDeleteCategory called for id:', id)
    try {
      // Reassign to uncategorized ("")
      console.log('Calling CommandService.DeleteCategory')
      await CommandService.DeleteCategory(id, "")
      console.log('DeleteCategory success')
      if (activeCategory === id) {
        setActiveCategory(null)
      }
      loadCommands()
    } catch (err) {
      console.error('Failed to delete category:', err)
      alert(err.message || 'Failed to delete category')
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
          categories={categories}
          commands={commands}
          onDeleteCategory={handleDeleteCategory}
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              autoFocus
            />
          </div>
          <div className="glass-input-container">
            <input
              type="text"
              className="command-input"
              style={{ width: "180px" }}
              placeholder="Alias (optional)"
              value={aliasInput}
              onChange={(e) => setAliasInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
          </div>
          <CategorySelector
            value={selectedCategory}
            onChange={setSelectedCategory}
            categories={categories}
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
                          {cmd.alias && !editingAlias[cmd.id] && (
                            <span
                              className="alias-tag"
                              onClick={() => setEditingAlias({ ...editingAlias, [cmd.id]: true })}
                              title="Click to edit alias"
                            >
                              <span className="alias-tag-at">@</span>
                              {cmd.alias}
                            </span>
                          )}
                          {editingAlias[cmd.id] && (
                            <div className="glass-input-container" style={{ flex: '0 0 auto', minWidth: '100px' }}>
                              <input
                                type="text"
                                className="command-input"
                                defaultValue={cmd.alias || ""}
                                placeholder="alias"
                                onBlur={(e) => {
                                  handleUpdateAlias(cmd.id, e.target.value)
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.target.blur()
                                  } else if (e.key === 'Escape') {
                                    setEditingAlias({ ...editingAlias, [cmd.id]: false })
                                  }
                                }}
                                autoFocus
                                style={{ fontSize: '12px', padding: '8px 12px' }}
                              />
                            </div>
                          )}
                          <code className="command-code">{cmd.content}</code>
                          <div className="command-actions">
                            {!cmd.alias && !editingAlias[cmd.id] && (
                              <button
                                className="edit-alias-btn"
                                onClick={() => setEditingAlias({ ...editingAlias, [cmd.id]: true })}
                                title="Add alias"
                              >
                                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                              </button>
                            )}
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      <footer className="vaul-footer">
        <div className="footer-left">
          {commands.length > 0 && (
            <span className="command-count">
              {filteredCommands.length === commands.length
                ? `${commands.length} ${commands.length === 1 ? 'command' : 'commands'} stored`
                : `${filteredCommands.length} of ${commands.length} ${commands.length === 1 ? 'command' : 'commands'}`
              }
            </span>
          )}
          {commands.some(cmd => cmd.alias) && (
            <div className="cli-hint">
              <svg className="cli-hint-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span className="cli-hint-text">Use <code>vaul &lt;alias&gt;</code> in terminal to run commands</span>
            </div>
          )}
        </div>
        {!symlinkExists && (
          <div className="footer-right">
            <button
              className="symlink-btn"
              onClick={handleCreateSymlink}
              disabled={isCreatingSymlink}
              title="Create symlink so you can use 'vaul' command from anywhere"
            >
              {isCreatingSymlink ? 'Creating...' : '🔗 Setup CLI'}
            </button>
          </div>
        )}
        {symlinkMessage && (
          <div className={`symlink-message ${symlinkMessage.type || 'info'}`}>
            {symlinkMessage.text}
            <button className="symlink-close" onClick={() => setSymlinkMessage(null)}>×</button>
          </div>
        )}
      </footer>
    </div>
  )
}

export default App
