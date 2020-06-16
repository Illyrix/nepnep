import { Parse } from './src/parser/sql'
import { Mysql, defaultContext } from './src/parser'

export function init() {}

export function exec(sql: string, ctx: string) {
  Parse(sql, ctx)
}
