import { StorageError, StorageErrorContext } from '../common/error'
import { RowInStorage } from './structure'
import { Result } from '../common'

export interface DataSet {
  count: number
  iter: (cb: (r: RowInStorage) => boolean) => void
  data: () => RowInStorage[]
}

type DataSetResult = Result<StorageError, DataSet, StorageErrorContext>

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