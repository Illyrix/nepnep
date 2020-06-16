import { Visitor } from '../common'
import { Result } from '../../../common'
import { RestoreError } from '../../error'
import { TableReference } from './table-reference'
import { Alias } from './alias'
import { RestoreContext } from '../../../context/context'

// todo: partition table
export class Table implements TableReference {
  // tableName, databaseName, serverName
  public name: [string, string?, string?] = ['']
  public alias?: Alias

  public restore(ctx?: RestoreContext) {
    const fullname = this.getFullName()
    if (!fullname.ok()) {
      return new Result<string, RestoreError>('', fullname.error())
    }
    return new Result<string, RestoreError>(
      fullname.unwrap() + (this.alias === undefined ? '' : this.alias.restore(ctx).unwrap()),
      undefined,
    )
  }

  // todo: implement me!
  public visit<T>(v: Visitor<T>): [T, boolean] {
    return v.enter(this)
  }

  private getFullName(): Result<string, RestoreError> {
    if (this.name.length === 3) {
      if (!this.name[2] && this.name[1]) {
        return new Result<string, RestoreError>('', new RestoreError({ message: 'expect database name' }))
      }
    }
    return new Result<string, RestoreError>(
      this.name.reduceRight((p, c) => (c === undefined || c === '' ? p : p + '.' + c), '') as string,
      undefined,
    )
  }
}
