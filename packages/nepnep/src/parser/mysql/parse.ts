import MySQLParser, { SqlMode, ParserOptions } from 'ts-mysql-parser'
import { AST } from './common'
import { Context } from '../../context/context'
import { ParserError } from '../error'
import { Result } from '../../common'

export function newParser(ctx: Context): MySQLParser {
  const options: ParserOptions = { ...ctx.parser }
  return new MySQLParser(options)
}

export function parse(text: string, ctx: Context): Result<AST, ParserError> {
  // todo: control parser by parseContext
  const parseContext = undefined
  const parseResult = newParser(ctx).parse(text, parseContext)
  if (parseResult.lexerError) {
    const { offset } = parseResult.lexerError.data
    const { character, line } = parseResult.lexerError.data.position
    const parserErr = new ParserError({
      lineNum: line,
      offset: offset,
      charNum: character,
      ...parseResult.lexerError,
    })
    return new Result<AST, ParserError>([], parserErr)
  }
  if (parseResult.parserError) {
    const { character, line, expectedTokens, offendingToken } = parseResult.parserError.data
    const parserErr = new ParserError({
      lineNum: line,
      offset: 0,
      charNum: character,
      ...parseResult.parserError,
    })
    return new Result<AST, ParserError>([], parserErr)
  }
  // console.log(parseResult.tree)
  console.log(parseResult.tree.getChild(0).getChild(0).getChild(0))
  return new Result<AST, ParserError>([], undefined)
}
