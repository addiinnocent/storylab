import SidebarHeader from '@/components/sidebar/SidebarHeader'
import ChapterList from '@/components/sidebar/ChapterList'

interface SidebarProps {
  activeChapterId: string
  onSelectChapter: (id: string) => void
}

export default function Sidebar({ activeChapterId, onSelectChapter }: SidebarProps) {
  return (
    <aside style={{ width: '200px', flexShrink: 0, borderRight: '1px solid #e5e5e5', display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
      <SidebarHeader />
      <ChapterList activeChapterId={activeChapterId} onSelectChapter={onSelectChapter} />
    </aside>
  )
}
