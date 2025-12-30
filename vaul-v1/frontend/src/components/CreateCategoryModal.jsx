import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { CommandService } from "../../bindings/changeme"

function CreateCategoryModal({ onClose, onCategoryCreated }) {
  const [categoryName, setCategoryName] = useState('')
  const [categoryColor, setCategoryColor] = useState('#78b4ff')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const trimmedName = categoryName.trim()
    if (!trimmedName) {
      setError('Category name is required')
      return
    }

    setError('')
    setIsCreating(true)
    try {
      const newCat = await CommandService.CreateCategory(trimmedName, categoryColor)
      if (newCat && newCat.id) {
        onCategoryCreated(newCat.id)
      } else {
        setError('Failed to create category: Invalid response')
        setIsCreating(false)
      }
    } catch (err) {
      const errorMsg = err?.message || err?.toString() || 'Unknown error'
      console.error('Failed to create category:', err)
      setError(`Failed to create category: ${errorMsg}`)
      setIsCreating(false)
    }
  }

  const modalContent = (
    <div className="create-category-overlay" onClick={onClose}>
      <div className="create-category-modal" onClick={(e) => e.stopPropagation()}>
        <div className="create-category-header">
          <h3>Create New Category</h3>
          <button
            type="button"
            className="create-category-close"
            onClick={onClose}
            disabled={isCreating}
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-category-form">
          {error && (
            <div className="create-category-error">
              {error}
            </div>
          )}
          
          <div className="create-category-field">
            <label>Category Name</label>
            <input
              type="text"
              placeholder="Enter category name..."
              value={categoryName}
              onChange={(e) => {
                setCategoryName(e.target.value)
                setError('')
              }}
              autoFocus
              disabled={isCreating}
              required
            />
          </div>

          <div className="create-category-field">
            <label>Color (Optional)</label>
            <input
              type="color"
              value={categoryColor}
              onChange={(e) => setCategoryColor(e.target.value)}
              disabled={isCreating}
            />
          </div>

          <div className="create-category-actions">
            <button
              type="button"
              className="create-category-btn cancel"
              onClick={onClose}
              disabled={isCreating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="create-category-btn create"
              disabled={!categoryName.trim() || isCreating}
            >
              {isCreating ? 'Creating...' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default CreateCategoryModal
