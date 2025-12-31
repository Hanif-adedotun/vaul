package main

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/wailsapp/wails/v3/pkg/application"
)

// AppService handles application-level operations
type AppService struct {
	app *application.App
}

// NewAppService creates a new AppService instance
func NewAppService() *AppService {
	return &AppService{}
}

// SetApp sets the application reference
func (as *AppService) SetApp(app *application.App) {
	as.app = app
}

// Quit quits the application
func (as *AppService) Quit() error {
	if as.app != nil {
		as.app.Quit()
	}
	return nil
}

// CreateSymlink creates a symlink for the vaul command in the user's PATH
// Returns a message indicating success or failure
func (as *AppService) CreateSymlink() (string, error) {
	// Get the current executable path
	execPath, err := os.Executable()
	if err != nil {
		return "", fmt.Errorf("failed to get executable path: %v", err)
	}

	// Resolve symlinks to get the actual path
	execPath, err = filepath.EvalSymlinks(execPath)
	if err != nil {
		return "", fmt.Errorf("failed to resolve executable path: %v", err)
	}

	// Get the absolute path
	execPath, err = filepath.Abs(execPath)
	if err != nil {
		return "", fmt.Errorf("failed to get absolute path: %v", err)
	}

	// Try to create symlink in ~/go/bin (most common location)
	goBin := filepath.Join(os.Getenv("HOME"), "go", "bin")
	
	// Check if ~/go/bin exists, if not try to create it
	if _, err := os.Stat(goBin); os.IsNotExist(err) {
		if err := os.MkdirAll(goBin, 0755); err != nil {
			// If we can't create ~/go/bin, try /usr/local/bin (requires sudo, but let's try)
			goBin = "/usr/local/bin"
		}
	}

	symlinkPath := filepath.Join(goBin, "vaul")

	// Remove existing symlink or file if it exists
	if _, err := os.Lstat(symlinkPath); err == nil {
		if err := os.Remove(symlinkPath); err != nil {
			return "", fmt.Errorf("failed to remove existing symlink: %v", err)
		}
	}

	// Create the symlink
	if err := os.Symlink(execPath, symlinkPath); err != nil {
		return "", fmt.Errorf("failed to create symlink: %v. You may need to run this command manually: ln -sf %s %s", err, execPath, symlinkPath)
	}

	return fmt.Sprintf("Symlink created successfully!\nYou can now use 'vaul' from anywhere.\nSymlink: %s -> %s\n\nMake sure %s is in your PATH.", symlinkPath, execPath, goBin), nil
}

// SymlinkExists checks if the vaul symlink already exists
// Returns true if the symlink exists and points to the current executable
func (as *AppService) SymlinkExists() (bool, error) {
	// Get the current executable path
	execPath, err := os.Executable()
	if err != nil {
		return false, fmt.Errorf("failed to get executable path: %v", err)
	}

	// Resolve symlinks to get the actual path
	execPath, err = filepath.EvalSymlinks(execPath)
	if err != nil {
		return false, fmt.Errorf("failed to resolve executable path: %v", err)
	}

	// Get the absolute path
	execPath, err = filepath.Abs(execPath)
	if err != nil {
		return false, fmt.Errorf("failed to get absolute path: %v", err)
	}

	// Check common locations for the symlink
	locations := []string{
		filepath.Join(os.Getenv("HOME"), "go", "bin", "vaul"),
		"/usr/local/bin/vaul",
	}

	for _, symlinkPath := range locations {
		// Check if symlink exists
		linkInfo, err := os.Lstat(symlinkPath)
		if err != nil {
			continue // Symlink doesn't exist at this location
		}

		// Check if it's actually a symlink
		if linkInfo.Mode()&os.ModeSymlink != 0 {
			// Resolve the symlink target
			target, err := os.Readlink(symlinkPath)
			if err != nil {
				continue
			}

			// Get absolute path of the target
			absTarget, err := filepath.Abs(target)
			if err != nil {
				continue
			}

			// Check if it points to our executable
			if absTarget == execPath {
				return true, nil
			}
		}
	}

	return false, nil
}
