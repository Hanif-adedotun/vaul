package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"time"
)

// Command represents a stored terminal command
type Command struct {
	ID        string    `json:"id"`
	Content   string    `json:"content"`
	Category  string    `json:"category,omitempty"` // Empty string = uncategorized (backward compatible)
	Alias     string    `json:"alias,omitempty"`    // Optional alias for CLI access
	CreatedAt time.Time `json:"createdAt"`
}

// Category represents a command category
type Category struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Color     string    `json:"color,omitempty"` // Optional hex color
	CreatedAt time.Time `json:"createdAt"`
}

// UpdateCallback is a function type for notifying about command updates
type UpdateCallback func()

// CommandService handles storing and retrieving commands
type CommandService struct {
	commands       []Command
	categories     []Category
	filePath       string
	categoriesPath string
	updateCallback UpdateCallback
}

// SetUpdateCallback sets a callback function to be called when commands are updated
func (cs *CommandService) SetUpdateCallback(callback UpdateCallback) {
	cs.updateCallback = callback
}

// emitUpdate calls the update callback if set
func (cs *CommandService) emitUpdate() {
	if cs.updateCallback != nil {
		cs.updateCallback()
	}
}

// NewCommandService creates a new CommandService instance
func NewCommandService() *CommandService {
	cs := &CommandService{}
	cs.initFilePath()
	cs.loadCommands()
	cs.loadCategories()
	return cs
}

// initFilePath sets up the storage file path in user's config directory
func (cs *CommandService) initFilePath() {
	configDir, err := os.UserConfigDir()
	if err != nil {
		configDir = "."
	}

	vaulDir := filepath.Join(configDir, "vaul")
	if err := os.MkdirAll(vaulDir, 0755); err != nil {
		cs.filePath = "commands.json"
		cs.categoriesPath = "categories.json"
		return
	}

	cs.filePath = filepath.Join(vaulDir, "commands.json")
	cs.categoriesPath = filepath.Join(vaulDir, "categories.json")
}

// loadCommands loads commands from the JSON file
// Ensures backward compatibility by setting empty category for commands without it
func (cs *CommandService) loadCommands() {
	data, err := os.ReadFile(cs.filePath)
	if err != nil {
		cs.commands = []Command{}
		return
	}

	var commands []Command
	if err := json.Unmarshal(data, &commands); err != nil {
		cs.commands = []Command{}
		return
	}

	// Ensure backward compatibility: Category field will be empty string if not present (due to omitempty)
	// This is fine - empty string means uncategorized
	cs.commands = commands
}

// saveCommands saves commands to the JSON file
func (cs *CommandService) saveCommands() error {
	data, err := json.MarshalIndent(cs.commands, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(cs.filePath, data, 0644)
}

// loadCategories loads categories from the JSON file
func (cs *CommandService) loadCategories() {
	if cs.categoriesPath == "" {
		cs.categories = []Category{}
		return
	}

	data, err := os.ReadFile(cs.categoriesPath)
	if err != nil {
		cs.categories = []Category{}
		return
	}

	if err := json.Unmarshal(data, &cs.categories); err != nil {
		cs.categories = []Category{}
	}
}

// saveCategories saves categories to the JSON file
func (cs *CommandService) saveCategories() error {
	data, err := json.MarshalIndent(cs.categories, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(cs.categoriesPath, data, 0644)
}

// AddCommand adds a new command to storage
func (cs *CommandService) AddCommand(content string) (Command, error) {
	return cs.AddCommandWithCategory(content, "")
}

// AddCommandWithCategory adds a new command with a category to storage
func (cs *CommandService) AddCommandWithCategory(content string, category string) (Command, error) {
	return cs.AddCommandWithCategoryAndAlias(content, category, "")
}

// AddCommandWithCategoryAndAlias adds a new command with category and alias
func (cs *CommandService) AddCommandWithCategoryAndAlias(content string, category string, alias string) (Command, error) {
	// Validate alias uniqueness if provided
	if alias != "" && !cs.ValidateAlias(alias, "") {
		return Command{}, fmt.Errorf("alias '%s' already exists", alias)
	}

	cmd := Command{
		ID:        generateID(),
		Content:   content,
		Category:  category,
		Alias:     alias,
		CreatedAt: time.Now(),
	}

	cs.commands = append([]Command{cmd}, cs.commands...)

	if err := cs.saveCommands(); err != nil {
		return Command{}, err
	}

	cs.emitUpdate()
	return cmd, nil
}

// GetCommands returns all stored commands
func (cs *CommandService) GetCommands() []Command {
	return cs.commands
}

// DeleteCommand removes a command by ID
func (cs *CommandService) DeleteCommand(id string) error {
	for i, cmd := range cs.commands {
		if cmd.ID == id {
			cs.commands = append(cs.commands[:i], cs.commands[i+1:]...)
			if err := cs.saveCommands(); err != nil {
				return err
			}
			cs.emitUpdate()
			return nil
		}
	}
	return nil
}

// generateID creates a simple unique ID based on timestamp
func generateID() string {
	return time.Now().Format("20060102150405.000000000")
}

// UpdateCommandCategory updates the category of an existing command
func (cs *CommandService) UpdateCommandCategory(id string, category string) error {
	for i := range cs.commands {
		if cs.commands[i].ID == id {
			cs.commands[i].Category = category
			if err := cs.saveCommands(); err != nil {
				return err
			}
			cs.emitUpdate()
			return nil
		}
	}
	return nil
}

// GetCommandByAlias retrieves a command by its alias
func (cs *CommandService) GetCommandByAlias(alias string) (Command, error) {
	for _, cmd := range cs.commands {
		if cmd.Alias == alias {
			return cmd, nil
		}
	}
	return Command{}, fmt.Errorf("command with alias '%s' not found", alias)
}

// UpdateCommand updates an existing command's content, category, and alias
func (cs *CommandService) UpdateCommand(id string, content string, category string, alias string) error {
	for i, cmd := range cs.commands {
		if cmd.ID == id {
			// Validate alias uniqueness (if provided and not empty, and different from current)
			if alias != "" && alias != cmd.Alias {
				if !cs.ValidateAlias(alias, id) {
					return fmt.Errorf("alias '%s' already exists", alias)
				}
			}
			cs.commands[i].Content = content
			cs.commands[i].Category = category
			cs.commands[i].Alias = alias
			if err := cs.saveCommands(); err != nil {
				return err
			}
			cs.emitUpdate()
			return nil
		}
	}
	return fmt.Errorf("command with id '%s' not found", id)
}

// ValidateAlias checks if an alias is unique (excluding the given command ID)
func (cs *CommandService) ValidateAlias(alias string, excludeID string) bool {
	if alias == "" {
		return true // Empty alias is always valid
	}
	for _, cmd := range cs.commands {
		if cmd.Alias == alias && cmd.ID != excludeID {
			return false
		}
	}
	return true
}

// GetCategories returns all categories
func (cs *CommandService) GetCategories() []Category {
	return cs.categories
}

// CreateCategory creates a new category
func (cs *CommandService) CreateCategory(name string, color string) (Category, error) {
	// Check if category with same name already exists
	for _, cat := range cs.categories {
		if cat.Name == name {
			return cat, nil // Return existing category
		}
	}

	cat := Category{
		ID:        generateID(),
		Name:      name,
		Color:     color,
		CreatedAt: time.Now(),
	}

	cs.categories = append(cs.categories, cat)

	if err := cs.saveCategories(); err != nil {
		return Category{}, err
	}

	cs.emitUpdate()
	return cat, nil
}

// UpdateCategory updates an existing category
func (cs *CommandService) UpdateCategory(id string, name string, color string) error {
	for i := range cs.categories {
		if cs.categories[i].ID == id {
			cs.categories[i].Name = name
			cs.categories[i].Color = color
			if err := cs.saveCategories(); err != nil {
				return err
			}
			cs.emitUpdate()
			return nil
		}
	}
	return nil
}

// DeleteCategory deletes a category and optionally reassigns its commands
func (cs *CommandService) DeleteCategory(id string, reassignToCategory string) error {
	// Find and remove category
	categoryIndex := -1
	for i, cat := range cs.categories {
		if cat.ID == id {
			categoryIndex = i
			break
		}
	}

	if categoryIndex == -1 {
		return nil // Category doesn't exist
	}

	// Reassign commands from deleted category
	for i := range cs.commands {
		if cs.commands[i].Category == id {
			cs.commands[i].Category = reassignToCategory
		}
	}

	// Remove category
	cs.categories = append(cs.categories[:categoryIndex], cs.categories[categoryIndex+1:]...)

	if err := cs.saveCategories(); err != nil {
		return err
	}

	if err := cs.saveCommands(); err != nil {
		return err
	}

	cs.emitUpdate()
	return nil
}

// MergeCategories merges two categories, moving all commands from source to target
func (cs *CommandService) MergeCategories(sourceID string, targetID string) error {
	// Move all commands from source to target
	for i := range cs.commands {
		if cs.commands[i].Category == sourceID {
			cs.commands[i].Category = targetID
		}
	}

	// Delete source category
	return cs.DeleteCategory(sourceID, targetID)
}

// GetCommandsByCategory returns commands filtered by category (empty string = uncategorized)
func (cs *CommandService) GetCommandsByCategory(categoryID string) []Command {
	if categoryID == "" {
		// Return uncategorized commands
		var result []Command
		for _, cmd := range cs.commands {
			if cmd.Category == "" {
				result = append(result, cmd)
			}
		}
		return result
	}

	var result []Command
	for _, cmd := range cs.commands {
		if cmd.Category == categoryID {
			result = append(result, cmd)
		}
	}
	return result
}

// setFilePath sets the file path for testing purposes
func (cs *CommandService) setFilePath(path string) {
	cs.filePath = path
	cs.categoriesPath = filepath.Join(filepath.Dir(path), "categories.json")
}
