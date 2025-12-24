# Contributing to VAUL

Thank you for your interest in contributing to VAUL! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please open an issue with:

- **Clear title and description** of the bug
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Screenshots** if applicable
- **Environment details**:
  - Operating system and version
  - Go version
  - Node.js version
  - Wails version

### Suggesting Features

Feature requests are welcome! Please open an issue with:

- **Clear description** of the feature
- **Use case** - why would this be useful?
- **Possible implementation** (if you have ideas)

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments where necessary
4. **Write or update tests**:
   - Add unit tests for new features
   - Ensure all tests pass
   - Maintain or improve test coverage
5. **Update documentation**:
   - Update README if needed
   - Add code comments for complex logic
6. **Commit your changes**:
   ```bash
   git commit -m "Add: brief description of changes"
   ```
   Use clear, descriptive commit messages.
7. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Open a Pull Request**:
   - Provide a clear title and description
   - Reference any related issues
   - Wait for review and address feedback

## Development Setup

### Prerequisites

- Go 1.24 or higher
- Node.js 18+ and npm
- Wails CLI v3

### Setup Steps

1. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/vaul.git
   cd vaul/vaul-v1
   ```

2. Install dependencies:
   ```bash
   # Go dependencies
   go mod download
   
   # Frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. Run in development mode:
   ```bash
   wails3 dev
   ```

## Coding Standards

### Go

- Follow [Effective Go](https://golang.org/doc/effective_go) guidelines
- Use `gofmt` to format code
- Write meaningful variable and function names
- Add comments for exported functions and types
- Keep functions focused and small
- Handle errors explicitly

### JavaScript/React

- Follow React best practices
- Use functional components with hooks
- Keep components small and focused
- Use meaningful variable names
- Add comments for complex logic

### CSS

- Use consistent naming conventions
- Keep styles organized and modular
- Use CSS variables for theming
- Ensure responsive design

## Testing

- Write unit tests for new features
- Ensure all existing tests pass
- Aim for good test coverage
- Test on multiple platforms if possible

Run tests:
```bash
go test -v ./...
```

## Commit Message Guidelines

Use clear, descriptive commit messages:

- **Format**: `Type: Brief description`
- **Types**: `Add`, `Fix`, `Update`, `Remove`, `Refactor`, `Docs`, `Test`
- **Examples**:
  - `Add: system tray menu functionality`
  - `Fix: command deletion not updating tray window`
  - `Update: README with installation instructions`
  - `Docs: add contributing guidelines`

## Pull Request Process

1. Ensure your code follows the project's style guidelines
2. Make sure all tests pass
3. Update documentation as needed
4. Request review from maintainers
5. Address any feedback or requested changes
6. Once approved, maintainers will merge your PR

## Questions?

If you have questions about contributing, feel free to:
- Open an issue with the `question` label
- Start a discussion on GitHub Discussions

Thank you for contributing to VAUL! 🎉

