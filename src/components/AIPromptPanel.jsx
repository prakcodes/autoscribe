import React, { useState } from 'react'

const PROMPT_TEMPLATES = [
  { 
    label: 'Meeting Notes', 
    prompt: 'Generate professional meeting notes with agenda, discussion points, and action items',
    icon: '📝'
  },
  { 
    label: 'Todo List', 
    prompt: 'Create a comprehensive todo list with priorities and categories',
    icon: '✅'
  },
  { 
    label: 'Essay', 
    prompt: 'Write an essay about',
    icon: '📄',
    needsInput: true
  },
  { 
    label: 'Summary', 
    prompt: 'Summarize the following topic',
    icon: '📋',
    needsInput: true
  },
  { 
    label: 'Brainstorm', 
    prompt: 'Brainstorm ideas about',
    icon: '💡',
    needsInput: true
  },
  { 
    label: 'Research Notes', 
    prompt: 'Create research notes on',
    icon: '🔬',
    needsInput: true
  }
]

function AIPromptPanel({ onGenerate, onClose }) {
  const [prompt, setPrompt] = useState('')
  const [insertMode, setInsertMode] = useState('replace')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    await onGenerate(prompt, insertMode)
    setIsGenerating(false)
  }

  const handleTemplateClick = (template) => {
    if (template.needsInput) {
      setPrompt(template.prompt + ' ')
    } else {
      setPrompt(template.prompt)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <SparklesIcon className="w-7 h-7" />
              AI Content Generator
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <CloseIcon />
            </button>
          </div>
          <p className="text-purple-100 text-sm">
            Describe what you want to write and let AI generate it for you
          </p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Quick Templates
            </label>
            <div className="grid grid-cols-2 gap-3">
              {PROMPT_TEMPLATES.map((template, index) => (
                <button
                  key={index}
                  onClick={() => handleTemplateClick(template)}
                  className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{template.icon}</span>
                    <span className="font-medium text-gray-900 text-sm">
                      {template.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Your Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., 'Write meeting notes for a project kickoff' or 'Create a todo list for launching a product'"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
              rows="4"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Insert Mode
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setInsertMode('replace')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                  insertMode === 'replace'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-sm">Replace</div>
                <div className="text-xs mt-1 opacity-75">Replace all content</div>
              </button>
              <button
                onClick={() => setInsertMode('append')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                  insertMode === 'append'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-sm">Append</div>
                <div className="text-xs mt-1 opacity-75">Add to end</div>
              </button>
              <button
                onClick={() => setInsertMode('prepend')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                  insertMode === 'prepend'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-sm">Prepend</div>
                <div className="text-xs mt-1 opacity-75">Add to start</div>
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <LoadingSpinner />
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5" />
                  Generate Content
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
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

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  )
}

export default AIPromptPanel