import { NepError } from '../common'

export class ParserError extends NepError {
  public lineNum = 0
  public offset = 0
  public rawStmt = ''
  public toString(): string {
    return `syntax error: ${this.message}, at ${this.lineNum},${this.offset} near "${this.rawStmt}"`
  }
}
