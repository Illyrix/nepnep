import { AST } from '../parser/ast/ast'
import { ExecutorError, ExecutorErrorContext } from '../common/error'
import { Context } from '../context/context'
import { Result } from '../common'

interface ResultNoErr {
  count: number
}

export type ExecResult = Result<ExecutorError, ResultNoErr, ExecutorErrorContext>

export interface Executor {
  execute: (sql: AST, ctx: Context) => ExecResult
}
