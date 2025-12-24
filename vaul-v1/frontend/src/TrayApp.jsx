import { useState, useEffect } from 'react'
import { CommandService } from "../bindings/changeme"

function TrayApp() {
  const [commands, setCommands] = useState([])
  const [copiedId, setCopiedId] = useState(null)

  // Load commands on mount
  useEffect(() => {
    loadCommands()
  }, [])

  const loadCommands = async () => {
    try {
      const cmds = await CommandService.GetCommands()
      setCommands(cmds || [])
    } catch (err) {
      console.error('Failed to load commands:', err)
    }
  }

  const handleCopy = async (command) => {
    try {
      await navigator.clipboard.writeText(command.content)
      setCopiedId(command.id)
      setTimeout(() => setCopiedId(null), 1500)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="tray-container">
      <div className="tray-header">
        <img src="/logo-full.png" alt="VAUL" className="tray-logo" />
      </div>

      <div className="tray-commands-list">
        {commands.length === 0 ? (
          <div className="tray-empty-state">
            <p>No commands saved</p>
          </div>
        ) : (
          commands.map((cmd) => (
            <div key={cmd.id} className="tray-command-item">
              <code className="tray-command-code" onClick={() => handleCopy(cmd)}>
                {cmd.content}
              </code>
              <button
                className={`tray-copy-btn ${copiedId === cmd.id ? 'copied' : ''}`}
                onClick={() => handleCopy(cmd)}
                title="Copy to clipboard"
              >
                {copiedId === cmd.id ? (
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                )}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TrayApp

