import {
  IonContent,
  IonPage,
  IonNote,
} from '@ionic/react';
import { useParams } from 'react-router';
import { UserContext } from '../context/user';
import { DocumentContext } from '../context/document';
import './editor/style.css';

import type { EditorState, LexicalEditor, ParagraphNode } from 'lexical';

import React, { useState, useEffect, useRef, useContext } from 'react';
import { Font, StyleSheet, Document, Page, View, Text } from '@react-pdf/renderer';
import { $getRoot, $nodesOfType } from 'lexical';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { HistoryState } from '@lexical/history';

import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';

import ToolbarPlugin from './editor/plugins/ToolbarPlugin';
import TableOfContentsPlugin from './editor/plugins/TableOfContentsPlugin';
import AutoLinkPlugin from './editor/plugins/AutoLinkPlugin';
import TreeViewPlugin from './editor/plugins/TreeViewPlugin';
import { OnChangeDebouncePlugin } from './editor/plugins/OnChangeDebouncePlugin';
//import { ServerHistoryPlugin } from './editor/plugins/ServerHistoryPlugin';
//import DraggableBlockPlugin from './plugins/DraggableBlockPlugin';
//import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin';
//import FloatingTextFormatToolbarPlugin from './plugins/FloatingTextFormatToolbarPlugin';
import { DOWNLOAD_COMMAND } from './editor/commands'

import ExampleTheme from './editor/themes/ExampleTheme';

interface EditorComponentProps {
  callback?: any,
}

const EditorComponent: React.FC<EditorComponentProps> = ({ callback }) => {
  const { user } = useContext(UserContext);
  const { doc, setDocument, pushDocument } = useContext(DocumentContext);
  const [wordCount, setWordCount] = useState<number>(0);
  const theme = ExampleTheme;
  const initialEditorState = JSON.stringify(doc.state);

  const isEnabled = (name: string) => {
    let plugin = doc.plugins.find(x => x.name == name);
    return plugin?.enabled;
  }

  function onChange(editor: Editor, editorState: EditorState) {
    //console.log('change')
  }

  function onChangeDebounce(editor: Editor, editorState: EditorState) {
    doc.state = editorState.toJSON();
    doc.words = wordCount;
    pushDocument();
  }

  function WordCountPlugin(): JSX.Element | null {
    const [editor] = useLexicalComposerContext();
    const segmenter = new Intl.Segmenter(doc.language, { granularity: 'word' });

    function countWords(textContent) {
      const segments = Array.from(segmenter.segment(textContent));
      const filtered = segments.filter(x => x.isWordLike);
      setWordCount(filtered.length);
    }

    useEffect(() => {
      editor.update(() => {
        const root = $getRoot();
        const textContent = root.getTextContent();
        countWords(textContent);
      });
      return editor.registerTextContentListener((textContent) => {
        countWords(textContent);
      });
    }, [editor]);

    return (
      <IonNote class="word-counter">
        {(wordCount).toLocaleString(user.language)} words
      </IonNote>
    );
  }

  function PdfPlugin(): JSX.Element | null { // create file
    const [editor] = useLexicalComposerContext();
    const styles = StyleSheet.create({
      page: {
        backgroundColor: '#fff',
        padding: '40px',
        fontSize: '12px',
      },
      h1: {
        fontSize: '24px',
        fontWeight: '400',
        margin: 0,
        marginBottom: '12px',
        padding: 0,
      },
      h2: {
        fontSize: '15px',
        color: 'rgb(101, 103, 107)',
        fontWeight: 700,
        marginTop: '10px',
        marginBottom: '10px',
        textTransform: 'uppercase',
      },
      paragraph: {
        marginBottom: '8px',
      },
    });

    function $generatePdfFromNodes() {
      const root = $getRoot();
      const topLevelNodes = root.getChildren();

      /*function diveDeep(node) {
        let format = {};
        if (node.__format == 1) format = { fontFamily: 'Times-Bold' };
        if (node.__format == 2) format = { fontFamily: 'Times-Italic' };

        return (
          <Text key={node.__key} style={format}>
            {node.__text}
          </Text>
        );
      }*/

      return (
        <Document
          title={doc.title}
          author={doc.author}
          language={doc.language}
        >
          <Page size="A4" style={styles.page}>
          {topLevelNodes.map(topLevelNode => (
            <View key={topLevelNode.__key} style={styles[topLevelNode.__tag || 'paragraph']}>
              <Text>{topLevelNode.getTextContent()}</Text>
            </View>
          ))}
          </Page>
        </Document>
      );
    }

    useEffect(() => {
      return editor.registerCommand(
        DOWNLOAD_COMMAND,
        (payload) => {
          payload($generatePdfFromNodes());
          return true;
        }, 1
      );
    }, [editor]);

    return null;
  }


  function Placeholder() {
    return <div className="editor-placeholder">Empty document ...</div>;
  }

  function onError(error: any) {
    console.error(error);
  }

  return (
    <LexicalComposer initialConfig={{
      namespace: doc._id,
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
    }}>
      <ToolbarPlugin doc={doc} />
      <IonContent>
        {isEnabled('Table of contents') && (
          <TableOfContentsPlugin />
        )}
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor-input" />}
          placeholder={Placeholder}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin
          onChange={onChange}
        />
        <OnChangeDebouncePlugin
          debounce={1000}
          onChange={onChangeDebounce}
        />
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        <AutoLinkPlugin />
        <PdfPlugin />
        {isEnabled('Treeview') && (
          <TreeViewPlugin />
        )}
      </IonContent>
      <WordCountPlugin />
    </LexicalComposer>
  );
};

export default EditorComponent;
