"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { loadNotes, saveNotes, createDefaultNote, type Note, type NoteTemplate } from "@/lib/notes"

interface NotesContextType {
  notes: Note[]
  activeNoteId: string | null
  searchTerm: string
  selectedTags: string[]
  createNote: () => void
  createNoteFromTemplate: (template: NoteTemplate) => void
  selectNote: (id: string) => void
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void
  setSearchTerm: (term: string) => void
  setSelectedTags: (tags: string[]) => void
  getAllTags: () => string[]
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([])
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = loadNotes()
    if (savedNotes.length === 0) {
      // Create default note if no notes exist
      const defaultNote = createDefaultNote()
      setNotes([defaultNote])
      setActiveNoteId(defaultNote.id)
    } else {
      setNotes(savedNotes)
      setActiveNoteId(savedNotes[0].id)
    }
  }, [])

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    if (notes.length > 0) {
      saveNotes(notes)
    }
  }, [notes])

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "",
      content: "",
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setNotes((prev) => [newNote, ...prev])
    setActiveNoteId(newNote.id)
  }

  const createNoteFromTemplate = (template: NoteTemplate) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: template.name === "Blank Note" ? "" : template.name,
      content: template.content,
      tags: [...template.tags],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setNotes((prev) => [newNote, ...prev])
    setActiveNoteId(newNote.id)
  }

  const selectNote = (id: string) => {
    setActiveNoteId(id)
  }

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note)))
  }

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
    if (activeNoteId === id) {
      const remainingNotes = notes.filter((note) => note.id !== id)
      setActiveNoteId(remainingNotes.length > 0 ? remainingNotes[0].id : null)
    }
  }

  const getAllTags = () => {
    const allTags = notes.flatMap((note) => note.tags)
    return Array.from(new Set(allTags)).sort()
  }

  return (
    <NotesContext.Provider
      value={{
        notes,
        activeNoteId,
        searchTerm,
        selectedTags,
        createNote,
        createNoteFromTemplate,
        selectNote,
        updateNote,
        deleteNote,
        setSearchTerm,
        setSelectedTags,
        getAllTags,
      }}
    >
      {children}
    </NotesContext.Provider>
  )
}

export function useNotes() {
  const context = useContext(NotesContext)
  if (context === undefined) {
    throw new Error("useNotes must be used within a NotesProvider")
  }
  return context
}
