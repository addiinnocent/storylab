import LexicalEditor from '@/components/editor/LexicalEditor'

interface EditorAreaProps {
  namespace: string
  content?: string
  onChange: (content: string) => void
}

export default function EditorArea({ namespace, content, onChange }: EditorAreaProps) {
  const handleContentChange = (serialisedState: string, _wordCount: number) => {
    onChange(serialisedState)
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#f9f9f9' }}>
      <LexicalEditor
        namespace={namespace}
        initialContent={content}
        onContentChange={handleContentChange}
      />
    </div>
  )
}
