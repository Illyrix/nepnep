/**
 * see https://dev.mysql.com/doc/refman/8.0/en/select.html
 */

import { Statement, Visitor, Expr, Node } from '../common'
import { RestoreError } from '../../error'
import { Result } from '../../../common'
import { Distinct } from './distinct'
import { TableReference } from './table-reference'
import { RestoreContext } from '../../../context/context'
import { Var } from './var'
import { Alias } from './alias'
import { WindowSpec } from './window'

export class SelectStmt implements Statement {
  public distinct?: Distinct
  public resultFields: ResultField[] = []
  // mysql supports to 'select ... into outfile/dumpfile'
  // here we only consider about variables
  public into?: Var[]
  public where?: Expr
  public from: TableReference[] = []
  public groupby?: GroupBy
  public limit?: Limit
  public orderby?: OrderBy
  public having?: Expr
  public straightJoin = false
  public window?: Window[]

  // todo: implement me!
  public restore(ctx?: RestoreContext) {
    return new Result<string, RestoreError>('', undefined)
  }

  // todo: implement me!
  public visit<T>(v: Visitor<T>): [T, boolean] {
    return v.enter(this)
  }

  // nested join clause when innerJoinToComma is diabled
  private restoreFromClause(ctx?: RestoreContext) {
    if (this.from.length === 0) {
      return new Result<string, RestoreError>('', undefined)
    }
  }
}

export class GroupBy implements Node {
  public exprs: Expr[]
  public withRollUp: boolean

  public constructor(exprs?: Expr[], rollUp?: boolean) {
    this.exprs = exprs ? exprs : []
    this.withRollUp = rollUp ? rollUp : false
  }

  public restore(ctx?: RestoreContext) {
    const ROLLUPKeyword = ctx?.capitalize ? 'WITH ROLLUP' : 'with rollup'
    if (this.exprs.length === 0) {
      // no expressions in group by
      return new Result<string, RestoreError>('', undefined)
    }
    try {
      let out = this.exprs.map((v) => v.restore(ctx).unwrap()).join(', ')
      if (this.withRollUp) {
        out += ` ${ROLLUPKeyword}`
      }
      return new Result<string, RestoreError>(out, undefined)
    } catch (e) {
      if (e instanceof RestoreError) {
        return new Result<string, RestoreError>('', e)
      }
      throw e
    }
  }

  // todo: implement me!
  public visit<T>(v: Visitor<T>): [T, boolean] {
    return v.enter(this)
  }
}

// Note: rowCount and offset can be set with non-negtive integer
//       or stored variants or placeholder.
//       No plan to support placeholder
export class Limit implements Node {
  public rowCount?: number | Var
  public offset?: number | Var

  public constructor(rc?: number | Var, off?: number | Var) {
    ;[this.rowCount, this.offset] = [rc ? rc : 0, off]
  }

  public restore(ctx?: RestoreContext) {
    if (this.rowCount === undefined) {
      return new Result<string, RestoreError>('', undefined)
    }
    const rc = typeof this.rowCount === 'number' ? `${this.rowCount}` : this.rowCount.restore(ctx).unwrap()
    function fillLimit(off: string) {
      if (off === '') {
        return rc
      }
      if (ctx?.explictOffsetInLimit) {
        const OFFSETKeywords = ctx?.capitalize ? 'OFFSET' : 'offset'
        return `${rc} ${OFFSETKeywords} ${off}`
      }
      return `${off}, ${rc}`
    }
    const off =
      this.offset === undefined
        ? ''
        : typeof this.offset === 'number'
        ? `${this.offset}`
        : this.offset.restore(ctx).unwrap()
    return new Result<string, RestoreError>(fillLimit(off), undefined)
  }

  // todo: implement me!
  public visit<T>(v: Visitor<T>): [T, boolean] {
    return v.enter(this)
  }
}

export type OrderByItem = Expr & {
  desc: boolean
  asc: boolean // true for explict 'asc'
}

export class OrderBy implements Node {
  public exprs: OrderByItem[]
  public withRollUp: boolean

  public constructor(exprs?: OrderByItem[], rollUp?: boolean) {
    this.exprs = exprs ? exprs : []
    this.withRollUp = rollUp ? rollUp : false
  }
  public restore(ctx?: RestoreContext) {
    const ASCKeyword = ctx?.capitalize ? 'ASC' : 'asc'
    const DESCKeyword = ctx?.capitalize ? 'DESC' : 'desc'
    const ROLLUPKeyword = ctx?.capitalize ? 'WITH ROLLUP' : 'with rollup'
    if (this.exprs.length === 0) {
      return new Result<string, RestoreError>('', undefined)
    }
    try {
      let out = this.exprs
        .map((v) => (v.restore(ctx).unwrap() + v.asc ? (' ' + v.desc ? DESCKeyword : ASCKeyword) : ''))
        .join(', ')
      if (this.withRollUp) {
        out += ` ${ROLLUPKeyword}`
      }
      return new Result<string, RestoreError>(out, undefined)
    } catch (e) {
      if (e instanceof RestoreError) {
        return new Result<string, RestoreError>('', e)
      }
      throw e
    }
  }

  // todo: implement me!
  public visit<T>(v: Visitor<T>): [T, boolean] {
    return v.enter(this)
  }
}

export class ResultField implements Node {
  public wildcard: boolean
  public tableWithWildcard?: TableReference
  public expr?: Expr
  public over?: WindowSpec | string
  public as?: Alias

  // eslint-disable-next-line
  public constructor(wc?: boolean, table?: TableReference, expr?: Expr, over?: WindowSpec | string, as?: Alias) {
    ;[this.wildcard, this.tableWithWildcard, this.expr, this.over, this.as] = [wc ? wc : false, table, expr, over, as]
  }

  public restore(ctx?: RestoreContext) {
    if (this.wildcard) {
      if (this.as) {
        return new Result<string, RestoreError>('', new RestoreError({ message: 'wildcard(*) cannot be renamed' }))
      }
      if (this.tableWithWildcard) {
        const table = this.tableWithWildcard.restore(ctx)
        if (!table.ok()) {
          return new Result<string, RestoreError>('', table.error())
        }
        return new Result<string, RestoreError>(`${table.unwrap()}.*`, undefined)
      }
      return new Result<string, RestoreError>('*', undefined)
    }
    if (!this.expr) {
      return new Result<string, RestoreError>('', new RestoreError({ message: 'empty result field' }))
    }
    const expr = this.expr.restore(ctx)
    if (!expr.ok()) {
      return new Result<string, RestoreError>('', expr.error())
    }

    let overStr = ''
    if (this.over) {
      const OVERKeyword = ctx?.capitalize ? 'OVER' : 'over'
      if (typeof this.over === 'string') {
        // is window name
        overStr = ` ${OVERKeyword} ${this.over}`
      } else {
        overStr = ` ${OVERKeyword} (${this.over.restore(ctx)})`
      }
    }
    if (this.as) {
      const alias = this.as.restore(ctx).unwrap()
      return new Result<string, RestoreError>(`${expr.unwrap()}${overStr} ${alias}`, undefined)
    }
    return new Result<string, RestoreError>(`${expr.unwrap()}${overStr}`, undefined)
  }

  // todo: implement me!
  public visit<T>(v: Visitor<T>): [T, boolean] {
    return v.enter(this)
  }
}
