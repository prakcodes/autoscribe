import React, { useState, useEffect } from 'react'

function Editor({ note, onUpdate, onOpenAI }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content)
    } else {
      setTitle('')
      setContent('')
    }
  }, [note])

  const handleTitleChange = (e) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    if (note) {
      onUpdate(note.id, { title: newTitle })
    }
  }

  const handleContentChange = (e) => {
    const newContent = e.target.value
    setContent(newContent)
    if (note) {
      onUpdate(note.id, { content: newContent })
    }
  }

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <SparklesIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Note Selected</h2>
          <p className="text-gray-500 mb-6">Create a new note or select one from the sidebar</p>
          <button
            onClick={onOpenAI}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all flex items-center gap-2 mx-auto"
          >
            <SparklesIcon className="w-5 h-5" />
            Generate with AI
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Note Title"
          className="text-2xl font-bold text-gray-900 outline-none flex-1 bg-transparent"
        />
        <button
          onClick={onOpenAI}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
        >
          <SparklesIcon className="w-5 h-5" />
          AI Generate
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Start typing or use AI to generate content..."
          className="w-full h-full outline-none resize-none text-gray-900 text-base leading-relaxed bg-transparent font-mono"
          style={{ minHeight: '100%' }}
        />
      </div>

      {content && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Preview</h3>
            <div 
              className="prose prose-sm max-w-none bg-white p-4 rounded-lg border border-gray-200"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function renderMarkdown(text) {
  let html = text
  
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
  
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  
  html = html.replace(/^- \[ \] (.*$)/gim, '<div class="flex items-start gap-2 my-1"><input type="checkbox" class="mt-1" disabled /><span>$1</span></div>')
  html = html.replace(/^- \[x\] (.*$)/gim, '<div class="flex items-start gap-2 my-1"><input type="checkbox" checked class="mt-1" disabled /><span class="line-through text-gray-500">$1</span></div>')
  
  html = html.replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
  html = html.replace(/(<li.*<\/li>)/s, '<ul class="list-disc my-2">$1</ul>')
  
  html = html.replace(/\n\n/g, '<br/><br/>')
  
  return html
}

function SparklesIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L13.5 7.5L18 9L13.5 10.5L12 15L10.5 10.5L6 9L10.5 7.5L12 3Z" fill="currentColor"/>
      <path d="M19 12L19.75 14.25L22 15L19.75 15.75L19 18L18.25 15.75L16 15L18.25 14.25L19 12Z" fill="currentColor"/>
      <path d="M19 3L19.5 4.5L21 5L19.5 5.5L19 7L18.5 5.5L17 5L18.5 4.5L19 3Z" fill="currentColor"/>
    </svg>
  )
}

export default Editor