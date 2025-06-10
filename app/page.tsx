import { NotesProvider } from "@/contexts/notes-context"
import { NotesApp } from "@/components/notes-app"

export default function Home() {
  return (
    <NotesProvider>
      <NotesApp />
    </NotesProvider>
  )
}
