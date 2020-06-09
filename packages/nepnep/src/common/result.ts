import { Error, ErrorContext } from './error'
export type Result<T extends Error<V>, U, V extends ErrorContext> = U & { err?: T }

// seems useless?
export function Must<T extends Result<U, V, W>, U extends Error<W>, W extends ErrorContext, V>(t: T): V {
  const res: Result<U, V, W> = { ...t, err: undefined }
  delete res['err']
  return res
}
