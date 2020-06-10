import { AST } from '../parser/ast/ast'
import { ExecutorError } from '../common/error'
import { Context } from '../context/context'
import { Result } from '../common'

interface ResultNoErr {
  count: number
}

export type ExecResult = Result<ResultNoErr, ExecutorError>

export interface Executor {
  execute: (sql: AST, ctx: Context) => ExecResult
}
