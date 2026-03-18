# Lexical Integration Research: Executive Summary

**Research Date:** March 2026
**Latest Lexical Version:** 0.41.0
**Status:** ✅ Lexical is already integrated and functional

## Key Findings

### 1. Current State: Lexical is Already Integrated ✅
Storylab already uses Lexical for its rich text editor with:
- 8 Lexical packages imported and functional
- 9 custom plugins developed (Toolbar, TOC, TreeView, PDF export, etc.)
- Language-aware word counting with `Intl.Segmenter`
- Debounced state persistence (1000ms)
- Full undo/redo support

**However:** Lexical packages aren't declared in `package.json`—they should be added explicitly for dependency management clarity.

### 2. Lexical Playground Showcase
The [Lexical Playground](https://playground.lexical.dev/) demonstrates:
- ✅ All core formatting (bold, italic, lists, tables, code blocks)
- ✅ Advanced plugins (comments, auto-embeds, drag-drop, collaborative editing)
- ✅ Custom node types (extensible for novel-specific features)
- ✅ Real-time collaboration via Yjs (for future use)

**Action:** Explore the playground to see what's possible with Lexical.

### 3. Best Practices for Novel Editors (Industry Standards)
Professional novel writing software prioritises:

#### Essential Features
1. **Chapter/Section Hierarchy** - Authors think in chapters, not paragraphs
2. **Word Count Tracking** - Per-chapter goals and progress (Storylab partially has this)
3. **Draft Management** - Version control, status tracking, comparison
4. **Focus Mode** - Distraction-free writing (not yet in Storylab)
5. **Manuscript Formatting** - Double-space, proper indents, scene breaks (not yet in Storylab)

#### High-Value Additions
- Target word count per chapter with progress visualization
- Readability metrics (reading level, sentence length variation)
- Comments & editorial feedback system
- Revision tracking (show what changed between drafts)
- Character/location index and continuity checking

#### Industry Reference Tools
- **Scrivener** - Most popular, full-featured (binder organization, status tracking)
- **Reedsy Studio** - Free, collaborative, good draft timeline
- **novelWriter** - Open source, outline-focused
- **Atticus** - Publishing-focused, manuscript compliance

## Recommendations for Storylab

### Priority 1: Foundation (Now)
```markdown
- [ ] Add Lexical packages to package.json (fix missing dependencies)
- [ ] Document current architecture (plugins, state flow)
- [ ] Add type definitions for custom nodes
```

**Why:** Ensures explicit dependency management and sets up for future enhancements.

### Priority 2: Writing Workflow (Next Sprint)
```markdown
- [ ] Implement TargetWordCountPlugin (chapter-level goals)
- [ ] Create ChapterNode & SceneNode custom types
- [ ] Add Focus Mode (distraction-free writing)
- [ ] Add Manuscript Formatting Plugin (double-space, indentation)
```

**Why:** These are table-stakes for novel writing software and align with Scrivener/novelWriter.

### Priority 3: Analysis & Editing (Next Month)
```markdown
- [ ] Implement StatisticsPlugin (comprehensive metrics)
- [ ] Add ReadabilityPlugin (reading level, passive voice detection)
- [ ] Implement Comments & Feedback Plugin
- [ ] Add Revision Tracking / Diff view
```

**Why:** Writers need to understand their writing quality and receive editorial feedback.

### Priority 4: Advanced (Roadmap)
```markdown
- [ ] Character/Location mention system (@character tagging)
- [ ] Continuity checking (timeline, character consistency)
- [ ] Real-time collaborative editing (Yjs integration)
- [ ] Publishing integration (export to Kindle, IngramSpark)
```

**Why:** Differentiators for serious authors; addresses long-form writing challenges.

## Implementation Patterns (Ready to Use)

### 1. New Plugin Template
```typescript
export default function MyPlugin(props) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerTextContentListener((text) => {
      // Listen to content changes
    })
  }, [editor])

  return null  // Most plugins don't render
}
```

### 2. Custom Node Pattern
```typescript
export class ChapterNode extends DecoratorNode {
  // Define chapter structure, rendering, serialization
  // See LEXICAL_IMPLEMENTATION_GUIDE.md for full example
}
```

### 3. State Persistence
Currently works well:
```typescript
// On change:
doc.state = editorState.toJSON()
pushDocument()

// On load:
editorState = JSON.stringify(doc.state)
```

## Documentation Created

Four comprehensive markdown files have been created in `docs/`:

1. **LEXICAL_ANALYSIS.md** (Main Reference)
   - Current integration status
   - Architecture overview
   - Recommended improvements
   - Action items with prioritization

2. **NOVEL_EDITOR_BEST_PRACTICES.md** (Domain Knowledge)
   - Essential features for novel editors
   - Industry standards and patterns
   - Feature prioritisation by use case
   - Examples from Scrivener, novelWriter, Reedsy

3. **LEXICAL_PLAYGROUND_FEATURES.md** (Capability Discovery)
   - What's possible with Lexical
   - Plugin ecosystem overview
   - Custom node examples
   - Community implementations

4. **LEXICAL_IMPLEMENTATION_GUIDE.md** (How-To)
   - Step-by-step plugin development
   - Code examples (ready to adapt)
   - Custom node creation
   - Testing patterns
   - Troubleshooting

## Quick Start for Developers

### 1. Understand Current State
```bash
# Read these in order:
1. docs/ARCHITECTURE.md  (already exists)
2. docs/LEXICAL_ANALYSIS.md (newly created)
3. src/EditorComponent.tsx  (implementation)
```

### 2. Explore Capabilities
```bash
# Visit https://playground.lexical.dev/
# Try different features to understand what's possible
```

### 3. Add a Plugin
```bash
# Follow template in docs/LEXICAL_IMPLEMENTATION_GUIDE.md
# Start with TargetWordCountPlugin (relatively simple)
# Add to src/editor/plugins/TargetWordCountPlugin.tsx
```

### 4. Create a Custom Node (If Needed)
```bash
# Use ChapterNode example from IMPLEMENTATION_GUIDE.md
# Define chapter structure and metadata
# Register in EditorComponent config
```

## FAQ

### Q: Is Lexical still being maintained?
**A:** Yes, Lexical 0.41.0 released recently (March 2026). Meta maintains it actively.

### Q: Can Lexical handle 200,000-word novels?
**A:** Yes, with proper optimisation (debouncing, lazy-loading). Reference: Lexical playground handles complex documents efficiently.

### Q: Should we use a different editor?
**A:** Unlikely. Lexical is excellent for novel editing and already integrated. ProseMirror/TipTap are competitors but require rewrite. Consider building on Lexical instead.

### Q: Can writers collaborate in real-time?
**A:** Yes, via Yjs integration. Not urgent now, but architecture supports it. See `@lexical/yjs` package.

### Q: How do we handle offline editing?
**A:** Current debounce + JSON serialization works well for offline. Consider IndexedDB for full offline sync later.

## Next Steps (Recommended)

1. **Today:** Add Lexical packages to package.json
   ```bash
   npm install \
     lexical@^0.41.0 \
     @lexical/react@^0.41.0 \
     @lexical/rich-text@^0.41.0 \
     @lexical/table@^0.41.0 \
     @lexical/list@^0.41.0 \
     @lexical/code@^0.41.0 \
     @lexical/link@^0.41.0 \
     @lexical/history@^0.41.0
   ```

2. **This Week:** Review priority 2 plugins, choose one to implement

3. **This Sprint:** Implement TargetWordCountPlugin (highest ROI for novel writers)

4. **Next Sprint:** ChapterNode + FocusMode plugin

## Resources Provided

**Documentation Files:**
- ✅ LEXICAL_ANALYSIS.md
- ✅ NOVEL_EDITOR_BEST_PRACTICES.md
- ✅ LEXICAL_PLAYGROUND_FEATURES.md
- ✅ LEXICAL_IMPLEMENTATION_GUIDE.md
- ✅ LEXICAL_RESEARCH_SUMMARY.md (this file)

**External References:**
- 🔗 https://lexical.dev/ (Official docs)
- 🔗 https://playground.lexical.dev/ (Interactive demo)
- 🔗 https://github.com/facebook/lexical (Source code + examples)

## Conclusion

**Storylab has an excellent foundation with Lexical.** The editor is capable, actively maintained, and well-suited for novel writing. The path forward is clear: focus on writing-specific features (chapters, word count, focus mode, readability) rather than changing the underlying editor.

The four documentation files provide everything needed to:
1. Understand current architecture
2. Learn industry best practices for novel editors
3. Discover what's possible with Lexical
4. Implement new features with code examples

Start with LEXICAL_ANALYSIS.md and move through the priority matrix. Each plugin is self-contained and can be added incrementally.
