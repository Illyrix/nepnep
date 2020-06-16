import { Node, Visitor } from '../common'
import { RestoreError } from '../../error'
import { Result } from '../../../common'
import { RestoreContext } from '../../../context/context'

export class Alias implements Node {
  public aliasName: string

  public constructor(alias?: string) {
    this.aliasName = alias ? alias : ''
  }

  public restore(ctx?: RestoreContext) {
    const ASKeywords = ctx?.capitalize ? 'AS' : 'as'
    return new Result<string, RestoreError>(`${ASKeywords} ${this.aliasName}`, undefined)
  }

  // todo: implement me!
  public visit<T>(v: Visitor<T>): [T, boolean] {
    return v.enter(this)
  }
}
