export abstract class NepError extends Error implements Error {
  public code = -1
  public name = ''
  public message = ''
  public abstract toString(): string
}

export class ExecutorError extends NepError {
  public toString(): string {
    return this.message
  }
}

export class ParserError extends NepError {
  public lineNum = 0
  public offset = 0
  public rawStmt = ''
  public toString(): string {
    return `syntax error: ${this.message}, at ${this.lineNum},${this.offset} near "${this.rawStmt}"`
  }
}

export class StorageError extends NepError {
  public toString(): string {
    return this.message
  }
}
