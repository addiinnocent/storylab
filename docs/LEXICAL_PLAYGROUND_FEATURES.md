# Lexical Playground & Features Research

**Research Date:** March 2026
**Playground URL:** https://playground.lexical.dev/

## Lexical Playground Overview

The Lexical Playground is a comprehensive, interactive demonstration environment showcasing all the framework's rich text editing capabilities. It's the canonical reference implementation for Lexical features.

### Access
- **Live:** https://playground.lexical.dev/
- **GitHub:** https://github.com/facebook/lexical (see `playground` directory)
- **Purpose:** Interactive testing ground for all Lexical plugins and features

## Core Formatting Features Demonstrated

### Text Formatting
- **Bold** - `Ctrl+B` / `Cmd+B`
- **Italic** - `Ctrl+I` / `Cmd+I`
- **Underline** - `Ctrl+U` / `Cmd+U`
- **Strikethrough** - `Ctrl+Shift+X` / `Cmd+Shift+X`
- **Code** - Inline code formatting

### Text Styling
- **Text Color** - Colored text (custom colors)
- **Text Highlight** - Background color highlighting
- **Font Selection** - Multiple font choices

### Block-Level Formatting
- **Text Alignment**
  - Left align
  - Center align
  - Right align
  - Justify

- **Lists**
  - Bulleted (unordered) lists
  - Numbered (ordered) lists
  - Toggled lists (toggle bullets)
  - Checklist / task lists

- **Indentation**
  - Increase indent / tab
  - Decrease indent / shift+tab

### Structured Content
- **Headings** - Multiple levels (h1–h6)
- **Block Quote** - Quote formatting with distinct styling
- **Code Block** - Multi-line code with language selection
- **Divider** - Horizontal rules for visual separation
- **Image Insertion** - Embed images inline

### Tables
- **Insert Table** - Flexible table creation
- **Cell Editing** - Edit table cells
- **Row/Column Operations** - Add/remove rows and columns
- **Merge Cells** - Combine table cells
- **Table Formatting** - Style table appearance

### Links & Embeds
- **Hyperlinks** - Insert, edit, remove links
- **Auto-Link Detection** - Automatic URL recognition and linking
- **YouTube Embeds** - Embed YouTube videos
- **Tweet Embeds** - Embed Twitter/X tweets
- **Custom Embeds** - Framework for custom embed types

## Advanced Features

### Editor Capabilities
- **Copy/Paste Handling** - Smart paste with format preservation
- **Undo/Redo** - Full history management with keyboard shortcuts
- **Selection Management** - Text selection state tracking
- **Keyboard Navigation** - Arrow keys, tab, shift+tab, home, end
- **Mobile Support** - Touch-friendly editing

### Plugin Architecture
The playground demonstrates multiple example plugins:
- **Toolbar Plugin** - Floating/fixed formatting toolbar
- **Tree View Plugin** - Document structure visualization
- **Drag-and-Drop Plugin** - Reorder blocks by dragging
- **Floating Link Editor** - Context menu for link editing
- **Comments Plugin** - Inline comment threads
- **Auto-Embed Plugin** - Automatic media embedding (YouTube, Twitter)
- **Markdown Plugin** - Markdown shortcut conversion
- **Equation Plugin** - LaTeX math equations

### Collaborative Features (in plugin ecosystem)
- **Yjs Integration** - Real-time collaboration via Yjs CRDT
- **WebSocket Sync** - Live multi-user editing
- **Presence Awareness** - See other users' cursors
- **Conflict Resolution** - Automatic merge of concurrent edits

## Plugin Ecosystem

### Rich Text Package
`@lexical/rich-text` - Enables core rich text features:
- Headings (HeadingNode)
- Quotes (QuoteNode)
- All basic formatting

### Additional Official Packages
```typescript
@lexical/table       // TableNode, TableRowNode, TableCellNode
@lexical/list        // ListNode, ListItemNode
@lexical/code        // CodeNode, CodeHighlightNode
@lexical/link        // LinkNode, AutoLinkNode
@lexical/history     // History state management
@lexical/react       // React hooks and components
@lexical/selection   // Selection utilities
@lexical/utils       // Helper utilities
@lexical/devtools    // Development tools
```

### Community Plugins & Integrations
Popular third-party implementations:
- **Lexkit** - Pre-built full-featured editor based on Lexical
- **Novel.sh** - Notion-style editor (uses Lexical)
- **Payload CMS** - Content management with Lexical editor
- **Liveblocks** - Real-time collaboration for Lexical editors

## Custom Node Types (Extensibility)

The playground demonstrates how to create custom node types for specific use cases:

```typescript
// Example custom nodes visible in various implementations:
- ImageNode - Inline image with caption
- VideoNode - Embedded video
- TableNode - Advanced table structures
- EmojiNode - Emoji picker integration
- EquationNode - Math equations
- HorizontalRuleNode - Visual separators
- MentionNode - @mentions with autocomplete
```

### For Novel Writing Specifically
Community implementations show:
- **ChapterNode** - Chapter structure (custom)
- **SceneNode** - Scene with metadata (custom)
- **CharacterMentionNode** - @character tagging (custom)
- **CommentNode** - Editorial comments (custom)
- **ChangeTrackingNode** - Track edits/revisions (custom)

## Performance Features

The playground demonstrates:
- **Efficient Rendering** - Only render visible content
- **Debounced Updates** - Batch state changes
- **Lazy Node Loading** - Load nodes on demand
- **Virtual Scrolling** - Handle very large documents
- **Selection Optimization** - Efficient selection tracking

## Development Experience

### Developer Tools
- **TypeScript Support** - Full type safety
- **React Integration** - `useLexicalComposerContext()` and other hooks
- **Error Boundaries** - Graceful error handling
- **DevTools Plugin** - Debug editor state
- **Console Logging** - Editor state inspection

### Testing Support
- **Editor State Serialization** - Export/import state as JSON
- **Programmatic Manipulation** - Update editor via commands
- **Selection Testing** - Test with different selections
- **Event Simulation** - Simulate user interactions

## Key Takeaways for Storylab

### 1. Lexical is Highly Capable
The playground shows Lexical can handle virtually any rich text feature needed for novel writing—from basic formatting to advanced collaborative editing.

### 2. Plugin-Driven Approach
Features are cleanly separated. Storylab should continue adding plugins incrementally:
- Each feature in its own plugin
- Keep core minimal
- Plugins can be enabled/disabled per project

### 3. Custom Nodes Are Essential
For novel-specific features (chapters, scenes, characters), custom node types are the right approach:
- Extends Lexical's node system
- Maintains semantic structure
- Enables special formatting and behavior

### 4. Collaboration is Achievable
Yjs integration + WebSocket shows real-time multi-author editing is possible:
- Not required now, but architecture allows it
- Consider when adding multiplayer features

### 5. Mobile/Touch Support
Playground works on mobile/tablet—important for writers who switch devices.

## Recommended Next Steps for Storylab

1. **Explore Playground** - Visit https://playground.lexical.dev/ to see all features live
2. **Review Source Code** - GitHub repo has well-documented example plugins
3. **Plan Custom Nodes** - Design ChapterNode, SceneNode for better structure
4. **Implement Writing Plugins** - Add WordCountPlugin (already done), ReadabilityPlugin, etc.
5. **Consider Collaboration** - Plan for real-time editing if that's a roadmap goal

## Sources & References

- [Lexical Playground](https://playground.lexical.dev/)
- [Lexical GitHub Repository](https://github.com/facebook/lexical)
- [Lexical Documentation - Plugins](https://lexical.dev/docs/react/plugins)
- [Novel.sh - Notion-style Editor (Lexical-based)](https://novel.sh/)
- [Payload CMS - Lexical Integration](https://payloadcms.com/docs/rich-text/overview)
- [Liveblocks Lexical Example](https://liveblocks.io/docs/ready-made-features/multiplayer-editing/text-editor/lexical)
