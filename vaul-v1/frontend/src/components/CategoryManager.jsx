import { useState, useEffect } from 'react'
import { CommandService } from "../../bindings/changeme"

function CategoryManager({ onUpdate }) {
  const [categories, setCategories] = useState([])
  const [commands, setCommands] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [mergeTarget, setMergeTarget] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [cats, cmds] = await Promise.all([
        CommandService.GetCategories(),
        CommandService.GetCommands()
      ])
      setCategories(cats || [])
      setCommands(cmds || [])
    } catch (err) {
      console.error('Failed to load data:', err)
    }
  }

  const getCommandCount = (categoryId) => {
    return commands.filter(cmd => (cmd.category || '') === categoryId).length
  }

  const handleEdit = (category) => {
    setEditingId(category.id)
    setEditName(category.name)
    setEditColor(category.color || '')
  }

  const handleSaveEdit = async () => {
    if (!editName.trim()) return

    try {
      await CommandService.UpdateCategory(editingId, editName.trim(), editColor)
      setEditingId(null)
      setEditName('')
      setEditColor('')
      await loadData()
      if (onUpdate) onUpdate()
    } catch (err) {
      console.error('Failed to update category:', err)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setEditColor('')
  }

  const handleDelete = async (categoryId) => {
    try {
      await CommandService.DeleteCategory(categoryId, '') // Reassign to uncategorized
      setShowDeleteConfirm(null)
      await loadData()
      if (onUpdate) onUpdate()
    } catch (err) {
      console.error('Failed to delete category:', err)
    }
  }

  const handleMerge = async (sourceId, targetId) => {
    try {
      await CommandService.MergeCategories(sourceId, targetId)
      setMergeTarget(null)
      await loadData()
      if (onUpdate) onUpdate()
    } catch (err) {
      console.error('Failed to merge categories:', err)
    }
  }

  return (
    <div className="category-manager">
      <h3 className="category-manager-title">Manage Categories</h3>
      
      {categories.length === 0 ? (
        <div className="category-manager-empty">
          <p>No categories yet. Create one when adding a command!</p>
        </div>
      ) : (
        <div className="category-manager-list">
          {categories.map((cat) => {
            const count = getCommandCount(cat.id)
            const isEditing = editingId === cat.id

            return (
              <div key={cat.id} className="category-manager-item">
                {isEditing ? (
                  <div className="category-manager-edit">
                    <input
                      type="text"
                      className="category-manager-edit-input"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Category name..."
                      autoFocus
                    />
                    <input
                      type="color"
                      className="category-manager-edit-color"
                      value={editColor || '#78b4ff'}
                      onChange={(e) => setEditColor(e.target.value)}
                      title="Category color"
                    />
                    <button
                      className="category-manager-btn save"
                      onClick={handleSaveEdit}
                      title="Save"
                    >
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </button>
                    <button
                      className="category-manager-btn cancel"
                      onClick={handleCancelEdit}
                      title="Cancel"
                    >
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="category-manager-info">
                      {cat.color && (
                        <span 
                          className="category-manager-color" 
                          style={{ backgroundColor: cat.color }}
                        />
                      )}
                      <span className="category-manager-name">{cat.name}</span>
                      <span className="category-manager-count">{count} {count === 1 ? 'command' : 'commands'}</span>
                    </div>
                    <div className="category-manager-actions">
                      <button
                        className="category-manager-btn edit"
                        onClick={() => handleEdit(cat)}
                        title="Edit category"
                      >
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      {mergeTarget === cat.id ? (
                        <>
                          <span className="category-manager-merge-text">Merge into:</span>
                          {categories.filter(c => c.id !== cat.id).map(target => (
                            <button
                              key={target.id}
                              className="category-manager-btn merge"
                              onClick={() => handleMerge(cat.id, target.id)}
                              title={`Merge into ${target.name}`}
                            >
                              {target.name}
                            </button>
                          ))}
                          <button
                            className="category-manager-btn cancel"
                            onClick={() => setMergeTarget(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="category-manager-btn merge"
                            onClick={() => setMergeTarget(cat.id)}
                            title="Merge category"
                          >
                            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                            </svg>
                          </button>
                          {showDeleteConfirm === cat.id ? (
                            <div className="category-manager-delete-confirm">
                              <span>Delete?</span>
                              <button
                                className="category-manager-btn delete confirm"
                                onClick={() => handleDelete(cat.id)}
                              >
                                Yes
                              </button>
                              <button
                                className="category-manager-btn cancel"
                                onClick={() => setShowDeleteConfirm(null)}
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              className="category-manager-btn delete"
                              onClick={() => setShowDeleteConfirm(cat.id)}
                              title="Delete category"
                            >
                              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CategoryManager

