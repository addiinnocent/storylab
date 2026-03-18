import type {EditorState, LexicalEditor} from 'lexical';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import React, { useRef } from "react";
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
  onChange: (editor: LexicalEditor, editorState: EditorState) => void;
  debounce: number,
}): null {
  const [editor] = useLexicalComposerContext();
  const timerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
            if (timerIdRef.current !== null) {
              clearTimeout(timerIdRef.current);
            }
            timerIdRef.current = setTimeout(() => {
              editor.dispatchCommand(CAN_PUSH_COMMAND, true);
              onChange(editor, editorState);
            }, debounce);
          }
        },
      );
    }
  }, [editor, ignoreHistoryMergeTagChange, ignoreSelectionChange, onChange, debounce]);

  return null;
}
