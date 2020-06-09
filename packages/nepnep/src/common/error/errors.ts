export interface ErrorContext {
  toString: () => string
}

export abstract class Error<T extends ErrorContext> {
  public errCode = -1
  public errMessage = ''
  public errContext!: T
}

export class ExecutorErrorContext implements ErrorContext {
  public toString(): string {
    return 'implement me!'
  }
}

export class ExecutorError extends Error<ExecutorErrorContext> {
  public errContext = new ExecutorErrorContext()
}

export class ParserErrorContext implements ErrorContext {
  public lineNum = 0
  public offset = 0
  public rawStmt = ''
  public toString(): string {
    return 'implement me!'
  }
}

export class ParserError extends Error<ParserErrorContext> {
  public errContext = new ParserErrorContext()
}

export class StorageErrorContext implements ErrorContext {
  public toString(): string {
    return 'implement me!'
  }
}

export class StorageError extends Error<StorageErrorContext> {
  public errContext = new StorageErrorContext()
}
