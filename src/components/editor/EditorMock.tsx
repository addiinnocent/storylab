interface EditorMockProps {
  content: string
  onChange: (content: string) => void
}

export default function EditorMock({ content, onChange }: EditorMockProps) {
  return (
    <div style={{ margin: '0 auto', maxWidth: '640px', borderRadius: '4px', background: '#ffffff', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <textarea
        value={content}
        onChange={(e) => onChange(e.currentTarget.value)}
        placeholder="Begin writing your story here..."
        style={{ width: '100%', height: '500px', resize: 'none', outline: 'none', fontFamily: 'Georgia, serif', fontSize: '16px', lineHeight: '1.6', background: 'transparent', border: 'none', color: '#0f0f0f' }}
      />
    </div>
  )
}
