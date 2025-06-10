"use client"

import { useNotes } from "@/contexts/notes-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Search, FileText, Trash2, X } from "lucide-react"
import { TemplateSelector } from "./template-selector"
import { SearchHighlight } from "./search-highlight"
import { Badge } from "@/components/ui/badge"

export function NotesSidebar() {
  const {
    notes,
    activeNoteId,
    searchTerm,
    selectedTags,
    createNote,
    createNoteFromTemplate,
    selectNote,
    deleteNote,
    setSearchTerm,
    setSelectedTags,
    getAllTags,
  } = useNotes()

  const allTags = getAllTags()

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      searchTerm === "" ||
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => note.tags.includes(tag))

    return matchesSearch && matchesTags
  })

  const toggleTag = (tag: string) => {
    setSelectedTags(selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag])
  }

  const clearTagFilters = () => {
    setSelectedTags([])
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="h-full w-full flex flex-col bg-muted/30 overflow-hidden">
      {/* Sidebar Header */}
      <div className="p-4 border-b space-y-3 flex-shrink-0">
        <div className="flex gap-2">
          <Button onClick={createNote} size="sm" className="flex-1">
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
          <TemplateSelector onSelectTemplate={createNoteFromTemplate} />
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            data-search-input
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Filter by tags</span>
              {selectedTags.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearTagFilters} className="h-6 px-2 text-xs">
                  Clear
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="text-xs cursor-pointer hover:bg-primary/80 flex-shrink-0"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {selectedTags.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Active filters:</span>
            <div className="flex flex-wrap gap-1">
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                  <button onClick={() => toggleTag(tag)} className="ml-1 hover:bg-destructive/20 rounded-full p-0.5">
                    <X className="h-2 w-2" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-2">
            {filteredNotes.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {searchTerm || selectedTags.length > 0 ? "No notes match your search" : "No notes found"}
                </p>
              </div>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={`group p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                    activeNoteId === note.id ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
                  }`}
                  onClick={() => selectNote(note.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate mb-1">
                        <SearchHighlight text={note.title || "Untitled"} searchTerm={searchTerm} />
                      </h3>
                      <p className="text-xs text-muted-foreground truncate mb-2">
                        <SearchHighlight text={note.content.slice(0, 60) || "No content"} searchTerm={searchTerm} />
                      </p>
                      {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {note.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              <SearchHighlight text={tag} searchTerm={searchTerm} />
                            </Badge>
                          ))}
                          {note.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{note.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">{formatDate(note.updatedAt)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNote(note.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
