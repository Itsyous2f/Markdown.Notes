export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: number
  updatedAt: number
}

export interface NoteTemplate {
  id: string
  name: string
  description: string
  content: string
  tags: string[]
}

export const noteTemplates: NoteTemplate[] = [
  {
    id: "blank",
    name: "Blank Note",
    description: "Start with an empty note",
    content: "",
    tags: [],
  },
  {
    id: "meeting",
    name: "Meeting Notes",
    description: "Template for meeting notes",
    content: `# Meeting Notes - [Date]

## Attendees
- 
- 
- 

## Agenda
1. 
2. 
3. 

## Discussion Points
### Topic 1


### Topic 2


## Action Items
- [ ] 
- [ ] 
- [ ] 

## Next Steps


## Follow-up Date
`,
    tags: ["meeting", "work"],
  },
  {
    id: "project",
    name: "Project Planning",
    description: "Template for project planning",
    content: `# Project: [Project Name]

## Overview


## Goals
- 
- 
- 

## Timeline
| Phase | Description | Deadline |
|-------|-------------|----------|
| 1     |             |          |
| 2     |             |          |
| 3     |             |          |

## Resources Needed
- 
- 
- 

## Risks & Mitigation
| Risk | Impact | Mitigation |
|------|--------|------------|
|      |        |            |

## Success Metrics
- 
- 
- 
`,
    tags: ["project", "planning"],
  },
  {
    id: "daily",
    name: "Daily Journal",
    description: "Template for daily journaling",
    content: `# Daily Journal - ${new Date().toLocaleDateString()}

## Today's Goals
- [ ] 
- [ ] 
- [ ] 

## What Happened Today


## Wins & Accomplishments
- 
- 

## Challenges & Lessons
- 
- 

## Tomorrow's Priorities
1. 
2. 
3. 

## Gratitude
- 
- 
- 

## Mood: ⭐⭐⭐⭐⭐
`,
    tags: ["journal", "personal"],
  },
  {
    id: "research",
    name: "Research Notes",
    description: "Template for research and study notes",
    content: `# Research: [Topic]

## Source
**Title:** 
**Author:** 
**Date:** 
**URL/Reference:** 

## Key Points
- 
- 
- 

## Detailed Notes


## Quotes & Citations
> 

## Questions & Follow-up
- 
- 

## Related Topics
- 
- 

## Summary


## Rating: ⭐⭐⭐⭐⭐
`,
    tags: ["research", "study"],
  },
  {
    id: "recipe",
    name: "Recipe",
    description: "Template for cooking recipes",
    content: `# [Recipe Name]

## Info
- **Prep Time:** 
- **Cook Time:** 
- **Total Time:** 
- **Servings:** 
- **Difficulty:** Easy/Medium/Hard

## Ingredients
- 
- 
- 

## Instructions
1. 
2. 
3. 

## Notes & Tips
- 
- 

## Variations
- 
- 

## Rating: ⭐⭐⭐⭐⭐
`,
    tags: ["recipe", "cooking"],
  },
]

const NOTES_STORAGE_KEY = "markdown-notes"

export function loadNotes(): Note[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(NOTES_STORAGE_KEY)
    if (!stored) return []

    const notes = JSON.parse(stored)
    return Array.isArray(notes) ? notes : []
  } catch (error) {
    console.error("Failed to load notes from localStorage:", error)
    return []
  }
}

export function saveNotes(notes: Note[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes))
  } catch (error) {
    console.error("Failed to save notes to localStorage:", error)
  }
}

export function createDefaultNote(): Note {
  return {
    id: Date.now().toString(),
    title: "Welcome to Markdown Notes",
    content: `# Welcome to Markdown Notes! 📝

This is your first note. You can edit this content and see the live preview on the right.

## New Features ✨

### 🏷️ Tags
- Add tags to organize your notes
- Filter notes by tags
- Visual tag indicators

### ⌨️ Keyboard Shortcuts
- **Ctrl/Cmd + N**: Create new note
- **Ctrl/Cmd + S**: Save note (auto-saves anyway!)
- **Ctrl/Cmd + F**: Focus search
- **Ctrl/Cmd + /**: Toggle sidebar
- **Ctrl/Cmd + D**: Toggle dark mode

### 🔍 Enhanced Search
- Search in titles, content, and tags
- Highlighted search results
- Real-time filtering

### 📋 Note Templates
- Pre-built templates for common note types
- Meeting notes, project planning, daily journal, and more
- Quick start with structured content

## Markdown Syntax

Here are some examples of what you can do:

### Text Formatting
- *Italic text*
- **Bold text**
- ~~Strikethrough~~
- \`Inline code\`

### Lists
1. Numbered list item
2. Another item
   - Nested bullet point
   - Another nested item

### Code Blocks
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Blockquotes
> This is a blockquote. You can use it to highlight important information or quotes.

### Links
[Visit GitHub](https://github.com)

---

Start writing your own notes by creating a new note or editing this one!`,
    tags: ["welcome", "guide"],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}
