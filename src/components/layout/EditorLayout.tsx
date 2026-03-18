import { useState } from 'react'
import Sidebar from '@/components/sidebar/Sidebar'
import EditorArea from '@/components/editor/EditorArea'
import EditorToolbar from '@/components/editor/EditorToolbar'

export default function EditorLayout() {
  const [activeChapterId, setActiveChapterId] = useState('1')
  const [content, setContent] = useState('')

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: '#ffffff' }}>
      <Sidebar activeChapterId={activeChapterId} onSelectChapter={setActiveChapterId} />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <EditorToolbar />
        <EditorArea content={content} onChange={setContent} />
        <div style={{ padding: '8px 16px', fontSize: '12px', color: '#999', borderTop: '1px solid #e5e5e5' }}>
          {content.split(/\s+/).filter(Boolean).length} words
        </div>
      </div>
    </div>
  )
}
