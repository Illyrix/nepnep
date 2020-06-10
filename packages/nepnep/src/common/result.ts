import { NepError } from './error'
export class Result<T extends NepError, U> {
  protected err?: T
  protected data: U
  public constructor(data: U, err?: T) {
    this.err = err
    this.data = data
  }
  public ok(): boolean {
    return this.err === undefined || this.err === null
  }
  public unwrap(): U {
    if (!this.ok()) throw this.err
    return this.data
  }
}
