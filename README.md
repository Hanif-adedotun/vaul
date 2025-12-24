# VAUL

<div align="center">

**A beautiful, native desktop application for storing and quickly accessing your terminal commands**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Go Version](https://img.shields.io/badge/Go-1.24+-00ADD8?logo=go)](https://golang.org/)
[![Wails](https://img.shields.io/badge/Wails-v3.0--alpha-blue)](https://wails.io/)
[![React](https://img.shields.io/badge/React-18.2+-61DAFB?logo=react)](https://reactjs.org/)

</div>

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

### Building for Different Platforms

```bash
# macOS
task darwin:build

# Windows
task windows:build

# Linux
task linux:build
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

- [ ] Search/filter functionality
- [ ] Command categories/tags
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
