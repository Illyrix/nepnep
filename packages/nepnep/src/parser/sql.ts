import { AST } from './ast'
import { Context } from '../context/context'

export function Parse(s: string, ctx: Context): AST {
    return {
        visit(): void {
            // return void
        },
    }
}
