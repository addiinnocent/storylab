const MOCK_CHAPTERS = [
  { id: '1', title: 'Chapter 1 — The Beginning' },
  { id: '2', title: 'Chapter 2 — Rising Action' },
  { id: '3', title: 'Chapter 3 — The Turning Point' },
]

interface ChapterListProps {
  activeChapterId: string
  onSelectChapter: (id: string) => void
}

export default function ChapterList({ activeChapterId, onSelectChapter }: ChapterListProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
        {MOCK_CHAPTERS.map((chapter) => (
          <button
            key={chapter.id}
            onClick={() => onSelectChapter(chapter.id)}
            aria-label={chapter.title}
            style={{
              display: 'block',
              width: '100%',
              padding: '8px 16px',
              border: 'none',
              background: activeChapterId === chapter.id ? '#0f0f0f' : 'transparent',
              color: activeChapterId === chapter.id ? '#ffffff' : '#0f0f0f',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '14px',
            }}
          >
            {chapter.title}
          </button>
        ))}
      </div>
      <div style={{ padding: '16px', borderTop: '1px solid #e5e5e5' }}>
        <button
          style={{
            width: '100%',
            padding: '8px 16px',
            border: '1px solid #e5e5e5',
            background: 'white',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          + New Chapter
        </button>
      </div>
    </div>
  )
}
