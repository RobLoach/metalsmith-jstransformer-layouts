var assertDir = require('assert-dir-equal')
var jstransformerTemplate = require('../')
var Metalsmith = require('metalsmith')

function test (name, options) {
  /* globals it describe */
  it(name, function (done) {
    Metalsmith('test/fixtures/' + name)
      .use(jstransformerTemplate(options || {}))
      .build(function (err) {
        if (err) {
          return done(err)
        }
        assertDir('test/fixtures/' + name + '/build', 'test/fixtures/' + name + '/expected')
        return done()
      })
  })
}

describe('metalsmith-jstransformer', function () {
  test('basic')
  test('include')
  test('multiple')
})
