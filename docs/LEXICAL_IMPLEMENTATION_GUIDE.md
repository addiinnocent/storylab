# Lexical Implementation Guide for Storylab

**Date:** March 2026

## Current Lexical Setup in Storylab

### Status ✅
Lexical is fully integrated and operational. The editor component in `src/EditorComponent.tsx` demonstrates sophisticated use of Lexical's plugin system.

### Dependencies Issue ⚠️
Lexical packages are **imported but not declared** in `package.json`. This should be fixed to ensure version stability and explicit dependency management.

## Adding Lexical Packages to package.json

### Current State (package.json)
```json
{
  "dependencies": {
    "@tauri-apps/api": "^2",
    "@tauri-apps/plugin-opener": "^2",
    "fastify": "^5.8.2",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  }
}
```

### Recommended Changes
Add all explicitly imported Lexical packages:

```bash
npm install \
  lexical \
  @lexical/react \
  @lexical/rich-text \
  @lexical/table \
  @lexical/list \
  @lexical/code \
  @lexical/link \
  @lexical/history
```

Or add to `package.json`:
```json
{
  "dependencies": {
    // ... existing deps ...
    "lexical": "^0.41.0",
    "@lexical/react": "^0.41.0",
    "@lexical/rich-text": "^0.41.0",
    "@lexical/table": "^0.41.0",
    "@lexical/list": "^0.41.0",
    "@lexical/code": "^0.41.0",
    "@lexical/link": "^0.41.0",
    "@lexical/history": "^0.41.0"
  }
}
```

**Latest Version:** 0.41.0 (as of March 2026)

### Why This Matters
1. **Explicit Dependencies** - Others can see what Lexical features are used
2. **Version Control** - Prevents accidental upgrades/downgrades via lockfile
3. **Security Updates** - Easy to apply patches when needed
4. **Documentation** - New developers see the stack clearly

## Understanding Storylab's Current Architecture

### Component Hierarchy
```
LexicalComposer (config: nodes, theme, onError)
├── ToolbarPlugin (custom formatting controls)
├── RichTextPlugin (enables formatting)
│   └── ContentEditable (the editable area)
├── OnChangePlugin (raw change tracking)
├── OnChangeDebouncePlugin (debounced save - 1000ms)
├── HistoryPlugin (undo/redo)
├── ListPlugin (list functionality)
├── LinkPlugin (link creation/editing)
├── AutoLinkPlugin (automatic URL linking)
├── TableOfContentsPlugin (custom - auto-generates from headings)
├── TreeViewPlugin (custom - shows document structure)
├── PdfPlugin (custom - exports to PDF)
└── WordCountPlugin (custom - language-aware word counting)
```

### Data Flow
```
User types in ContentEditable
    ↓
Lexical updates internal editor state
    ↓
OnChangePlugin fires (real-time, unthrottled)
    ↓
OnChangeDebouncePlugin fires after 1000ms idle
    ↓
doc.state = editorState.toJSON() (serialize)
    ↓
pushDocument() (send to server/storage)
```

### State Persistence
```typescript
// On load:
initialEditorState = JSON.stringify(doc.state)
// → Passed to LexicalComposer
// → Deserialized and restored

// On save:
editorState.toJSON() → serialized
// → Stored in doc.state
// → Persisted to backend
```

## Toolbar Customisation with Lucide Icons

The formatting toolbar uses **lucide-react** icons for a consistent, modern appearance.

### Dependencies
```bash
npm install lucide-react
```

### Icon Setup in ToolbarPlugin

Lucide icons are imported at the top of `src/components/editor/lexical/plugins/ToolbarPlugin/index.tsx`:

```typescript
import {
  Undo2, Redo2, Type, Heading1, Heading2, Heading3,
  List, ListOrdered, CheckSquare, Quote, Code, Code2,
  Bold, Italic, Underline, Link, Strikethrough, Subscript,
  Superscript, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Indent, Outdent, MoreHorizontal, RotateCcw, Table2, Palette, Highlighter
} from 'lucide-react'
```

### Current Toolbar Icons

| Function | Icon | Size |
|----------|------|------|
| Undo | `<Undo2 size={18} />` | 18px |
| Redo | `<Redo2 size={18} />` | 18px |
| Paragraph | `<Type size={18} />` | 18px |
| Heading 1–3 | `<Heading1 />`, etc. | 18px |
| Bullet List | `<List size={18} />` | 18px |
| Numbered List | `<ListOrdered size={18} />` | 18px |
| Checklist | `<CheckSquare size={18} />` | 18px |
| Quote | `<Quote size={18} />` | 18px |
| Code Block | `<Code size={18} />` | 18px |
| **Bold** | `<Bold size={18} />` | 18px |
| *Italic* | `<Italic size={18} />` | 18px |
| <u>Underline</u> | `<Underline size={18} />` | 18px |
| Inline Code | `<Code2 size={18} />` | 18px |
| Link | `<Link size={18} />` | 18px |
| Strikethrough | `<Strikethrough size={16} />` | 16px |
| Subscript | `<Subscript size={16} />` | 16px |
| Superscript | `<Superscript size={16} />` | 16px |
| Clear Formatting | `<RotateCcw size={16} />` | 16px |
| Text Colour | `<Palette size={18} />` | 18px |
| Background Colour | `<Highlighter size={18} />` | 18px |
| Left Align | `<AlignLeft size={18} />` | 18px |
| Centre Align | `<AlignCenter size={18} />` | 18px |
| Right Align | `<AlignRight size={18} />` | 18px |
| Justify | `<AlignJustify size={18} />` | 18px |
| Indent | `<Indent size={16} />` | 16px |
| Outdent | `<Outdent size={16} />` | 16px |
| More Options | `<MoreHorizontal size={18} />` | 18px |
| Table | `<Table2 size={18} />` | 18px |
| Dropdown | `<ChevronDown size={16} />` | 16px |

### Adding New Icons to the Toolbar

1. **Import the icon** from lucide-react:
   ```typescript
   import { YourIcon } from 'lucide-react'
   ```

2. **Use it in a button**:
   ```typescript
   <button className="toolbar-item">
     <YourIcon size={18} />
   </button>
   ```

3. **For dropdown buttons**, pass the icon to the `DropDown` component:
   ```typescript
   <DropDown
     buttonIcon={<YourIcon size={18} />}
     // ... other props
   >
   ```

### Finding Icons

Browse 1000+ available icons at **[lucide.dev](https://lucide.dev/icons)**.

Common icon names:
- `Plus`, `Minus`, `X`, `Check` — generic actions
- `Save`, `Download`, `Upload`, `Trash2` — file operations
- `Edit`, `Copy`, `Paste`, `Search` — text operations
- `Eye`, `EyeOff`, `Lock`, `Unlock` — visibility
- `Settings`, `Menu`, `Sliders` — controls
- `AlertCircle`, `Info`, `HelpCircle` — feedback

### Button Styling with Icons

Toolbar buttons automatically use flexbox layout with proper icon alignment:

```css
.toolbar button.toolbar-item {
  display: flex;
  align-items: center;
  gap: 6px;  /* Space between icon and text */
  padding: 8px;
  border-radius: 10px;
}
```

Icons are coloured #777 with 0.6 opacity. Active buttons (`.active` class) increase opacity to 1.0.

## Adding New Plugins: Pattern & Examples

### Plugin Structure
```typescript
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect } from 'react'

interface MyPluginProps {
  // Plugin configuration
}

export default function MyPlugin(props: MyPluginProps) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    // Register listeners, commands, etc.

    return () => {
      // Cleanup
    }
  }, [editor])

  // Most plugins return null (they just register handlers)
  return null
}
```

### Example 1: Target Word Count Plugin
```typescript
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect, useState } from 'react'
import { $getRoot } from 'lexical'

interface TargetWordCountPluginProps {
  targetWords: number
  onProgress?: (current: number, target: number) => void
}

export default function TargetWordCountPlugin({
  targetWords,
  onProgress
}: TargetWordCountPluginProps) {
  const [editor] = useLexicalComposerContext()
  const [currentWords, setCurrentWords] = useState(0)

  useEffect(() => {
    return editor.registerTextContentListener((textContent) => {
      const segments = Array.from(
        new Intl.Segmenter('en', { granularity: 'word' }).segment(textContent)
      )
      const wordCount = segments.filter(s => s.isWordLike).length
      setCurrentWords(wordCount)
      onProgress?.(wordCount, targetWords)
    })
  }, [editor, targetWords, onProgress])

  const percentage = (currentWords / targetWords) * 100

  return (
    <div className="target-word-count">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <span className="word-count-text">
        {currentWords.toLocaleString()} / {targetWords.toLocaleString()} words
      </span>
    </div>
  )
}
```

### Example 2: Reading Statistics Plugin
```typescript
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect, useState } from 'react'

interface Statistics {
  words: number
  sentences: number
  characters: number
  readingTimeMinutes: number
  averageSentenceLength: number
}

export default function StatisticsPlugin() {
  const [editor] = useLexicalComposerContext()
  const [stats, setStats] = useState<Statistics | null>(null)

  useEffect(() => {
    return editor.registerTextContentListener((textContent) => {
      // Word count
      const segments = Array.from(
        new Intl.Segmenter('en', { granularity: 'word' }).segment(textContent)
      )
      const words = segments.filter(s => s.isWordLike).length

      // Sentence count (simple heuristic)
      const sentences = (textContent.match(/[.!?]+/g) || []).length || 1

      // Character count
      const characters = textContent.length

      // Reading time (average 200 words per minute)
      const readingTimeMinutes = Math.ceil(words / 200)

      // Average sentence length
      const averageSentenceLength = Math.round(words / sentences)

      setStats({
        words,
        sentences,
        characters,
        readingTimeMinutes,
        averageSentenceLength
      })
    })
  }, [editor])

  if (!stats) return null

  return (
    <div className="statistics">
      <div>Words: {stats.words.toLocaleString()}</div>
      <div>Sentences: {stats.sentences}</div>
      <div>Characters: {stats.characters.toLocaleString()}</div>
      <div>Reading Time: ~{stats.readingTimeMinutes} min</div>
      <div>Avg Sentence Length: {stats.averageSentenceLength} words</div>
    </div>
  )
}
```

### Example 3: Readability Analysis Plugin
```typescript
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect, useState } from 'react'

interface ReadabilityMetrics {
  flesch: number // 0-100, higher = easier
  passiveVoiceRatio: number
  averageWordLength: number
}

export default function ReadabilityPlugin() {
  const [editor] = useLexicalComposerContext()
  const [metrics, setMetrics] = useState<ReadabilityMetrics | null>(null)

  useEffect(() => {
    return editor.registerTextContentListener((textContent) => {
      // Flesch Reading Ease (simplified)
      const sentences = (textContent.match(/[.!?]+/g) || []).length || 1
      const words = textContent.split(/\s+/).filter(w => w).length
      const syllables = estimateSyllables(textContent)

      const flesch = 206.835
        - (1.015 * (words / sentences))
        - (84.6 * (syllables / words))

      // Passive voice detection (heuristic)
      const passiveVoices = (textContent.match(/\b(was|were|is|are|been|be)\s+\w+ed\b/gi) || []).length
      const passiveVoiceRatio = (passiveVoices / sentences) * 100

      // Average word length
      const avgWordLength = Math.round(textContent.length / words)

      setMetrics({
        flesch: Math.max(0, Math.min(100, flesch)),
        passiveVoiceRatio,
        averageWordLength: avgWordLength
      })
    })
  }, [editor])

  if (!metrics) return null

  const readabilityLevel = metrics.flesch > 60 ? 'Easy' : metrics.flesch > 40 ? 'Moderate' : 'Difficult'

  return (
    <div className="readability">
      <div>Reading Level: {readabilityLevel} ({Math.round(metrics.flesch)})</div>
      <div>Passive Voice: {metrics.passiveVoiceRatio.toFixed(1)}%</div>
      <div>Avg Word Length: {metrics.averageWordLength} chars</div>
    </div>
  )
}

function estimateSyllables(text: string): number {
  const syllableCount = (text.match(/[aeiouy]/gi) || []).length
  return Math.max(1, syllableCount)
}
```

## Creating Custom Node Types

### Example: ChapterNode
```typescript
import {
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread
} from 'lexical'
import { DecoratorNode } from 'lexical'
import { ReactNode } from 'react'

type SerializedChapterNode = Spread<
  {
    chapterNumber: number
    chapterTitle: string
  },
  SerializedLexicalNode
>

export class ChapterNode extends DecoratorNode<ReactNode> {
  __chapterNumber: number
  __chapterTitle: string

  constructor(chapterNumber: number, chapterTitle: string, key?: NodeKey) {
    super(key)
    this.__chapterNumber = chapterNumber
    this.__chapterTitle = chapterTitle
  }

  static getType(): string {
    return 'chapter'
  }

  static clone(node: ChapterNode): ChapterNode {
    return new ChapterNode(node.__chapterNumber, node.__chapterTitle, node.__key)
  }

  createDOM(): HTMLElement {
    const div = document.createElement('div')
    div.className = 'chapter-break'
    return div
  }

  updateDOM(): false {
    return false
  }

  decorate(): ReactNode {
    return (
      <div className="chapter-header">
        <h1>Chapter {this.__chapterNumber}</h1>
        <h2>{this.__chapterTitle}</h2>
      </div>
    )
  }

  static importJSON(serializedNode: SerializedChapterNode): ChapterNode {
    return new ChapterNode(
      serializedNode.chapterNumber,
      serializedNode.chapterTitle
    )
  }

  exportJSON(): SerializedChapterNode {
    return {
      type: 'chapter',
      version: 1,
      chapterNumber: this.__chapterNumber,
      chapterTitle: this.__chapterTitle
    }
  }
}
```

### Register in Editor Config
```typescript
<LexicalComposer initialConfig={{
  namespace: 'storylab',
  nodes: [
    ChapterNode,
    HeadingNode,
    // ... other nodes
  ]
}}>
```

## Testing Lexical Components

### Unit Test Example (Vitest)
```typescript
import { render, screen } from '@testing-library/react'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { describe, it, expect } from 'vitest'

describe('EditorComponent', () => {
  it('should render with initial state', () => {
    const initialState = '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}'

    render(
      <LexicalComposer initialConfig={{
        namespace: 'test',
        editorState: initialState
      }}>
        <RichTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={<div>Empty</div>}
        />
      </LexicalComposer>
    )

    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })
})
```

## Performance Optimization Tips

1. **Debounce Expensive Operations**
   ```typescript
   const debouncedUpdate = useCallback(
     debounce((editor) => {
       // Expensive calculation
       calculateReadability(editor)
     }, 1000),
     []
   )
   ```

2. **Use Editor.update() for Batched Changes**
   ```typescript
   editor.update(() => {
     // All changes here are batched
     // Only one state update instead of N
   })
   ```

3. **Register Selective Listeners**
   ```typescript
   // Only listen to text content changes (not selection)
   editor.registerTextContentListener((text) => {
     // This fires less frequently than general listener
   })
   ```

4. **Virtualize Large Lists**
   ```typescript
   // For large documents with many chapters,
   // use react-window or similar to virtualize
   ```

## Deployment & Version Management

1. **Lock Dependencies**
   ```bash
   npm ci  # Use lockfile
   ```

2. **Test After Updates**
   ```bash
   npm test:frontend  # Test editor changes
   npm test:server    # Ensure API changes work
   ```

3. **Monitor Breaking Changes**
   - Follow Lexical release notes
   - Test major/minor version upgrades before deploying
   - Consider semantic versioning in package.json

## Resources for Learning

1. **Official Documentation** - https://lexical.dev/docs
2. **Playground** - https://playground.lexical.dev/
3. **GitHub Examples** - https://github.com/facebook/lexical/tree/main/playground
4. **Community** - Lexical discussions on GitHub Discussions

## Troubleshooting

### Issue: "Cannot find module '@lexical/react'"
**Solution:** Add to package.json and run `npm install`

### Issue: Editor state doesn't persist
**Solution:** Ensure `OnChangeDebouncePlugin` is calling `pushDocument()` correctly

### Issue: Plugin not firing
**Solution:**
1. Check plugin is added to JSX in EditorComponent
2. Verify `useLexicalComposerContext()` is inside LexicalComposer
3. Check browser console for errors

### Issue: Performance degradation with large documents
**Solution:**
1. Profile with DevTools
2. Check for unnecessary re-renders
3. Use `editor.update()` for batched changes
4. Consider lazy-loading plugins for chapters not in view
