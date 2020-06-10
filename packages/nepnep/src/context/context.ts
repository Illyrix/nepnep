/**
 * context in excution
 * @export
 * @interface Context
 */
export interface Context {
  ignoreWarn: boolean
}

/**
 *
 *
 * @export
 * @param {Context} ctxA
 * @param {Context} ctxB
 * @returns {Context}
 */
export function MergeContext(ctxA: Partial<Context>, ctxB: Partial<Context>): Context {
  return { ignoreWarn: false }
}
