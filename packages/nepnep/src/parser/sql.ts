import { AST } from './ast'
import { Context } from '../context/context'
import { ContextParse } from './context'

export function Parse(s: string, ctx: string | Context): AST {
  const parsedCtx: Context = typeof ctx === 'string' ? ContextParse(ctx) : ctx

  return {}
}
