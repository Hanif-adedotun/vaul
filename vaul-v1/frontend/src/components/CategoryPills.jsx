import { useMemo } from 'react'

function CategoryPills({ activeCategory, onCategoryChange, onManageCategories, categories = [], commands = [], onDeleteCategory }) {

  const commandCounts = useMemo(() => {
    const counts = { '': 0 }
    if (Array.isArray(commands)) {
      commands.forEach(cmd => {
        const catId = cmd.category || ''
        counts[catId] = (counts[catId] || 0) + 1
      })
    }
    return counts
  }, [commands])

  const handleCategoryClick = (categoryId) => {
    onCategoryChange(categoryId === activeCategory ? null : categoryId)
  }

  const handleDelete = (e, id) => {
    e.stopPropagation()
    console.log('Delete button clicked for id:', id)
    onDeleteCategory(id)
  }

  const allCount = Object.values(commandCounts).reduce((sum, count) => sum + count, 0)

  return (
    <div className="category-pills">
      <div
        className={`category-pill ${activeCategory === null ? 'active' : ''}`}
        onClick={() => handleCategoryClick(null)}
        role="button"
        tabIndex={0}
      >
        <span className="category-pill-name">All</span>
        {allCount > 0 && (
          <span className="category-pill-count">{allCount}</span>
        )}
      </div>

      {categories.map((cat) => {
        const count = commandCounts[cat.id] || 0
        return (
          <div
            key={cat.id}
            className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => handleCategoryClick(cat.id)}
            role="button"
            tabIndex={0}
          >
            {onDeleteCategory && (
              <button
                className="delete-btn"
                onClick={(e) => handleDelete(e, cat.id)}
                title="Delete category"
              >
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
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
          </div>
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

