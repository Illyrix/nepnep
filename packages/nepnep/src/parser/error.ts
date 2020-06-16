import { NepError } from '../common'
import { Node } from './mysql'

export class ParserError extends NepError {
  public lineNum = 0
  public charNum = 0
  public offset = 0
  public rawStmt = ''
  public constructor(payload: Partial<ParserError>) {
    super()
    Object.assign(this, payload)
  }
  public toString() {
    return `syntax error: ${this.message}, at ${this.lineNum},${this.offset} near "${this.rawStmt}"`
  }
}

export class RestoreError extends NepError {
  public relatedNodes: Node[] = []
  public constructor(payload: Partial<RestoreError>) {
    super()
    Object.assign(this, payload)
  }

  public toString() {
    return `restore error: ${this.message}` + this.stringifyNodes()
  }

  private stringifyNodes() {
    if (this.relatedNodes.length === 0) {
      return ''
    } else {
      let res = ' , related nodes are: ['
      this.relatedNodes.forEach((v) => {
        res += `<NODE ${v.constructor.name}>` + v.toString()
      })
      res += ']'
      return res
    }
  }
}
