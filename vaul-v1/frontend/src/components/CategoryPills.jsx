import { useState, useEffect } from 'react'
import { CommandService } from "../../bindings/changeme"

function CategoryPills({ activeCategory, onCategoryChange, onManageCategories }) {
  const [categories, setCategories] = useState([])
  const [commandCounts, setCommandCounts] = useState({})

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [cats, commands] = await Promise.all([
        CommandService.GetCategories(),
        CommandService.GetCommands()
      ])
      
      setCategories(cats || [])
      
      // Count commands per category
      const counts = { '': 0 }
      commands.forEach(cmd => {
        const catId = cmd.category || ''
        counts[catId] = (counts[catId] || 0) + 1
      })
      setCommandCounts(counts)
    } catch (err) {
      console.error('Failed to load categories:', err)
    }
  }

  const handleCategoryClick = (categoryId) => {
    onCategoryChange(categoryId === activeCategory ? null : categoryId)
  }

  const allCount = Object.values(commandCounts).reduce((sum, count) => sum + count, 0)

  return (
    <div className="category-pills">
      <button
        className={`category-pill ${activeCategory === null ? 'active' : ''}`}
        onClick={() => handleCategoryClick(null)}
      >
        <span className="category-pill-name">All</span>
        {allCount > 0 && (
          <span className="category-pill-count">{allCount}</span>
        )}
      </button>

      {categories.map((cat) => {
        const count = commandCounts[cat.id] || 0
        return (
          <button
            key={cat.id}
            className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => handleCategoryClick(cat.id)}
          >
            {cat.color && (
              <span 
                className="category-pill-color" 
                style={{ backgroundColor: cat.color }}
              />
            )}
            <span className="category-pill-name">{cat.name}</span>
            {count > 0 && (
              <span className="category-pill-count">{count}</span>
            )}
          </button>
        )
      })}

      {commandCounts[''] > 0 && (
        <button
          className={`category-pill ${activeCategory === '' ? 'active' : ''}`}
          onClick={() => handleCategoryClick('')}
        >
          <span className="category-pill-name">Uncategorized</span>
          <span className="category-pill-count">{commandCounts['']}</span>
        </button>
      )}

      {onManageCategories && (
        <button
          className="category-pill add"
          onClick={onManageCategories}
          title="Create new category"
        >
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      )}
    </div>
  )
}

export default CategoryPills

