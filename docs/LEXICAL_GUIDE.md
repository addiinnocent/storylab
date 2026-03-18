# Lexical Editor Implementation Guide

## Current Implementation Status

The Storylab editor now uses **Lexical v0.41.0** with a modern, modular architecture.

### Core Components

- **`src/components/editor/LexicalEditor.tsx`** - Main editor component
  - Props-based API (no context dependencies)
  - Lexical plugins: ToolbarPlugin, AutoLinkPlugin, HistoryPlugin, ListPlugin, LinkPlugin
  - Word count tracking
  - Real-time content serialisation

- **`src/components/editor/EditorToolbar.tsx`** - Document-level toolbar
  - Save/publish functionality (TODO: implement)
  - Export menu (Markdown, HTML, PDF)
  - Chapter information display
  - Word count display

- **`src/components/editor/EditorArea.tsx`** - Editor container
  - Wraps LexicalEditor with layout styling
  - Handles content changes and callbacks

- **`src/components/layout/EditorLayout.tsx`** - Main layout
  - Integrates sidebar, toolbar, and editor
  - Manages document state and chapter selection

### Plugin Architecture

Located in `src/components/editor/lexical/plugins/`:

- **ToolbarPlugin** - Formatting toolbar (bold, italic, headings, lists, tables, colors, fonts)
  - Fully functional with modern Lexical APIs
  - Removes deprecated `DEPRECATED_$isGridSelection` (replaced with `$isTableSelection`)
  - Uses proper IS_APPLE detection for keyboard shortcuts

- **AutoLinkPlugin** - Auto-detect and convert URLs to links
- **HistoryPlugin** - Undo/redo support
- **ListPlugin** - List formatting
- **LinkPlugin** - Link management

### Node Types

- **BranchNode** (`src/components/editor/lexical/nodes/BranchNode.ts`) - Custom coloured text node
  - Proper serialisation/deserialisation with `importJSON`/`exportJSON`
  - Follows Lexical conventions with `$applyNodeReplacement`

---

## Lexical Best Practices

Based on [facebook/lexical](https://github.com/facebook/lexical):

### 1. **Editor Initialisation**

✅ Always use `LexicalComposer` with:
- Unique namespace for each editor instance
- Error boundary for graceful error handling
- Configured nodes list
- Theme object

```typescript
<LexicalComposer initialConfig={{
  namespace: uniqueId,
  nodes: [HeadingNode, ListNode, ...],
  theme: editorTheme,
  onError: (error) => console.error(error),
}}>
  {/* plugins and content */}
</LexicalComposer>
```

### 2. **State Serialisation**

✅ Use immutable state model:
- Call `editorState.toJSON()` for serialisation
- Pass JSON string to `parse()` when loading
- Enables undo/redo and time-travel debugging

```typescript
const serialised = editorState.toJSON();
const restored = JSON.parse(serialised);
```

### 3. **Custom Nodes**

✅ Follow Lexical conventions:
- Import/export `SerializedNodeType` for type safety
- Implement `importJSON` and `exportJSON` static methods
- Wrap factory with `$applyNodeReplacement()`
- Call `setFormat()`, `setDetail()`, `setMode()`, `setStyle()` in importJSON

```typescript
static importJSON(serialisedNode: SerializedCustomNode): CustomNode {
  const node = new CustomNode(serialisedNode.data);
  node.setFormat(serialisedNode.format);
  return node;
}

export function $createCustomNode(data: string): CustomNode {
  return $applyNodeReplacement(new CustomNode(data));
}
```

### 4. **Command System**

✅ Use Lexical's command system for custom behaviour:

```typescript
import { createCommand, LexicalCommand } from 'lexical';

export const MY_COMMAND: LexicalCommand<boolean> = createCommand();

// In plugin:
editor.registerCommand(MY_COMMAND, (payload) => {
  // handle command
  return true; // consumed
}, COMMAND_PRIORITY_NORMAL);
```

### 5. **Plugin Structure**

✅ Plugins should:
- Use `useLexicalComposerContext()` to get editor instance
- Return `null` (no JSX needed)
- Register cleanup handlers to prevent memory leaks
- Follow React hooks patterns (useEffect, useCallback)

```typescript
export function MyPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(MY_COMMAND, () => {
      // handle
      return true;
    }, COMMAND_PRIORITY_NORMAL);
  }, [editor]);

  return null;
}
```

### 6. **Collaboration**

ℹ️ For multi-user editing, integrate **Yjs**:
- Lexical has excellent Yjs binding support
- Enables real-time collaborative editing
- See: [`@lexical/yjs`](https://github.com/facebook/lexical/tree/main/packages/lexical-yjs)

### 7. **Markdown & HTML Export**

ℹ️ Use official exporters:
- `@lexical/markdown` - Convert to/from Markdown
- `@lexical/html` - Convert to/from HTML
- Custom exporters for other formats

```typescript
import { $convertToMarkdownString } from '@lexical/markdown';

const markdown = editor.getEditorState().read(() => {
  return $convertToMarkdownString(markdownTransformers);
});
```

### 8. **Performance Optimisation**

✅ Best practices:
- Use `editor.update()` for batched state changes
- Avoid unnecessary `useEffect` re-runs with proper dependency arrays
- Use `useLexicalComposerContext()` only once per plugin
- Memoize callbacks with `useCallback`
- Use `nodesOfType()` for efficient node queries

```typescript
editor.update(() => {
  const nodes = $nodesOfType(YourNode);
  nodes.forEach(node => {
    // batch modifications
  });
});
```

### 9. **Styling & CSS Classes**

✅ The theme object maps semantic names to CSS classes:

```typescript
const theme = {
  paragraph: 'editor-paragraph',
  heading: {
    h1: 'editor-h1',
    h2: 'editor-h2',
  },
  text: {
    bold: 'editor-textBold',
    italic: 'editor-textItalic',
  },
};
```

### 10. **Error Handling**

✅ Always provide error boundary:

```typescript
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

<RichTextPlugin
  contentEditable={<ContentEditable />}
  placeholder={<Placeholder />}
  ErrorBoundary={LexicalErrorBoundary}
/>
```

---

## Next Steps: Recommended Improvements

### Phase 1: Core Features (Priority: High)

- [ ] **Implement save functionality** (EditorToolbar.handleSave)
  - Persist content to database/filesystem
  - Show save status feedback

- [ ] **Implement export** (EditorToolbar.handleExport)
  - Install `@lexical/markdown` and `@lexical/html`
  - Add Markdown exporter
  - Add HTML exporter
  - Add PDF exporter (install `html2pdf.js`)

- [ ] **Real-time word/character counts**
  - Currently basic split-based counting
  - Consider using `Intl.Segmenter` with fallback for accurate Unicode handling

### Phase 2: Enhanced Editing (Priority: Medium)

- [ ] **Table support**
  - `@lexical/table` is already installed
  - Add TABLE_INSERT_COMMAND to ToolbarPlugin
  - Style table cells and borders

- [ ] **Code block syntax highlighting**
  - Already have CodeNode
  - Add `@lexical/code` plugins for language selection
  - Integrate Prism or Highlight.js

- [ ] **Link editing dialog**
  - Allow editing link URLs after creation
  - Show link preview on hover

- [ ] **Drag-and-drop**
  - `@lexical/react/LexicalDragDropPastePlugin`
  - Upload images, embed media

### Phase 3: Collaboration & Sync (Priority: Medium)

- [ ] **Multi-user editing with Yjs**
  - Install `yjs` and `@lexical/yjs`
  - Connect to WebSocket server for real-time sync
  - Add presence indicators (who's editing)

- [ ] **Comments/suggestions**
  - Custom nodes for comments/tracked changes
  - Side-panel for discussion

- [ ] **Document history/versioning**
  - Store snapshots of editor state
  - Diff viewer for changes

### Phase 4: Advanced Features (Priority: Low)

- [ ] **Footnotes/endnotes**
  - Custom node type

- [ ] **Math equations**
  - Integrate MathJax or KaTeX

- [ ] **Mentions & @references**
  - Custom suggestion plugin

- [ ] **Templates & styles**
  - Predefined document templates
  - Style presets

---

## Testing the Editor

### TypeScript Compilation
```bash
npx tsc --noEmit
```

### Run Tests
```bash
npm run test:frontend
# Note: Existing tests reference old EditorMock - update to use LexicalEditor
```

### Start Dev Server
```bash
npm run tauri dev
# Remember to close immediately after testing
```

### Test Coverage
- [ ] Typing and basic formatting (bold, italic, headings)
- [ ] List creation and nesting
- [ ] Undo/redo functionality
- [ ] URL auto-linking
- [ ] Save functionality
- [ ] Export to Markdown
- [ ] Word count accuracy
- [ ] Multiple chapter switching

---

## Useful Resources

- **Lexical GitHub**: https://github.com/facebook/lexical
- **Lexical Documentation**: https://lexical.dev/
- **Playground Example**: https://github.com/facebook/lexical/tree/main/examples/vanilla-ts
- **React Integration**: https://github.com/facebook/lexical/tree/main/packages/lexical-react
- **Official Packages**: https://github.com/facebook/lexical/tree/main/packages

---

## File Structure Reference

```
src/components/editor/
├── LexicalEditor.tsx          ← Main editor (Lexical + plugins)
├── EditorArea.tsx             ← Container/wrapper
├── EditorToolbar.tsx          ← Document toolbar (NEW)
├── EditorToolbar.css          ← Toolbar styles (NEW)
└── lexical/
    ├── style.css              ← Editor theme styles
    ├── commands.ts            ← Custom Lexical commands
    ├── nodes/
    │   └── BranchNode.ts      ← Custom coloured text node
    ├── plugins/
    │   ├── ToolbarPlugin/     ← Formatting toolbar
    │   ├── AutoLinkPlugin/    ← URL auto-linking
    │   ├── OnChangeDebouncePlugin.tsx
    │   └── (others)
    ├── themes/
    │   ├── PlaygroundEditorTheme.ts
    │   └── PlaygroundEditorTheme.css
    └── ui/
        ├── DropDown.tsx
        ├── Modal.tsx
        ├── ColorPicker.tsx
        └── (other UI components)

src/components/layout/
└── EditorLayout.tsx           ← Layout integration (UPDATED)
```

---

## Notes

- **Remaining TypeScript Errors**: ~38 errors in legacy plugin code (TreeViewPlugin, TableOfContentsPlugin, useModal) - these can be fixed incrementally as needed
- **Unused Features**: PDF export deferred (needs `@react-pdf/renderer`), TreeView deferred
- **Architecture Decision**: Props-based LexicalEditor (no context) allows easier testing and reusability
- **Theme**: Using PlaygroundEditorTheme from Lexical playground - customise as needed

---

Last updated: 2026-03-18
