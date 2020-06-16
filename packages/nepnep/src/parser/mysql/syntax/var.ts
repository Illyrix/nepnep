import { Node, Visitor } from '../common'
import { RestoreError } from '../../error'
import { Result } from '../../../common'
import { RestoreContext } from '../../../context/context'

// used in stored programs
export class Var implements Node {
  public name: string

  public constructor(name?: string) {
    this.name = name ? name : ''
  }

  public restore(ctx?: RestoreContext) {
    return new Result<string, RestoreError>(this.name, undefined)
  }

  // todo: implement me!
  public visit<T>(v: Visitor<T>): [T, boolean] {
    return v.enter(this)
  }
}
