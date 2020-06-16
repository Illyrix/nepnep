import { Result } from '../../common'
import { ParserError, RestoreError } from '../error'
import { RuleContext } from 'antlr4ts'
import { RestoreContext } from '../../context/context'

export type ResultRestore = Result<string, RestoreError>

export type AST = Node[]

export interface Visitor<T> {
  enter: (node: Node) => [T, boolean]
  leave: (node: Node) => T
}

export interface Node {
  /**
   * @memberof Node
   */
  restore: (ctx?: RestoreContext) => ResultRestore
  /**
   * @memberof Node
   * second return value is false to stop visit children
   */
  visit: <T>(v: Visitor<T>) => [T, boolean]
}

// eslint-disable-next-line
export interface Expr extends Node {}

// eslint-disable-next-line
export interface Statement extends Node {}

// export function parseAstFromTree(tree: RuleContext): AST {

// }
