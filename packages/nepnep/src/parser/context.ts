import { Context } from "../context/context"

export function ContextParse(s: string): Context {
    const ctx = {ignoreWarn: true}
    Object.assign(ctx, JSON.parse(s))
    return ctx
}
