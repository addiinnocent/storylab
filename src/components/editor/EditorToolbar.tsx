export default function EditorToolbar() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', borderBottom: '1px solid #e5e5e5' }}>
      <button aria-label="Bold" style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer' }}>
        <strong>B</strong>
      </button>
      <button aria-label="Italic" style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer' }}>
        <em>I</em>
      </button>
      <button aria-label="Underline" style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer' }}>
        <u>U</u>
      </button>
      <button aria-label="Strikethrough" style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer' }}>
        <s>S</s>
      </button>
      <div style={{ width: '1px', height: '20px', background: '#e5e5e5', margin: '0 4px' }} />
      <button aria-label="Heading 1" style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer' }}>
        H1
      </button>
      <button aria-label="Heading 2" style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer' }}>
        H2
      </button>
    </div>
  )
}
