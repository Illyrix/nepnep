import { StorageError } from './error'
import { RowInStorage } from './structure'
import { Result } from '../common'

export interface DataSet {
  count: number
  iter: (cb: (r: RowInStorage) => boolean) => void
  data: () => RowInStorage[]
}

type DataSetResult = Result<DataSet, StorageError>

/**
 *
 *
 * @export
 * @interface Storage
 */
export interface Storage {
  add: () => DataSetResult
  delete: () => DataSetResult
  update: () => DataSetResult
  find: () => DataSetResult
}
