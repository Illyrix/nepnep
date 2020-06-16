import { Node, Visitor, Expr } from '../common'
import { Alias } from './alias'
import { Result } from '../../../common'
import { RestoreError } from '../../error'
import { SelectStmt } from './select'
import { RestoreContext } from '../../../context/context'

export interface TableReference extends Node {
  alias?: Alias
  on?: Expr
}

export class SubQuery implements TableReference {
  public alias?: Alias
  public on?: Expr
  public query?: SelectStmt

  public constructor(s?: SelectStmt, alias?: Alias, on?: Expr) {
    ;[this.query, this.alias, this.on] = [s, alias, on]
  }

  public restore(ctx?: RestoreContext) {
    const ONKeyword = ctx?.capitalize ? 'ON' : 'on'

    if (this.query === undefined) {
      return new Result<string, RestoreError>('', undefined)
    }
    const query = this.query.restore()
    if (!query.ok()) {
      return new Result<string, RestoreError>('', query.error())
    }
    const queryStr = query.unwrap()

    let onExprStr = ''
    if (this.on !== undefined) {
      const onExpr = this.on.restore()
      if (!onExpr.ok()) {
        return new Result<string, RestoreError>('', onExpr.error())
      }
      onExprStr = ` ${ONKeyword} ${onExpr.unwrap()}`
    }
    return new Result<string, RestoreError>(
      `(${queryStr})${this.alias === undefined ? '' : ' ' + this.alias.restore()}${onExprStr}`,
      undefined,
    )
  }

  // todo: implement me!
  public visit<T>(v: Visitor<T>): [T, boolean] {
    return v.enter(this)
  }
}
