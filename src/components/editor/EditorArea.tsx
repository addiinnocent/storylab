import { useEffect } from 'react'
import LexicalEditor from '@/components/editor/LexicalEditor'
import EditorErrorBoundary from '@/components/editor/EditorErrorBoundary'

interface EditorAreaProps {
  chapterId: string
  content?: string
  onChange: (content: string) => void
  onWordCountChange?: (wordCount: number) => void
}

export default function EditorArea({ chapterId, content, onChange, onWordCountChange }: EditorAreaProps) {
  // Initialize word count when content loads
  useEffect(() => {
    if (content && onWordCountChange) {
      try {
        const parsed = JSON.parse(content)
        // Extract text content from Lexical state
        let totalText = ''
        const extractText = (node: any): string => {
          if (node.type === 'text') return node.text || ''
          if (node.children && Array.isArray(node.children)) {
            return node.children.map(extractText).join('')
          }
          return ''
        }
        if (parsed.root && parsed.root.children) {
          totalText = parsed.root.children.map(extractText).join(' ')
        }
        const wordCount = totalText.split(/\s+/).filter(Boolean).length
        onWordCountChange(wordCount)
      } catch (e) {
        // If not JSON or parsing fails, fall back to 0
        onWordCountChange(0)
      }
    } else if (!content && onWordCountChange) {
      onWordCountChange(0)
    }
  }, [content, onWordCountChange])

  const handleContentChange = (serialisedState: string, wordCount: number) => {
    console.log(`[EDITOR] Content changed: ${serialisedState.length} bytes`)
    onChange(serialisedState)
    if (onWordCountChange) {
      onWordCountChange(wordCount)
    }
  }

  return (
    <EditorErrorBoundary>
      <div style={{ flex: 1, overflowY: 'auto', background: '#f9f9f9' }}>
        <LexicalEditor
          chapterId={chapterId}
          initialContent={content}
          onContentChange={handleContentChange}
        />
      </div>
    </EditorErrorBoundary>
  )
}
