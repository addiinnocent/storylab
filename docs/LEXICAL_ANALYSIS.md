# Lexical Rich Text Editor Analysis for Storylab

**Last Updated:** March 2026
**Current Lexical Version:** 0.41.0 (Latest Available)

## Current Status

✅ **Lexical is already integrated** into Storylab's editor stack.

### Currently Installed Packages
- `lexical` - Core editor framework
- `@lexical/react` - React bindings
- `@lexical/rich-text` - Rich text formatting (HeadingNode, QuoteNode)
- `@lexical/table` - Table support
- `@lexical/list` - List support
- `@lexical/code` - Code blocks
- `@lexical/link` - Link handling
- `@lexical/history` - Undo/redo

**Note:** Lexical packages are not explicitly listed in `package.json`, but are used in imports throughout the codebase. They should be added to ensure proper version management.

## About Lexical

**Lexical** is a lightweight, extensible JavaScript text editor framework developed by Meta. It prioritizes three core principles:

### Core Strengths
1. **Reliability** - Stable, predictable editor state management
2. **Accessibility** - WCAG-compliant with screen reader support
3. **Performance** - Minimal core (22kb min+gzip), plugins add features on-demand

### Architecture Philosophy
- **Minimal Core** - Framework provides only essential editor functionality
- **Plugin-Based** - Features like toolbars, formatting, and markdown are implemented as plugins
- **Framework Agnostic** - Can be used with React, Vue, or vanilla JavaScript
- **Modular Design** - Add only the features you need

### Key Features Out of the Box
- Text formatting (bold, italic, underline, strikethrough)
- Lists (bulleted, numbered, checklist)
- Tables
- Code blocks
- Links
- Copy/paste handling
- Undo/redo
- Selection state management
- Custom node types

## Storylab's Current Implementation

### Editor Component Architecture
Located in `src/EditorComponent.tsx`, Storylab uses:

1. **Core Structure**
   - `LexicalComposer` - Root context provider
   - `RichTextPlugin` - Enables formatting operations
   - `ContentEditable` - Renders the editable area
   - `HistoryPlugin` - Undo/redo functionality

2. **Custom Plugins**
   - `ToolbarPlugin` - Custom formatting toolbar
   - `TableOfContentsPlugin` - Auto-generated TOC from headings
   - `TreeViewPlugin` - Document structure visualization
   - `OnChangeDebouncePlugin` - Debounced state persistence
   - `WordCountPlugin` - Real-time word counting with language-aware segmentation
   - `PdfPlugin` - PDF export functionality
   - `AutoLinkPlugin` - Automatic link detection
   - `AutoEmbedPlugin` - Media embedding

3. **Data Persistence**
   - Editor state is serialized to JSON: `doc.state = editorState.toJSON()`
   - Debounced save to backend (1000ms throttle)
   - State restoration from stored JSON

### Supported Node Types
- HeadingNode (h1, h2, h3)
- QuoteNode
- CodeNode + CodeHighlightNode
- TableNode, TableCellNode, TableRowNode
- ListNode, ListItemNode
- LinkNode, AutoLinkNode
- ParagraphNode (default)

## Recommended Improvements for Novel Writing

### 1. **Chapter/Section Management**
Add custom node types for better long-form structure:
```typescript
// Suggested new node types:
- ChapterNode (metadata: chapter number, title)
- SceneNode (metadata: scene number, location, time)
- ActNode (for story structure analysis)
```

**Why:** Novel writing benefits from hierarchical document organization. Currently, chapters rely on heading formatting only.

### 2. **Writing-Focused Plugins**
```typescript
// High Priority:
- TargetWordCountPlugin (chapter/scene goals)
- WritingStatisticsPlugin (comprehensive metrics)
- ReadabilityAnalysisPlugin (reading level, complexity)
- ManuscriptFormattingPlugin (proper manuscript standards)
- CommentThreadPlugin (editorial feedback)

// Medium Priority:
- RevisionTrackingPlugin (compare drafts)
- CharacterMentionPlugin (@character tags, auto-index)
- TimelinePlugin (story events, continuity)
- PlotElementPlugin (plot point tagging and visualization)
```

### 3. **Performance Optimizations**
- Implement virtualization for very large documents (100k+ words)
- Consider lazy-loading of plugins for chapters not in view
- Optimize PDF export (currently synchronous)

### 4. **Collaboration Features**
- Add presence awareness (who's editing what)
- Implement conflict-free replicated data types (CRDTs) via Yjs
- Real-time sync with sidecar server

### 5. **Accessibility Improvements**
Current state is good, but add:
- Keyboard shortcuts reference/help modal
- Better semantic heading levels
- Screen reader-optimized plugin outputs

## Best Practices for Novel/Book Editing (Industry Standards)

### Essential Features for Authors
1. **Manuscript Formatting**
   - Proper indentation for paragraphs
   - Scene breaks (centered * * * or #)
   - Chapter breaks with automatic numbering
   - Double-space option (publishing standard)

2. **Writing Workflow**
   - Draft status tracking (Draft, Revision 1, Final, etc.)
   - Word count targets by chapter/section
   - Progress visualization
   - Session/writing streak tracking

3. **Editing & Feedback**
   - Comments and editorial notes
   - Revision highlighting
   - Diff/comparison between drafts
   - Track changes (insertion/deletion marking)

4. **Organization**
   - Chapter outline with quick jump-to
   - Character/location index
   - Scene list with metadata (date, POV, setting)
   - Manuscript statistics

5. **Quality Tools**
   - Readability analysis (reading level, sentence length)
   - Clichè detection
   - Passive voice highlighting
   - Dialogue attribution check
   - Consistency check (spelling, terminology)

### Reference Tools Used by Professionals
- **Scrivener** - Industry standard with advanced binder organization
- **Reedsy Studio** - Free collaborative online editor with draft timeline
- **novelWriter** - Open-source with outline view and focus mode
- **Atticus** - Publishing-focused with manuscript compliance

## Action Items for Lexical Integration

### Immediate (Next Sprint)
- [ ] Add `lexical` packages to `package.json` with explicit versions
- [ ] Document custom node types in `docs/`
- [ ] Add type definitions for editor API

### Short Term (Next 2 Sprints)
- [ ] Implement `TargetWordCountPlugin` (chapters often have word count goals)
- [ ] Add `WritingStatisticsPlugin` (comprehensive metrics beyond word count)
- [ ] Create custom nodes for Chapter and Scene structure
- [ ] Add manuscript formatting preset (double-space, proper indentation)

### Medium Term (Next Month)
- [ ] Implement ReadabilityAnalysisPlugin
- [ ] Add revision tracking / diff functionality
- [ ] Create character/location mention system
- [ ] Implement comment/feedback threading

### Long Term (Roadmap)
- [ ] Real-time collaborative editing (Yjs integration)
- [ ] Advanced writing analytics
- [ ] AI-powered suggestions (grammar, style)
- [ ] Integration with publishing platforms

## Sources & References

- [Lexical Official Documentation](https://lexical.dev/)
- [Lexical GitHub Repository](https://github.com/facebook/lexical)
- [Building Rich Text Editors with Lexical and React - LogRocket Blog](https://blog.logrocket.com/build-rich-text-editor-lexical-react/)
- [Lexical Playground](https://playground.lexical.dev/)
- [Scrivener - Novel Writing Software](https://www.literatureandlatte.com/scrivener/overview)
- [Reedsy Studio - Free Online Writing App](https://reedsy.com/studio/write-a-book)
- [novelWriter - Open Source Novel Editor](https://novelwriter.io/features.html)
