import React, { useEffect, useState } from 'react';
import './lexical/style.css';

import type { EditorState, LexicalEditor as LexicalEditorType } from 'lexical';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';

import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';

import ToolbarPlugin from './lexical/plugins/ToolbarPlugin';
import AutoLinkPlugin from './lexical/plugins/AutoLinkPlugin';
// TreeViewPlugin and TableOfContentsPlugin deferred - have dependency issues
import { OnChangeDebouncePlugin } from './lexical/plugins/OnChangeDebouncePlugin';

import PlaygroundEditorTheme from './lexical/themes/PlaygroundEditorTheme';

interface LexicalEditorProps {
  namespace: string;
  initialContent?: string;
  language?: string;
  onContentChange?: (serialisedState: string, wordCount: number) => void;
}

const LexicalEditor: React.FC<LexicalEditorProps> = ({
  namespace,
  initialContent,
  language = 'en',
  onContentChange,
}) => {
  const [wordCount, setWordCount] = useState<number>(0);
  const theme = PlaygroundEditorTheme;

  function onChange(_editorState: EditorState, _editor: LexicalEditorType, _tags: Set<string>) {
    // Handle immediate changes if needed
  }

  function onChangeDebounce(_editor: LexicalEditorType, editorState: EditorState) {
    const serialisedState = JSON.stringify(editorState.toJSON());
    if (onContentChange) {
      onContentChange(serialisedState, wordCount);
    }
  }

  function WordCountPlugin(): React.ReactElement | null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
      return editor.registerTextContentListener((textContent) => {
        // Count words - use simple split fallback
        const wordCount = textContent.split(/\s+/).filter(Boolean).length;
        setWordCount(wordCount);
      });
    }, [editor, language]);

    return (
      <div className="word-counter">
        {wordCount.toLocaleString(language)} words
      </div>
    );
  }

  function Placeholder() {
    return <div className="editor-placeholder">Empty document ...</div>;
  }

  function onError(error: any) {
    console.error(error);
  }

  const initialEditorState = initialContent ? JSON.stringify(JSON.parse(initialContent)) : undefined;

  return (
    <LexicalComposer
      initialConfig={{
        namespace,
        editorState: initialEditorState,
        nodes: [
          HeadingNode,
          ListNode,
          ListItemNode,
          QuoteNode,
          CodeNode,
          CodeHighlightNode,
          TableNode,
          TableCellNode,
          TableRowNode,
          AutoLinkNode,
          LinkNode,
        ],
        theme,
        onError,
      }}
    >
      <ToolbarPlugin />
      <div className="editor-container">
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor-input" />}
          placeholder={<Placeholder />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin onChange={onChange} />
        <OnChangeDebouncePlugin debounce={1000} onChange={onChangeDebounce} />
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        <AutoLinkPlugin />
      </div>
      <WordCountPlugin />
    </LexicalComposer>
  );
};

export default LexicalEditor;
