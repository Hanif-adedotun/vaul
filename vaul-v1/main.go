package main

import (
	"embed"
	_ "embed"
	"fmt"
	"log"
	"os"
	"os/exec"
	"runtime"
	"time"

	"github.com/wailsapp/wails/v3/pkg/application"
	"github.com/wailsapp/wails/v3/pkg/events"
)

// Wails uses Go's `embed` package to embed the frontend files into the binary.
// Any files in the frontend/dist folder will be embedded into the binary and
// made available to the frontend.
// See https://pkg.go.dev/embed for more information.

//go:embed all:frontend/dist
var assets embed.FS

//go:embed frontend/public/logo.png
var trayIcon []byte

func init() {
	// Register events for command changes
	application.RegisterEvent[string]("commands-updated")
}

// executeCommand runs the command in the user's default shell
func executeCommand(command string) error {
	var cmd *exec.Cmd

	switch runtime.GOOS {
	case "windows":
		// On Windows, use cmd.exe
		cmd = exec.Command("cmd.exe", "/c", command)
	case "darwin", "linux":
		// On Unix-like systems, use the user's default shell
		shell := os.Getenv("SHELL")
		if shell == "" {
			shell = "/bin/sh"
		}
		// Use -c flag to execute the command
		cmd = exec.Command(shell, "-c", command)
	default:
		return fmt.Errorf("unsupported operating system: %s", runtime.GOOS)
	}

	// Set up stdin/stdout/stderr to inherit from current process
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	// Execute the command
	return cmd.Run()
}

// main function serves as the application's entry point. It initializes the application, creates a window,
// and starts a goroutine that emits a time-based event every second. It subsequently runs the application and
// logs any error that might occur.
func main() {
	// Check for CLI mode - if arguments provided, run CLI instead of GUI
	if len(os.Args) > 1 {
		alias := os.Args[1]

		// Create command service
		commandService := NewCommandService()

		// Get command by alias
		cmd, err := commandService.GetCommandByAlias(alias)
		if err != nil {
			log.Fatalf("Error: %v\nUse 'vaul' without arguments to open the GUI.", err)
		}

		// Execute the command
		if err := executeCommand(cmd.Content); err != nil {
			log.Fatalf("Error executing command: %v", err)
		}

		// Exit after executing (CLI mode)
		os.Exit(0)
	}

	// GUI Mode - existing code continues...
	// Create the command service
	commandService := NewCommandService()

	// Create window service
	windowService := NewWindowService()

	// Create app service for quitting
	appService := NewAppService()

	// Create a new Wails application by providing the necessary options.
	// Variables 'Name' and 'Description' are for application metadata.
	// 'Assets' configures the asset server with the 'FS' variable pointing to the frontend files.
	// 'Bind' is a list of Go struct instances. The frontend has access to the methods of these instances.
	// 'Mac' options tailor the application when running an macOS.
	app := application.New(application.Options{
		Name:        "Vaul",
		Description: "VAUL is an open-source desktop application that helps developers store, organize, and quickly retrieve terminal commands.",
		Services: []application.Service{
			application.NewService(commandService),
			application.NewService(windowService),
			application.NewService(appService),
		},
		Assets: application.AssetOptions{
			Handler: application.AssetFileServerFS(assets),
		},
		Mac: application.MacOptions{
			ApplicationShouldTerminateAfterLastWindowClosed: false, // Keep app running for system tray
		},
	})

	// Set update callback to emit events when commands change
	commandService.SetUpdateCallback(func() {
		app.Event.Emit("commands-updated", "updated")
	})

	// Set app reference for app service
	appService.SetApp(app)

	// Create the main window
	mainWindow := app.Window.NewWithOptions(application.WebviewWindowOptions{
		Title: "VAUL",
		Mac: application.MacWindow{
			InvisibleTitleBarHeight: 50,
			Backdrop:                application.MacBackdropTranslucent,
			TitleBar:                application.MacTitleBarHiddenInset,
		},
		BackgroundColour: application.NewRGB(27, 38, 54),
		URL:              "/",
		Width:            800,
		Height:           600,
		MinWidth:         640,
		MinHeight:        480,
	})

	// Handle window close - hide instead of close so it can be reopened from tray
	// When user clicks X, hide the window instead of closing it
	mainWindow.RegisterHook(events.Common.WindowClosing, func(e *application.WindowEvent) {
		mainWindow.Hide() // Hide the window instead of closing
		e.Cancel()        // Prevent the window from being destroyed
	})

	// Set main window reference for window service
	SetMainWindowRef(mainWindow)

	// Create tray window (initially hidden)
	// Min/Max height will be dynamically adjusted based on content
	trayWindow := app.Window.NewWithOptions(application.WebviewWindowOptions{
		Title:            "VAUL - Quick Access",
		Width:            420,
		Height:           500,
		MinWidth:         350,
		MinHeight:        200,
		MaxHeight:        600,
		BackgroundColour: application.NewRGB(27, 38, 54),
		URL:              "/tray.html",
		Frameless:        true,
		AlwaysOnTop:      true,
		Hidden:           true,
		Mac: application.MacWindow{
			Backdrop:                application.MacBackdropTranslucent,
			InvisibleTitleBarHeight: 0,
			TitleBar:                application.MacTitleBarHiddenInset,
			WindowLevel:             application.MacWindowLevelStatus, // Status level for system tray windows - appears over full screen apps
		},
	})

	// Register hook to ensure window appears over full screen apps when shown
	trayWindow.RegisterHook(events.Common.WindowShow, func(e *application.WindowEvent) {
		// Force window to front when shown
		trayWindow.Focus()
		trayWindow.UnMinimise()
	})

	// Create the system tray
	systray := app.SystemTray.New()

	// Set tray icon
	if err := systray.SetIcon(trayIcon); err != nil {
		log.Printf("Failed to set tray icon: %v", err)
	}

	systray.SetTooltip("VAUL - Terminal Command Vault")

	// Create tray menu
	trayMenu := application.NewMenu()

	// Menu items
	trayMenu.Add("Open Vaul app").OnClick(func(ctx *application.Context) {
		if mainWindow != nil {
			if !mainWindow.IsVisible() {
				mainWindow.Show()
			}
			mainWindow.Focus()
		}
	})

	trayMenu.AddSeparator()

	trayMenu.Add("Show Commands").OnClick(func(ctx *application.Context) {
		if trayWindow != nil {
			// Ensure window appears over full screen apps
			trayWindow.Show()
			trayWindow.Focus()
			trayWindow.UnMinimise()
		}
	})

	trayMenu.AddSeparator()

	trayMenu.Add("Quit").OnClick(func(ctx *application.Context) {
		app.Quit()
	})

	systray.SetMenu(trayMenu)

	// Attach window to system tray (clicking tray icon toggles window)
	systray.AttachWindow(trayWindow)

	// Configure window positioning and debounce for better behavior
	systray.WindowOffset(5)                        // Offset from tray icon
	systray.WindowDebounce(200 * time.Millisecond) // Debounce clicks to prevent rapid toggling

	// Run the application. This blocks until the application has been exited.
	err := app.Run()

	// If an error occurred while running the application, log it and exit.
	if err != nil {
		log.Fatal(err)
	}
}
