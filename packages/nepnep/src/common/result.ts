import { NepError } from './error'
export class Result<T, U extends NepError> {
  protected err?: U
  protected data: T
  public constructor(data: T, err?: U) {
    this.err = err
    this.data = data
  }
  public ok(): boolean {
    return this.err === undefined || this.err === null
  }
  public unwrap(): T {
    if (!this.ok()) throw this.err
    return this.data
  }
}
