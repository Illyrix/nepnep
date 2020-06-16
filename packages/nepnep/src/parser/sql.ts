import { AST } from './mysql'
import { Context } from '../context/context'
import { ContextParse } from './context'

export type Parser = (text: string, ctx: Context) => AST

export function Parse(s: string, ctx: string | Context): AST {
  const parsedCtx: Context = typeof ctx === 'string' ? ContextParse(ctx) : ctx

  return []
}
