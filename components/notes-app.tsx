"use client"

import { useState, useEffect } from "react"
import { NotesSidebar } from "@/components/notes-sidebar"
import { NotesEditor } from "@/components/notes-editor"
import { NotesPreview } from "@/components/notes-preview"
import { Button } from "@/components/ui/button"
import { Moon, Sun, PanelLeftOpen, PanelLeftClose } from "lucide-react"
import { useTheme } from "next-themes"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useNotes } from "@/contexts/notes-context"

export function NotesApp() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { createNote } = useNotes()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  useKeyboardShortcuts({
    onNewNote: createNote,
    onSave: () => {}, // Auto-save is already implemented
    onSearch: () => {
      // Focus search input
      const searchInput = document.querySelector("[data-search-input]") as HTMLInputElement
      if (searchInput) {
        searchInput.focus()
      }
    },
    onToggleSidebar: () => setSidebarOpen(!sidebarOpen),
    onToggleTheme: toggleTheme,
  })

  if (!mounted) {
    return (
      <div className="h-screen w-screen overflow-hidden bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-background flex">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-80" : "w-0"} transition-all duration-300 overflow-hidden border-r flex-shrink-0`}
      >
        <NotesSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
            </Button>
            <h1 className="text-xl font-semibold">Markdown Notes</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </header>

        {/* Editor and Preview */}
        <div className="flex-1 flex min-h-0">
          <div className="flex-1 border-r min-w-0">
            <NotesEditor />
          </div>
          <div className="flex-1 min-w-0">
            <NotesPreview />
          </div>
        </div>
      </div>
    </div>
  )
}
