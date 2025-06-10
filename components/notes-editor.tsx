"use client"

import { useNotes } from "@/contexts/notes-context"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import { TagsInput } from "./tags-input"

export function NotesEditor() {
  const { notes, activeNoteId, updateNote } = useNotes()
  const activeNote = notes.find((note) => note.id === activeNoteId)

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])

  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title)
      setContent(activeNote.content)
      setTags(activeNote.tags || [])
    } else {
      setTitle("")
      setContent("")
      setTags([])
    }
  }, [activeNote])

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    if (activeNoteId) {
      updateNote(activeNoteId, { title: newTitle })
    }
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    if (activeNoteId) {
      updateNote(activeNoteId, { content: newContent })
    }
  }

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags)
    if (activeNoteId) {
      updateNote(activeNoteId, { tags: newTags })
    }
  }

  if (!activeNote) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">No note selected</h3>
          <p className="text-sm">Create a new note or select an existing one to start writing</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div className="p-4 border-b space-y-3 flex-shrink-0">
        <Input
          placeholder="Note title..."
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="text-lg font-medium border-none shadow-none focus-visible:ring-0 px-0"
        />
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Tags</label>
          <TagsInput tags={tags} onChange={handleTagsChange} placeholder="Add tags (press Enter or comma to add)" />
        </div>
      </div>
      <div className="flex-1 p-4 overflow-hidden">
        <Textarea
          placeholder="Start writing your markdown here..."
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          className="h-full w-full resize-none border-none shadow-none focus-visible:ring-0 p-0 text-sm font-mono overflow-y-auto"
        />
      </div>
    </div>
  )
}
