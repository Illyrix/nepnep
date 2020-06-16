import { Expr, Visitor } from '../common'
import { TableReference } from './table-reference'
import { RestoreContext } from '../../../context/context'
import { RestoreError } from '../../error'
import { Result } from '../../../common'

// inside of expr
export class Column implements Expr {
  public colName: string
  public table?: TableReference

  public constructor(cn?: string, tb?: TableReference) {
    ;[this.colName, this.table] = [cn ? cn : '', tb]
  }

  public restore(ctx?: RestoreContext) {
    if (this.table) {
      const table = this.table.restore(ctx)
      if (!table.ok()) {
        return new Result<string, RestoreError>('', table.error())
      }
      return new Result<string, RestoreError>(`${table.unwrap()}.${this.colName}`, undefined)
    }
    return new Result<string, RestoreError>(`${this.colName}`, undefined)
  }

  // todo: implement me!
  public visit<T>(v: Visitor<T>): [T, boolean] {
    return v.enter(this)
  }
}
