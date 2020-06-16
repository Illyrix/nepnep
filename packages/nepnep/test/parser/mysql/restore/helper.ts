import { RestoreContext } from '../../../../src/context/context'

export function buildRestoreCtx(c: Partial<RestoreContext>): RestoreContext {
  const defaultCtx = {
    innerJoinToComma: false,
    capitalize: false,
    explictOffsetInLimit: false,
  }
  return {
    ...defaultCtx,
    ...c,
  }
}
