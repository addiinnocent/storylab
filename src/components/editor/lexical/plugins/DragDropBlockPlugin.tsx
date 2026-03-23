import { useRef, useEffect, useState } from 'react'
import { GripVertical } from 'lucide-react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { DraggableBlockPlugin_EXPERIMENTAL } from '@lexical/react/LexicalDraggableBlockPlugin'
import './DragDropBlockPlugin.css'

function isOnMenu(element: HTMLElement): boolean {
  return !!element.closest('.draggable-block-menu')
}

export default function DragDropBlockPlugin({
  anchorElem,
  showDragMenu = true,
}: {
  anchorElem?: HTMLElement
  showDragMenu?: boolean
}) {
  const [editor] = useLexicalComposerContext()
  const [containerElem, setContainerElem] = useState<HTMLElement | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const targetLineRef = useRef<HTMLDivElement>(null)

  // Get the editor container element
  useEffect(() => {
    const editorElement = editor.getRootElement()
    if (editorElement) {
      const container = editorElement.closest('.editor-container')
      if (container) {
        setContainerElem(container as HTMLElement)
      }
    }
  }, [editor])

  const resolvedAnchorElem = anchorElem || containerElem || document.body

  return (
    <DraggableBlockPlugin_EXPERIMENTAL
      anchorElem={resolvedAnchorElem}
      menuRef={menuRef}
      targetLineRef={targetLineRef}
      menuComponent={
        <div
          ref={menuRef}
          className={`draggable-block-menu ${showDragMenu ? '' : 'draggable-block-menu--hidden'}`}
          title="Drag to move block"
          draggable={true}
        >
          <GripVertical size={16} />
        </div>
      }
      targetLineComponent={
        <div ref={targetLineRef} className="draggable-block-target-line" />
      }
      isOnMenu={isOnMenu}
    />
  )
}
