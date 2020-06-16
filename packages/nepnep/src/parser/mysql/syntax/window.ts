import { Node, Visitor, Expr } from '../common'
import { RestoreContext } from '../../../context/context'
import { RestoreError } from '../../error'
import { Result } from '../../../common'
import { OrderBy } from './select'

// frame specification will be added later
// see https://dev.mysql.com/doc/refman/8.0/en/window-functions-frames.html
export class WindowSpec implements Node {
  public windowName?: string
  public partitionBy?: PartitionBy
  public orderBy?: OrderBy

  public constructor(wn?: string, pb?: PartitionBy, ob?: OrderBy) {
    ;[this.windowName, this.partitionBy, this.orderBy] = [wn, pb, ob]
  }

  public restore(ctx?: RestoreContext) {
    if (!this.windowName && !this.partitionBy && !this.orderBy) {
      return new Result<string, RestoreError>('', undefined)
    }
    const out: string[] = []
    if (this.windowName) {
      out.push(this.windowName)
    }
    if (this.partitionBy) {
      const part = this.partitionBy.restore(ctx)
      if (!part.ok()) {
        return new Result<string, RestoreError>('', part.error())
      }
      if (part.unwrap() !== '') {
        out.push(part.unwrap())
      }
    }
    if (this.orderBy) {
      const order = this.orderBy.restore(ctx)
      if (!order.ok()) {
        return new Result<string, RestoreError>('', order.error())
      }
      if (order.unwrap() !== '') {
        out.push(order.unwrap())
      }
    }
    return new Result<string, RestoreError>(out.join(' '), undefined)
  }

  // todo: implement me!
  public visit<T>(v: Visitor<T>): [T, boolean] {
    return v.enter(this)
  }
}

// different to PARTITION table
export class PartitionBy implements Node {
  public exprs: Expr[] = []

  public restore(ctx?: RestoreContext) {
    if (this.exprs.length === 0) {
      return new Result<string, RestoreError>('', undefined)
    }
    const PARTITIONBYKeyword = ctx?.capitalize ? 'PARTITION BY' : 'partition by'
    try {
      let out = PARTITIONBYKeyword + ' ' + this.exprs.map((v) => v.restore(ctx).unwrap()).join(', ')
      return new Result<string, RestoreError>(out, undefined)
    } catch (e) {
      if (e instanceof RestoreError) {
        return new Result<string, RestoreError>('', undefined)
      }
      throw e
    }
  }

  // todo: implement me!
  public visit<T>(v: Visitor<T>): [T, boolean] {
    return v.enter(this)
  }
}
