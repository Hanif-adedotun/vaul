package main

import (
	"encoding/json"
	"os"
	"path/filepath"
	"time"
)

// Command represents a stored terminal command
type Command struct {
	ID        string    `json:"id"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"createdAt"`
}

// CommandService handles storing and retrieving commands
type CommandService struct {
	commands []Command
	filePath string
}

// NewCommandService creates a new CommandService instance
func NewCommandService() *CommandService {
	cs := &CommandService{}
	cs.initFilePath()
	cs.loadCommands()
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
		return
	}
	
	cs.filePath = filepath.Join(vaulDir, "commands.json")
}

// loadCommands loads commands from the JSON file
func (cs *CommandService) loadCommands() {
	data, err := os.ReadFile(cs.filePath)
	if err != nil {
		cs.commands = []Command{}
		return
	}
	
	if err := json.Unmarshal(data, &cs.commands); err != nil {
		cs.commands = []Command{}
	}
}

// saveCommands saves commands to the JSON file
func (cs *CommandService) saveCommands() error {
	data, err := json.MarshalIndent(cs.commands, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(cs.filePath, data, 0644)
}

// AddCommand adds a new command to storage
func (cs *CommandService) AddCommand(content string) (Command, error) {
	cmd := Command{
		ID:        generateID(),
		Content:   content,
		CreatedAt: time.Now(),
	}
	
	cs.commands = append([]Command{cmd}, cs.commands...)
	
	if err := cs.saveCommands(); err != nil {
		return Command{}, err
	}
	
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
			return cs.saveCommands()
		}
	}
	return nil
}

// generateID creates a simple unique ID based on timestamp
func generateID() string {
	return time.Now().Format("20060102150405.000000000")
}

