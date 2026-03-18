import { useState } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import EditorArea from '@/components/editor/EditorArea'
import EditorToolbar from '@/components/editor/EditorToolbar'

export default function EditorLayout() {
  const [activeChapterId, setActiveChapterId] = useState('1')
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const wordCount = content.split(/\s+/).filter(Boolean).length

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: Implement actual save functionality
      await new Promise(resolve => setTimeout(resolve, 800))
      console.log('Document saved:', { activeChapterId, content })
    } finally {
      setIsSaving(false)
    }
  }

  const handleExport = (format: 'markdown' | 'html' | 'pdf') => {
    // TODO: Implement export functionality
    console.log('Exporting as:', format, content)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: '#ffffff' }}>
      <Sidebar activeChapterId={activeChapterId} onSelectChapter={setActiveChapterId} />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <EditorToolbar
          chapterId={activeChapterId}
          chapterTitle={`Chapter ${activeChapterId}`}
          wordCount={wordCount}
          isSaving={isSaving}
          onSave={handleSave}
          onExport={handleExport}
        />
        <EditorArea namespace={activeChapterId} content={content} onChange={setContent} />
        <div style={{ padding: '8px 16px', fontSize: '12px', color: '#999', borderTop: '1px solid #e5e5e5' }}>
          {wordCount} words
        </div>
      </div>
    </div>
  )
}
