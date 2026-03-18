import type {EditorState, LexicalEditor, LexicalCommand} from 'lexical';
import {$getRoot, createCommand} from "lexical";
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import React from "react";
import { CAN_PUSH_COMMAND } from '../commands'

const CAN_USE_DOM = typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined';

const useLayoutEffectImpl = CAN_USE_DOM ? React.useLayoutEffect : React.useEffect;
var useLayoutEffect = useLayoutEffectImpl;

export function OnChangeDebouncePlugin({
  ignoreHistoryMergeTagChange = true,
  ignoreSelectionChange = true,
  onChange,
  debounce,
}: {
  ignoreHistoryMergeTagChange?: boolean;
  ignoreSelectionChange?: boolean;
  onChange: (editorState: EditorState, editor: LexicalEditor) => void;
  debounce: number,
}): null {
  const [editor] = useLexicalComposerContext();
  let timerId:  NodeJS.Timeout | null = null;

  useLayoutEffect(() => {
    if (onChange) {
      return editor.registerUpdateListener(
        ({editorState, dirtyElements, dirtyLeaves, prevEditorState, tags}) => {
          if (dirtyElements.size > 0) {
            if (
              (ignoreSelectionChange &&
                dirtyElements.size === 0 &&
                dirtyLeaves.size === 0) ||
              (ignoreHistoryMergeTagChange && tags.has('history-merge')) ||
              prevEditorState.isEmpty()
            ) {
              return;
            }
            if (timerId === null) {
              timerId = setTimeout(() => {
                editor.dispatchCommand(CAN_PUSH_COMMAND, true);
                onChange(editor, editorState);
              }, debounce);
            } else {
              clearTimeout(timerId);
              timerId = setTimeout(() => {
                editor.dispatchCommand(CAN_PUSH_COMMAND, true);
                onChange(editor, editorState);
              }, debounce);
            }
          }
        },
      );
    }
  }, [editor, ignoreHistoryMergeTagChange, ignoreSelectionChange, onChange]);

  return null;
}
