package main

import (
	"encoding/json"
	"os"
	"path/filepath"
	"testing"
	"time"
)

// newTestCommandService creates a CommandService for testing with a temporary file
func newTestCommandService(t *testing.T) *CommandService {
	tmpDir := t.TempDir()
	filePath := filepath.Join(tmpDir, "commands.json")
	categoriesPath := filepath.Join(tmpDir, "categories.json")

	cs := &CommandService{
		commands:       []Command{},
		categories:     []Category{},
		filePath:       filePath,
		categoriesPath: categoriesPath,
	}

	return cs
}

// TestCreateCategoryBasic tests basic category creation
func TestCreateCategoryBasic(t *testing.T) {
	cs := newTestCommandService(t)

	categoryName := "TestCategory"
	categoryColor := "#ff0000"

	cat, err := cs.CreateCategory(categoryName, categoryColor)
	if err != nil {
		t.Fatalf("CreateCategory() returned error: %v", err)
	}

	if cat.Name != categoryName {
		t.Errorf("Expected category name %s, got %s", categoryName, cat.Name)
	}

	if cat.Color != categoryColor {
		t.Errorf("Expected category color %s, got %s", categoryColor, cat.Color)
	}

	if cat.ID == "" {
		t.Error("Category ID should not be empty")
	}

	if len(cs.categories) != 1 {
		t.Errorf("Expected 1 category, got %d", len(cs.categories))
	}
}

// TestCreateCategoryEmptyName tests creating category with empty name
func TestCreateCategoryEmptyName(t *testing.T) {
	cs := newTestCommandService(t)

	// CreateCategory should handle empty name (though UI should prevent this)
	cat, err := cs.CreateCategory("", "#ff0000")
	if err != nil {
		t.Fatalf("CreateCategory() should not return error for empty name, got: %v", err)
	}

	// Should still create a category (service doesn't validate)
	if cat.Name != "" {
		t.Errorf("Expected empty name, got %s", cat.Name)
	}
}

// TestNewCommandService tests the creation of a new CommandService
func TestNewCommandService(t *testing.T) {
	cs := NewCommandService()

	if cs == nil {
		t.Fatal("NewCommandService() returned nil")
	}

	if cs.commands == nil {
		t.Error("commands slice should be initialized")
	}

	if cs.filePath == "" {
		t.Error("filePath should be set")
	}
}

// TestAddCommand tests adding a new command
func TestAddCommand(t *testing.T) {
	cs := newTestCommandService(t)

	testContent := "git commit -m 'test'"
	cmd, err := cs.AddCommand(testContent)

	if err != nil {
		t.Fatalf("AddCommand() returned error: %v", err)
	}

	if cmd.Content != testContent {
		t.Errorf("Expected content %s, got %s", testContent, cmd.Content)
	}

	if cmd.ID == "" {
		t.Error("Command ID should not be empty")
	}

	if cmd.CreatedAt.IsZero() {
		t.Error("CreatedAt should be set")
	}

	// Verify command was added to the list
	if len(cs.commands) != 1 {
		t.Errorf("Expected 1 command, got %d", len(cs.commands))
	}

	if cs.commands[0].Content != testContent {
		t.Errorf("Expected first command content %s, got %s", testContent, cs.commands[0].Content)
	}

	// Verify command was saved to file
	data, err := os.ReadFile(cs.filePath)
	if err != nil {
		t.Fatalf("Failed to read saved file: %v", err)
	}

	var savedCommands []Command
	if err := json.Unmarshal(data, &savedCommands); err != nil {
		t.Fatalf("Failed to unmarshal saved commands: %v", err)
	}

	if len(savedCommands) != 1 {
		t.Errorf("Expected 1 saved command, got %d", len(savedCommands))
	}

	if savedCommands[0].Content != testContent {
		t.Errorf("Expected saved command content %s, got %s", testContent, savedCommands[0].Content)
	}
}

// TestAddCommandMultiple tests adding multiple commands
func TestAddCommandMultiple(t *testing.T) {
	cs := newTestCommandService(t)

	commands := []string{
		"git status",
		"npm install",
		"docker ps",
	}

	for _, content := range commands {
		_, err := cs.AddCommand(content)
		if err != nil {
			t.Fatalf("AddCommand() returned error: %v", err)
		}
		// Small delay to ensure different timestamps
		time.Sleep(10 * time.Millisecond)
	}

	if len(cs.commands) != len(commands) {
		t.Errorf("Expected %d commands, got %d", len(commands), len(cs.commands))
	}

	// Commands should be in reverse order (newest first)
	for i, expectedContent := range commands {
		actualIndex := len(commands) - 1 - i
		if cs.commands[actualIndex].Content != expectedContent {
			t.Errorf("Expected command at index %d to be %s, got %s",
				actualIndex, expectedContent, cs.commands[actualIndex].Content)
		}
	}
}

// TestGetCommands tests retrieving all commands
func TestGetCommands(t *testing.T) {
	cs := newTestCommandService(t)

	// Initially should be empty
	commands := cs.GetCommands()
	if len(commands) != 0 {
		t.Errorf("Expected 0 commands initially, got %d", len(commands))
	}

	// Add some commands
	testCommands := []string{"cmd1", "cmd2", "cmd3"}
	for _, content := range testCommands {
		_, err := cs.AddCommand(content)
		if err != nil {
			t.Fatalf("AddCommand() returned error: %v", err)
		}
	}

	// Retrieve commands
	commands = cs.GetCommands()
	if len(commands) != len(testCommands) {
		t.Errorf("Expected %d commands, got %d", len(testCommands), len(commands))
	}
}

// TestDeleteCommand tests deleting a command
func TestDeleteCommand(t *testing.T) {
	cs := newTestCommandService(t)

	// Add commands
	cmd1, _ := cs.AddCommand("command 1")
	cmd2, _ := cs.AddCommand("command 2")
	cmd3, _ := cs.AddCommand("command 3")

	if len(cs.commands) != 3 {
		t.Fatalf("Expected 3 commands, got %d", len(cs.commands))
	}

	// Delete middle command
	err := cs.DeleteCommand(cmd2.ID)
	if err != nil {
		t.Fatalf("DeleteCommand() returned error: %v", err)
	}

	if len(cs.commands) != 2 {
		t.Errorf("Expected 2 commands after deletion, got %d", len(cs.commands))
	}

	// Verify correct commands remain
	foundCmd1 := false
	foundCmd3 := false
	for _, cmd := range cs.commands {
		if cmd.ID == cmd1.ID {
			foundCmd1 = true
		}
		if cmd.ID == cmd3.ID {
			foundCmd3 = true
		}
		if cmd.ID == cmd2.ID {
			t.Error("Deleted command should not be in the list")
		}
	}

	if !foundCmd1 || !foundCmd3 {
		t.Error("Expected commands should remain after deletion")
	}

	// Verify file was updated
	data, err := os.ReadFile(cs.filePath)
	if err != nil {
		t.Fatalf("Failed to read file after deletion: %v", err)
	}

	var savedCommands []Command
	if err := json.Unmarshal(data, &savedCommands); err != nil {
		t.Fatalf("Failed to unmarshal saved commands: %v", err)
	}

	if len(savedCommands) != 2 {
		t.Errorf("Expected 2 commands in file, got %d", len(savedCommands))
	}
}

// TestDeleteCommandNonExistent tests deleting a non-existent command
func TestDeleteCommandNonExistent(t *testing.T) {
	cs := newTestCommandService(t)

	// Try to delete non-existent command
	err := cs.DeleteCommand("non-existent-id")
	if err != nil {
		t.Errorf("DeleteCommand() should not return error for non-existent ID, got: %v", err)
	}
}

// TestLoadCommands tests loading commands from file
func TestLoadCommands(t *testing.T) {
	cs := newTestCommandService(t)

	// Add commands
	cs.AddCommand("saved command 1")
	cs.AddCommand("saved command 2")

	// Create a new service instance with the same file path (simulates app restart)
	cs2 := &CommandService{
		commands: []Command{},
		filePath: cs.filePath,
	}
	cs2.loadCommands()

	// Should load commands from file
	commands := cs2.GetCommands()
	if len(commands) != 2 {
		t.Errorf("Expected 2 loaded commands, got %d", len(commands))
	}

	if commands[0].Content != "saved command 2" {
		t.Errorf("Expected first command to be 'saved command 2', got %s", commands[0].Content)
	}

	if commands[1].Content != "saved command 1" {
		t.Errorf("Expected second command to be 'saved command 1', got %s", commands[1].Content)
	}
}

// TestLoadCommandsEmptyFile tests loading from non-existent file
func TestLoadCommandsEmptyFile(t *testing.T) {
	cs := newTestCommandService(t)

	// Remove the file to simulate non-existent file
	os.Remove(cs.filePath)

	// Should handle non-existent file gracefully
	cs.loadCommands()

	if cs.commands == nil {
		t.Error("commands should not be nil")
	}

	if len(cs.commands) != 0 {
		t.Errorf("Expected 0 commands for non-existent file, got %d", len(cs.commands))
	}
}

// TestLoadCommandsInvalidJSON tests loading invalid JSON
func TestLoadCommandsInvalidJSON(t *testing.T) {
	cs := newTestCommandService(t)

	// Write invalid JSON to file
	invalidJSON := []byte("{ invalid json }")
	if err := os.WriteFile(cs.filePath, invalidJSON, 0644); err != nil {
		t.Fatalf("Failed to write invalid JSON: %v", err)
	}

	// Reload should handle invalid JSON gracefully
	cs.loadCommands()

	// Should have empty commands array
	if len(cs.commands) != 0 {
		t.Errorf("Expected 0 commands after invalid JSON, got %d", len(cs.commands))
	}
}

// TestAddCommandEmptyContent tests adding empty content
func TestAddCommandEmptyContent(t *testing.T) {
	cs := newTestCommandService(t)

	// Add empty command (service doesn't validate, but we test it works)
	cmd, err := cs.AddCommand("")
	if err != nil {
		t.Fatalf("AddCommand() should accept empty content, got error: %v", err)
	}

	if cmd.Content != "" {
		t.Errorf("Expected empty content, got %s", cmd.Content)
	}
}

// TestCommandOrder tests that commands are stored in reverse chronological order
func TestCommandOrder(t *testing.T) {
	cs := newTestCommandService(t)

	// Add commands with delays
	cmd1, _ := cs.AddCommand("first")
	time.Sleep(10 * time.Millisecond)
	cmd2, _ := cs.AddCommand("second")
	time.Sleep(10 * time.Millisecond)
	cmd3, _ := cs.AddCommand("third")

	commands := cs.GetCommands()

	// Newest should be first
	if commands[0].ID != cmd3.ID {
		t.Error("Newest command should be first")
	}

	if commands[1].ID != cmd2.ID {
		t.Error("Second newest command should be second")
	}

	if commands[2].ID != cmd1.ID {
		t.Error("Oldest command should be last")
	}
}

// TestSaveCommandsError tests error handling in saveCommands
func TestSaveCommandsError(t *testing.T) {
	cs := newTestCommandService(t)

	// Set file path to an invalid location (directory instead of file)
	tmpDir := t.TempDir()
	cs.setFilePath(tmpDir) // This will cause an error when trying to write

	// Try to add a command - should fail on save
	_, err := cs.AddCommand("test")
	if err == nil {
		t.Error("AddCommand() should return error when save fails")
	}
}

// TestCreateCategory tests creating a new category
func TestCreateCategory(t *testing.T) {
	cs := newTestCommandService(t)

	categoryName := "Git"
	categoryColor := "#78b4ff"
	cat, err := cs.CreateCategory(categoryName, categoryColor)

	if err != nil {
		t.Fatalf("CreateCategory() returned error: %v", err)
	}

	if cat.Name != categoryName {
		t.Errorf("Expected category name %s, got %s", categoryName, cat.Name)
	}

	if cat.Color != categoryColor {
		t.Errorf("Expected category color %s, got %s", categoryColor, cat.Color)
	}

	if cat.ID == "" {
		t.Error("Category ID should not be empty")
	}

	if cat.CreatedAt.IsZero() {
		t.Error("CreatedAt should be set")
	}

	// Verify category was added to the list
	if len(cs.categories) != 1 {
		t.Errorf("Expected 1 category, got %d", len(cs.categories))
	}

	if cs.categories[0].Name != categoryName {
		t.Errorf("Expected first category name %s, got %s", categoryName, cs.categories[0].Name)
	}

	// Verify category was saved to file
	data, err := os.ReadFile(cs.categoriesPath)
	if err != nil {
		t.Fatalf("Failed to read saved file: %v", err)
	}

	var savedCategories []Category
	if err := json.Unmarshal(data, &savedCategories); err != nil {
		t.Fatalf("Failed to unmarshal saved categories: %v", err)
	}

	if len(savedCategories) != 1 {
		t.Errorf("Expected 1 saved category, got %d", len(savedCategories))
	}

	if savedCategories[0].Name != categoryName {
		t.Errorf("Expected saved category name %s, got %s", categoryName, savedCategories[0].Name)
	}
}

// TestCreateCategoryDuplicate tests creating a duplicate category (should return existing)
func TestCreateCategoryDuplicate(t *testing.T) {
	cs := newTestCommandService(t)

	categoryName := "Git"
	categoryColor := "#78b4ff"

	cat1, err1 := cs.CreateCategory(categoryName, categoryColor)
	if err1 != nil {
		t.Fatalf("CreateCategory() returned error: %v", err1)
	}

	// Try to create same category again
	cat2, err2 := cs.CreateCategory(categoryName, "#ff0000")
	if err2 != nil {
		t.Fatalf("CreateCategory() returned error: %v", err2)
	}

	// Should return the same category
	if cat1.ID != cat2.ID {
		t.Error("Creating duplicate category should return existing category")
	}

	// Should still only have one category
	if len(cs.categories) != 1 {
		t.Errorf("Expected 1 category, got %d", len(cs.categories))
	}
}

// TestGetCategories tests retrieving all categories
func TestGetCategories(t *testing.T) {
	cs := newTestCommandService(t)

	// Initially should be empty
	categories := cs.GetCategories()
	if len(categories) != 0 {
		t.Errorf("Expected 0 categories initially, got %d", len(categories))
	}

	// Add some categories
	cs.CreateCategory("Git", "#78b4ff")
	cs.CreateCategory("Docker", "#0db7ed")
	cs.CreateCategory("npm", "#cb3837")

	// Retrieve categories
	categories = cs.GetCategories()
	if len(categories) != 3 {
		t.Errorf("Expected 3 categories, got %d", len(categories))
	}
}

// TestAddCommandWithCategory tests adding a command with a category
func TestAddCommandWithCategory(t *testing.T) {
	cs := newTestCommandService(t)

	// Create a category first
	cat, err := cs.CreateCategory("Git", "#78b4ff")
	if err != nil {
		t.Fatalf("CreateCategory() returned error: %v", err)
	}

	// Add command with category
	testContent := "git commit -m 'test'"
	cmd, err := cs.AddCommandWithCategory(testContent, cat.ID)

	if err != nil {
		t.Fatalf("AddCommandWithCategory() returned error: %v", err)
	}

	if cmd.Content != testContent {
		t.Errorf("Expected content %s, got %s", testContent, cmd.Content)
	}

	if cmd.Category != cat.ID {
		t.Errorf("Expected category %s, got %s", cat.ID, cmd.Category)
	}

	// Verify command was saved with category
	data, err := os.ReadFile(cs.filePath)
	if err != nil {
		t.Fatalf("Failed to read saved file: %v", err)
	}

	var savedCommands []Command
	if err := json.Unmarshal(data, &savedCommands); err != nil {
		t.Fatalf("Failed to unmarshal saved commands: %v", err)
	}

	if len(savedCommands) != 1 {
		t.Errorf("Expected 1 saved command, got %d", len(savedCommands))
	}

	if savedCommands[0].Category != cat.ID {
		t.Errorf("Expected saved command category %s, got %s", cat.ID, savedCommands[0].Category)
	}
}
