import EditorMock from '@/components/editor/EditorMock'

interface EditorAreaProps {
  content: string
  onChange: (content: string) => void
}

export default function EditorArea({ content, onChange }: EditorAreaProps) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#f9f9f9', padding: '32px' }}>
      <EditorMock content={content} onChange={onChange} />
    </div>
  )
}
