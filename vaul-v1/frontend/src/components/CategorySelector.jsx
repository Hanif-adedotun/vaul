import { useState, useEffect, useRef } from 'react'

function CategorySelector({ value, onChange, categories = [] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (categoryId) => {
    onChange(categoryId)
    setIsOpen(false)
    setSearchTerm('')
  }


  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedCategory = categories.find(cat => cat.id === value)
  const displayText = selectedCategory ? selectedCategory.name : value === '' ? 'Uncategorized' : 'Select category'

  return (
    <div className="category-selector" ref={dropdownRef}>
      <button
        type="button"
        className="category-selector-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="category-selector-text">{displayText}</span>
        <svg
          className={`category-selector-arrow ${isOpen ? 'open' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="category-selector-dropdown">
          <div className="category-selector-search">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          <div className="category-selector-list">
            <button
              className={`category-selector-item ${value === '' ? 'active' : ''}`}
              onClick={() => handleSelect('')}
            >
              <span>Uncategorized</span>
            </button>

            {filteredCategories.map((cat) => (
              <button
                key={cat.id}
                className={`category-selector-item ${value === cat.id ? 'active' : ''}`}
                onClick={() => handleSelect(cat.id)}
              >
                {cat.color && (
                  <span
                    className="category-color-dot"
                    style={{ backgroundColor: cat.color }}
                  />
                )}
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CategorySelector

