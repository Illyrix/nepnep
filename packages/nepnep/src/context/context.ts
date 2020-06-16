import { SqlMode } from 'ts-mysql-parser'

/**
 * context in excution
 * able to extend context by given T
 * @export
 * @interface Context
 */
export type Context<T = {}> = {
  [P in keyof T]: T[P]
} & {
  parser: ParserContext
  ignoreWarn: boolean
}

// disable to extend
export interface ParserContext {
  charsets?: string[]
  version?: string
  mode?: SqlMode
}

export type RestoreContext<T = {}> = {
  [P in keyof T]: T[P]
} & {
  innerJoinToComma: boolean // use 'from A, B' instead of 'from A join B' when there is no on clause
  capitalize: boolean // keywords are always in uppercase
  explictOffsetInLimit: boolean // use 'limit 3 offset 5' instead of 'limit 5,3'
}

/**
 *
 *
 * @export
 * @param {Context} ctxA
 * @param {Context} ctxB
 * @returns {Context}
 */
export function mergeContext(ctxA: Partial<Context>, ctxB: Partial<Context>): Context {
  return { ignoreWarn: false, parser: {} }
}
