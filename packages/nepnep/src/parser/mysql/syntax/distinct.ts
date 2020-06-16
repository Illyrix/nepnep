import { Node, Visitor } from '../common'
import { Result } from '../../../common'
import { RestoreError } from '../../error'
import { RestoreContext } from '../../../context/context'

// DISTINCTROW is a synonym for DISTINCT
export enum DistinctType {
  ALL = 'all', // default
  DISTINCT = 'distinct',
  DISTINCTROW = 'distinctrow',
}

export class Distinct implements Node {
  public type: DistinctType

  public constructor(dt?: DistinctType) {
    this.type = dt ? dt : DistinctType.ALL
  }

  public restore(ctx?: RestoreContext) {
    const dist = ctx?.capitalize ? this.type.toUpperCase() : this.type
    return new Result<string, RestoreError>(dist, undefined)
  }

  // todo: implement me!
  public visit<T>(v: Visitor<T>): [T, boolean] {
    return v.enter(this)
  }
}
