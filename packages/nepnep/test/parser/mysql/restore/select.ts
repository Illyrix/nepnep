import mocha from 'mocha'
import chai from 'chai'
import { MysqlSyntax } from '../../../../src/parser/'
import { RestoreContext } from '../../../../src/context/context'
import { buildRestoreCtx } from './helper'

mocha.describe('restoreSelect', () => {
  mocha.it('restore alias clause', (done) => {
    const ctx: RestoreContext = buildRestoreCtx({
      capitalize: true,
    })
    const al = new MysqlSyntax.Alias('table_0')
    const res = al.restore(ctx)
    chai.expect(res.ok()).eq(true, 'should restore without error')
    chai.expect(res.unwrap()).eq('AS table_0')
    done()
  })
})
