import { AST } from '../parser/mysql/common'
import { ExecutorError } from './error'
import { Context } from '../context/context'
import { Result } from '../common'

interface ResultNoErr {
  count: number
}

export type ExecResult = Result<ResultNoErr, ExecutorError>

// implement a state machine
export interface Executor {
  execute: (sql: AST, ctx: Context) => ExecResult
}
