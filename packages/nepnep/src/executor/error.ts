import { NepError } from '../common'

export class ExecutorError extends NepError {
  public toString(): string {
    return this.message
  }
}
