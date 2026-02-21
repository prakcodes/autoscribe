import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import AIPromptPanel from './components/AIPromptPanel'

function App() {
  const [notes, setNotes] = useState([])
  const [activeNoteId, setActiveNoteId] = useState(null)
  const [showAIPanel, setShowAIPanel] = useState(false)

  useEffect(() => {
    const savedNotes = localStorage.getItem('ai-notability-notes')
    if (savedNotes) {
      const parsed = JSON.parse(savedNotes)
      setNotes(parsed)
      if (parsed.length > 0 && !activeNoteId) {
        setActiveNoteId(parsed[0].id)
      }
    }
  }, [])

  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('ai-notability-notes', JSON.stringify(notes))
    }
  }, [notes])

  const activeNote = notes.find(note => note.id === activeNoteId)

  const createNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setNotes(prev => [newNote, ...prev])
    setActiveNoteId(newNote.id)
  }

  const updateNote = (id, updates) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date().toISOString() }
        : note
    ))
  }

  const deleteNote = (id) => {
    setNotes(prev => {
      const filtered = prev.filter(note => note.id !== id)
      if (activeNoteId === id && filtered.length > 0) {
        setActiveNoteId(filtered[0].id)
      }
      return filtered
    })
  }

  const generateAIContent = async (prompt, insertMode) => {
    const response = await simulateAIGeneration(prompt)
    
    if (activeNote) {
      let newContent = ''
      
      if (insertMode === 'replace') {
        newContent = response
      } else if (insertMode === 'append') {
        newContent = activeNote.content + '\n\n' + response
      } else if (insertMode === 'prepend') {
        newContent = response + '\n\n' + activeNote.content
      }
      
      updateNote(activeNote.id, { content: newContent })
    } else {
      const newNote = {
        id: Date.now().toString(),
        title: extractTitle(response),
        content: response,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setNotes(prev => [newNote, ...prev])
      setActiveNoteId(newNote.id)
    }
    
    setShowAIPanel(false)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        notes={notes}
        activeNoteId={activeNoteId}
        onSelectNote={setActiveNoteId}
        onCreateNote={createNote}
        onDeleteNote={deleteNote}
      />
      
      <div className="flex-1 flex flex-col">
        <Editor
          note={activeNote}
          onUpdate={updateNote}
          onOpenAI={() => setShowAIPanel(true)}
        />
      </div>

      {showAIPanel && (
        <AIPromptPanel
          onGenerate={generateAIContent}
          onClose={() => setShowAIPanel(false)}
        />
      )}
    </div>
  )
}

function simulateAIGeneration(prompt) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const responses = {
        'meeting notes': generateMeetingNotes(),
        'todo list': generateTodoList(),
        'essay': generateEssay(prompt),
        'summary': generateSummary(prompt),
        'default': generateGenericContent(prompt)
      }

      const lowerPrompt = prompt.toLowerCase()
      let response = responses.default

      if (lowerPrompt.includes('meeting') || lowerPrompt.includes('notes')) {
        response = responses['meeting notes']
      } else if (lowerPrompt.includes('todo') || lowerPrompt.includes('task')) {
        response = responses['todo list']
      } else if (lowerPrompt.includes('essay') || lowerPrompt.includes('write about')) {
        response = responses['essay']
      } else if (lowerPrompt.includes('summary') || lowerPrompt.includes('summarize')) {
        response = responses['summary']
      }

      resolve(response)
    }, 1500)
  })
}

function generateMeetingNotes() {
  return `# Team Meeting Notes
  
**Date:** ${new Date().toLocaleDateString()}
**Time:** ${new Date().toLocaleTimeString()}

## Attendees
- Team Member 1
- Team Member 2
- Team Member 3

## Agenda
1. Project updates
2. Upcoming deadlines
3. Resource allocation
4. Action items

## Discussion Points

### Project Updates
The team reviewed current progress on the main project. Key milestones have been achieved, and we're on track for the next sprint.

### Action Items
- [ ] Complete design review by end of week
- [ ] Schedule follow-up meeting
- [ ] Update project documentation
- [ ] Review feedback from stakeholders

## Next Steps
Follow up on action items and reconvene next week to assess progress.`
}

function generateTodoList() {
  return `# Task List

## Today's Priorities
- [ ] Review and respond to emails
- [ ] Complete project documentation
- [ ] Attend team standup meeting
- [ ] Work on feature implementation

## This Week
- [ ] Finish quarterly report
- [ ] Schedule one-on-one meetings
- [ ] Review code submissions
- [ ] Plan next sprint

## Long-term Goals
- [ ] Research new technologies
- [ ] Improve system architecture
- [ ] Mentor junior team members
- [ ] Optimize workflow processes`
}

function generateEssay(prompt) {
  const topic = prompt.replace(/write (an essay |about )?/gi, '').trim() || 'the given topic'
  
  return `# Essay: ${topic.charAt(0).toUpperCase() + topic.slice(1)}

## Introduction

The subject of ${topic} presents a fascinating area of exploration that merits careful consideration. In this essay, we will examine the key aspects, implications, and broader significance of this topic.

## Main Body

### Key Concepts

Understanding ${topic} requires examining its fundamental principles and how they interconnect. The foundation of this subject rests on several core ideas that have evolved over time.

### Analysis

When we analyze ${topic} more deeply, several patterns emerge. The relationship between different elements reveals important insights about the nature of this subject and its practical applications.

### Implications

The implications of ${topic} extend beyond immediate considerations. Long-term effects and broader contexts must be taken into account to fully appreciate its significance.

## Conclusion

In conclusion, ${topic} represents an important area worthy of continued study and reflection. The insights gained from this examination provide valuable perspective and understanding.`
}

function generateSummary(prompt) {
  return `# Summary

## Overview
This summary provides a concise overview of the key points and essential information.

## Key Takeaways
- Main point 1: Critical information that forms the foundation
- Main point 2: Supporting details that enhance understanding
- Main point 3: Contextual insights that provide perspective

## Details
The comprehensive analysis reveals several important aspects that warrant attention. Each element contributes to the overall understanding and provides valuable context.

## Conclusion
In summary, the essential elements outlined above form a coherent picture that enables clear comprehension of the subject matter.`
}

function generateGenericContent(prompt) {
  return `# ${prompt.charAt(0).toUpperCase() + prompt.slice(1)}

## Generated Content

Based on your request: "${prompt}"

This is automatically generated content that demonstrates the AI writing capability. The system analyzes your prompt and generates relevant, structured content.

## Key Points

1. **Contextual Understanding**: The AI interprets your request and determines the appropriate format and style.

2. **Structured Output**: Content is organized with clear headings, sections, and formatting for readability.

3. **Intelligent Formatting**: Markdown formatting is applied automatically to create professional-looking notes.

## Next Steps

You can continue editing this content, ask the AI to generate more sections, or create entirely new content based on different prompts.`
}

function extractTitle(content) {
  const firstLine = content.split('\n')[0]
  return firstLine.replace(/^#\s*/, '').trim() || 'Untitled Note'
}

export default App