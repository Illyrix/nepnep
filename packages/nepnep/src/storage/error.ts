import { NepError } from '../common'

export class StorageError extends NepError {
  public toString(): string {
    return this.message
  }
}
