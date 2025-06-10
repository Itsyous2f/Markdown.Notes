"use client"

import { useEffect } from "react"

interface KeyboardShortcuts {
  onNewNote: () => void
  onSave: () => void
  onSearch: () => void
  onToggleSidebar: () => void
  onToggleTheme: () => void
}

export function useKeyboardShortcuts({
  onNewNote,
  onSave,
  onSearch,
  onToggleSidebar,
  onToggleTheme,
}: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0
      const ctrlKey = isMac ? event.metaKey : event.ctrlKey

      if (ctrlKey) {
        switch (event.key.toLowerCase()) {
          case "n":
            event.preventDefault()
            onNewNote()
            break
          case "s":
            event.preventDefault()
            onSave()
            break
          case "f":
            event.preventDefault()
            onSearch()
            break
          case "/":
            event.preventDefault()
            onToggleSidebar()
            break
          case "d":
            event.preventDefault()
            onToggleTheme()
            break
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onNewNote, onSave, onSearch, onToggleSidebar, onToggleTheme])
}
