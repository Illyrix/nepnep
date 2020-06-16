import { NepError } from './error'
export class Result<T, U extends NepError> {
  protected err?: U
  protected payload: T
  public constructor(payload: T, err?: U) {
    this.err = err
    this.payload = payload
  }
  public ok(): boolean {
    return this.err === undefined || this.err === null
  }
  public error(): U {
    if (!this.ok()) return this.err as U
    throw new Error('no error occurred but err() called')
  }
  public unwrap(): T {
    if (!this.ok()) throw this.err
    return this.payload
  }
}
