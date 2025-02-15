import React from 'react';
import { Mark, Node, Decoration } from 'slate';
import { Editor } from '@grafana/slate-react';
// import { Record } from 'immutable';

import TOKEN_MARK from './TOKEN_MARK';

export interface OptionsFormat {
  // Determine which node should be highlighted
  onlyIn?: (node: Node) => boolean;
  // Returns the syntax for a node that should be highlighted
  getSyntax?: (node: Node) => string;
  // Render a highlighting mark in a highlighted node
  renderMark?: ({ mark, children }: { mark: Mark; children: React.ReactNode }) => void | React.ReactNode;
}

/**
 * Default filter for code blocks
 */
function defaultOnlyIn(node: Node): boolean {
  return node.object === 'block' && node.type === 'code_block';
}

/**
 * Default getter for syntax
 */
function defaultGetSyntax(node: Node): string {
  return 'javascript';
}

/**
 * Default rendering for decorations
 */
function defaultRenderDecoration(
  props: { children: React.ReactNode; decoration: Decoration },
  editor: Editor,
  next: () => any
): void | React.ReactNode {
  const { decoration } = props;
  if (decoration.type !== TOKEN_MARK) {
    return next();
  }

  const className = decoration.data.get('className');
  return <span className={className}>{props.children}</span>;
}


/**
 * The plugin options
 */
class Options extends React.PureComponent<OptionsFormat> {
  readonly onlyIn!: (node: Node) => boolean;
  readonly getSyntax!: (node: Node) => string;
  readonly renderDecoration!: (
    {
      decoration,
      children,
    }: {
      decoration: Decoration;
      children: React.ReactNode;
    },
    editor: Editor,
    next: () => any
  ) => void | React.ReactNode;

  constructor(props: OptionsFormat) {
    super(props)
    this.onlyIn = props.onlyIn
    this.getSyntax = props.getSyntax
    this.renderDecoration = defaultRenderDecoration
 
  }
}

export default Options;