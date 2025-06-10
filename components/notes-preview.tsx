"use client"

import { useNotes } from "@/contexts/notes-context"
import ReactMarkdown from "react-markdown"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SearchHighlight } from "./search-highlight"

export function NotesPreview() {
  const { notes, activeNoteId, searchTerm } = useNotes()
  const activeNote = notes.find((note) => note.id === activeNoteId)

  if (!activeNote) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground bg-muted/20">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Preview</h3>
          <p className="text-sm">Your markdown will be rendered here</p>
        </div>
      </div>
    )
  }

  // Custom component to highlight search terms in rendered markdown
  const HighlightedText = ({ children }: { children: string }) => {
    if (typeof children !== "string") return <>{children}</>
    return <SearchHighlight text={children} searchTerm={searchTerm} />
  }

  return (
    <div className="h-full w-full flex flex-col bg-muted/20 overflow-hidden">
      <div className="p-4 border-b bg-background/50 flex-shrink-0">
        <h2 className="text-lg font-medium">Preview</h2>
        {searchTerm && <p className="text-xs text-muted-foreground mt-1">Highlighting: "{searchTerm}"</p>}
      </div>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6">
            <ReactMarkdown
              className="prose prose-sm dark:prose-invert max-w-none"
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold mb-4 mt-6 first:mt-0">
                    <HighlightedText>{String(children)}</HighlightedText>
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-semibold mb-3 mt-5">
                    <HighlightedText>{String(children)}</HighlightedText>
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-medium mb-2 mt-4">
                    <HighlightedText>{String(children)}</HighlightedText>
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="mb-4 leading-relaxed">
                    <HighlightedText>{String(children)}</HighlightedText>
                  </p>
                ),
                ul: ({ children }) => <ul className="mb-4 pl-6 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="mb-4 pl-6 space-y-1">{children}</ol>,
                li: ({ children }) => (
                  <li className="list-disc">
                    <HighlightedText>{String(children)}</HighlightedText>
                  </li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary/30 pl-4 italic my-4 text-muted-foreground">
                    {children}
                  </blockquote>
                ),
                code: ({ children, className }) => {
                  const isInline = !className
                  if (isInline) {
                    return <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
                  }
                  return (
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4">
                      <code className="text-sm font-mono">{children}</code>
                    </pre>
                  )
                },
                a: ({ children, href }) => (
                  <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
              }}
            >
              {activeNote.content || "*Start writing to see the preview*"}
            </ReactMarkdown>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
