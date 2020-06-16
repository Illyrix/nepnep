import { Context } from '../context/context'

export const defaultContext: Context = { ignoreWarn: true, parser: {} }

export function ContextParse(s: string): Context {
  const ctx = { ...defaultContext }
  Object.assign(ctx, JSON.parse(s))
  return ctx
}
