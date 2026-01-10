# VAUL

<div align="center">

	
**A native desktop application for storing and quickly accessing your terminal commands**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Go Version](https://img.shields.io/badge/Go-1.24+-00ADD8?logo=go)](https://golang.org/)
[![Wails](https://img.shields.io/badge/Wails-v3.0--alpha-blue)](https://wails.io/)
[![React](https://img.shields.io/badge/React-18.2+-61DAFB?logo=react)](https://reactjs.org/)

</div>

</p>
<p align="center" style=" width: full; margin: 0 auto;">
	<img src="preview3.jpg" alt="OpenScreen App Preview 3" style="height: 450px; margin-right: 12px; border-radius: 9px;" />
</p>
</p>

---

## 📥 Downloads

Pre-built binaries are available for download:

- **macOS**: [`vaul-macos.zip`](vaul-v1/build/vaul-macos.zip) (ZIP archive, contains the macOS app bundle)
- **Windows**: [`Vaul.exe`](vaul-v1/build/Vaul.exe) (Standalone Windows executable)

> **Note**: To create downloadable releases, run the build commands below. The built files will be in the locations specified above.

### macOS Security Warning

When you first open VAUL on macOS, you may see a warning: *"Apple could not verify vaul-v1 is free of malware"*. This is normal for unsigned applications.

**To open VAUL:**

1. **Right-click** (or Control-click) on `vaul-v1.app`
2. Select **"Open"** from the context menu
3. Click **"Open"** in the security dialog that appears

Alternatively:
1. Go to **System Settings** > **Privacy & Security**
2. Scroll down to find the blocked app message
3. Click **"Open Anyway"** next to the VAUL message

> **Note**: This warning appears because VAUL is not code-signed with an Apple Developer certificate. The app is safe to use - you can review the source code to verify. For a signed version, you would need to build it yourself or wait for an official signed release.

---



## 📖 Overview

**VAUL** is an open-source desktop application that helps developers store, organize, and quickly retrieve terminal commands. It functions as a personal command vault—allowing you to save frequently used or hard-to-remember CLI commands and reuse them efficiently across projects and environments.

Built for performance and simplicity, VAUL combines a Go backend with a modern React frontend using **Wails v3**, delivering a fast, native desktop experience without sacrificing developer ergonomics.

## ✨ Features

- 🎯 **Quick Access** - System tray integration for instant command retrieval
- 💾 **Persistent Storage** - Commands saved locally in your config directory
- 🎨 **Beautiful UI** - Liquid glass design with modern aesthetics
- 📋 **One-Click Copy** - Copy commands to clipboard instantly
- 🔍 **Easy Organization** - View all commands in a clean, scrollable list
- 🖥️ **Cross-Platform** - Works on macOS, Windows, and Linux
- ⚡ **Lightweight** - Native performance with minimal resource usage
- 🔄 **Real-Time Sync** - Main window and tray window stay synchronized

## 🚀 Getting Started

### Prerequisites

- **Go** 1.24 or higher ([Install Go](https://golang.org/doc/install))
- **Node.js** 18+ and npm ([Install Node.js](https://nodejs.org/))
- **Wails CLI** v3 ([Install Wails](https://v3alpha.wails.io/quick-start/installation/))
- **Task** (optional, for using task runner) - Install via:
  ```bash
  # macOS
  brew install go-task/tap/go-task
  
  # Or using Go
  go install github.com/go-task/task/v3/cmd/task@latest
  ```

### Installation

#### From Source

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vaul.git
cd vaul/vaul-v1
```

2. Install dependencies:
```bash
# Install Go dependencies
go mod download

# Install frontend dependencies
cd frontend
npm install
cd ..
```

3. Run in development mode:
```bash
wails3 dev
```

4. Build for production:
```bash
# Build for your current platform
wails3 build

# Or use the task runner
task build
```

### Building for Distribution

#### macOS

**Option 1: Using Task (Recommended)**
```bash
cd vaul-v1
task darwin:package
```

**Option 2: Using Wails directly**
```bash
cd vaul-v1
# Build the binary
wails3 build

# Create .app bundle manually
mkdir -p bin/vaul-v1.app/Contents/{MacOS,Resources}
cp build/darwin/icons.icns bin/vaul-v1.app/Contents/Resources/
cp bin/vaul-v1 bin/vaul-v1.app/Contents/MacOS/
cp build/darwin/Info.plist bin/vaul-v1.app/Contents/
codesign --force --deep --sign - bin/vaul-v1.app
```

**Output**: `bin/vaul-v1.app`

To create a distributable `.app` file:
1. The `.app` bundle will be created in `bin/vaul-v1.app`
2. You can zip it for distribution: `zip -r vaul-v1-macos.zip bin/vaul-v1.app`

#### Windows

**Option 1: Using Task**
```bash
cd vaul-v1
task windows:create:nsis:installer
```

**Option 2: Using Wails directly**
```bash
cd vaul-v1
# Build the executable
wails3 build

# The executable will be in: bin/vaul-v1.exe
# For installer, you'll need to use NSIS separately
```

**Output**: 
- Binary: `bin/vaul-v1.exe`
- Installer: `build/windows/nsis/vaul-v1-setup.exe` (if using Task)

**Prerequisites for Windows installer**:
- Install NSIS: `brew install makensis` (macOS) or download from [NSIS website](https://nsis.sourceforge.io/)

#### Linux

**Option 1: Using Task**
```bash
cd vaul-v1
task linux:build
```

**Option 2: Using Wails directly**
```bash
cd vaul-v1
wails3 build
```

**Output**: `bin/vaul-v1`

### Quick Build Commands

**Using Task:**
```bash
# Build for current platform
task build

# Package for current platform (creates distributable)
task package
```

**Using Wails directly:**
```bash
# Build for current platform
wails3 build

# Output will be in: bin/vaul-v1 (or bin/vaul-v1.exe on Windows)
```

## 📖 Usage

### Main Window

1. Launch VAUL from your applications
2. Type a command in the input field
3. Press **Enter** to save the command
4. Click the **copy button** to copy a command to your clipboard
5. Hover over a command and click the **delete button** (top-right) to remove it

### System Tray

1. Click the VAUL icon in your system tray
2. A compact window will appear showing all your saved commands
3. Click any command to copy it instantly
4. Right-click the tray icon for additional options:
   - Show Commands
   - Open Main Window
   - Quit

### Data Storage

Commands are stored locally in:
- **macOS**: `~/Library/Application Support/vaul/commands.json`
- **Linux**: `~/.config/vaul/commands.json`
- **Windows**: `%AppData%\vaul\commands.json`

## 🛠️ Tech Stack

- **Backend**: Go 1.24+
- **Frontend**: React 18.2+ with Vite
- **Desktop Framework**: Wails v3 (alpha)
- **Styling**: Custom CSS with liquid glass design

## 🧪 Testing

Run the test suite:

```bash
go test -v ./...
```

Run tests with coverage:

```bash
go test -v -cover ./...
```

## 🤝 Contributing

Contributions are welcome! We appreciate your help in making VAUL better.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Write or update tests** if applicable
5. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

### Development Guidelines

- Follow Go code style guidelines
- Write unit tests for new features
- Update documentation as needed
- Keep commits atomic and well-described
- Follow the existing code structure and patterns

### Reporting Issues

If you find a bug or have a feature request, please open an issue on GitHub with:
- A clear description of the problem or feature
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Your operating system and version

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/vaul/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/vaul/discussions)

## 🗺️ Roadmap

- [x] Search/filter functionality
- [ ] Command categories/tags
- [ ] Alias management from CLI
- [ ] Command history and favorites
- [ ] Import/export commands
- [ ] Keyboard shortcuts
- [ ] Command templates/variables
- [ ] Dark/light theme toggle
- [ ] Multi-language support

---

<div align="center">

**Made with ❤️ by the VAUL community**

*A vault for your terminal commands.*

</div>
