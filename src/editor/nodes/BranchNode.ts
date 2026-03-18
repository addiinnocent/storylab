import { TextNode, NodeKey, SerializedElementNode, EditorConfig } from 'lexical';
import { $applyNodeReplacement } from 'lexical';

export class BranchNode extends TextNode {
  __color: string;

  constructor(text: string, color: string, key?: NodeKey) {
    super(text, key);
    this.__color = color;
  }

  static getType(): string {
    return 'colored';
  }

  static clone(node: BranchNode): BranchNode {
    return new BranchNode(node.__text, node.__color, node.__key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    console.log('test')
    const element = super.createDOM(config);
    element.style.color = this.__color;
    return element;
  }

  updateDOM(
    prevNode: BranchNode,
    dom: HTMLElement,
    config: EditorConfig,
  ): boolean {
    const isUpdated = super.updateDOM(prevNode, dom, config);
    if (prevNode.__color !== this.__color) {
      dom.style.color = this.__color;
    }
    return isUpdated;
  }
}

export function $createBranchNode(text: string, color: string): BranchNode {
  return new BranchNode(text, color);
}

export function $isBranchNode(node: any): boolean {
  return node instanceof BranchNode;
}
