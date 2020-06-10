import { Parse } from './src/parser/sql'

export function init() {}

export function exec(sql: string, ctx: string) {
  Parse(sql, ctx)
}
